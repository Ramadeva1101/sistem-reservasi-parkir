import express from 'express';
import { managerAuth } from '../../middleware/managerAuth.js';
import db from '../../config/db.js';

const router = express.Router();

// Get parking lots
router.get('/parking-lots', managerAuth, async (req, res) => {
  try {
    const [parkingLots] = await db.execute(
      'SELECT * FROM parking_lots WHERE manager_id = ?',
      [req.user.userId]
    );
    res.json(parkingLots);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Update parking lot
router.put('/parking-lots/:id', managerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, available } = req.body;
    
    await db.execute(
      'UPDATE parking_lots SET capacity = ?, available = ? WHERE id = ? AND manager_id = ?',
      [capacity, available, id, req.user.userId]
    );
    res.json({ message: 'Data parkir berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Get all reservations with payment status
router.get('/reservations', managerAuth, async (req, res) => {
  try {
    const [reservations] = await db.execute(`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        m.name as mall_name,
        r.payment_status,
        r.total_cost,
        r.created_at,
        r.start_time,
        r.end_time
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.userId]);

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data reservasi' });
  }
});

// Update payment status
router.put('/reservations/:id/payment', managerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_note } = req.body;

    // Validasi status pembayaran yang diperbolehkan
    const allowedStatuses = ['pending', 'paid', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({ message: 'Status pembayaran tidak valid' });
    }

    // Pastikan reservasi ada dan dimiliki oleh mall yang dikelola manager
    const [reservation] = await db.execute(`
      SELECT r.* 
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE r.id = ? AND m.manager_id = ?
    `, [id, req.user.userId]);

    if (reservation.length === 0) {
      return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
    }

    // Update status pembayaran dan catatan
    await db.execute(
      'UPDATE reservations SET payment_status = ?, payment_note = ?, updated_at = NOW() WHERE id = ?',
      [payment_status, payment_note || null, id]
    );

    // Ambil data reservasi yang sudah diupdate
    const [updatedReservation] = await db.execute(`
      SELECT r.*, u.name as user_name, m.name as mall_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN malls m ON r.mall_id = m.id
      WHERE r.id = ?
    `, [id]);

    res.json({ 
      message: 'Status pembayaran berhasil diupdate',
      reservation: updatedReservation[0]
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate status pembayaran' });
  }
});

// Get payment statistics
router.get('/payment-statistics', managerAuth, async (req, res) => {
  try {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_reservations,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_payments,
        SUM(CASE WHEN payment_status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
        SUM(CASE WHEN payment_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_payments,
        SUM(CASE WHEN payment_status = 'paid' OR payment_status = 'completed' THEN total_cost ELSE 0 END) as total_revenue
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ?
    `, [req.user.userId]);

    // Tambahkan statistik per hari ini
    const [todayStats] = await db.execute(`
      SELECT 
        COUNT(*) as today_reservations,
        SUM(CASE WHEN payment_status = 'paid' OR payment_status = 'completed' THEN total_cost ELSE 0 END) as today_revenue
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ? 
      AND DATE(r.created_at) = CURDATE()
    `, [req.user.userId]);

    res.json({
      ...stats[0],
      ...todayStats[0]
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik pembayaran' });
  }
});

// Get available parking slots
router.get('/available-slots', managerAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const [slots] = await db.execute(`
      SELECT 
        parking_slot,
        COUNT(*) as booking_count
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ?
      AND DATE(start_time) = DATE(?)
      AND payment_status != 'cancelled'
      GROUP BY parking_slot
    `, [req.user.userId, date]);

    res.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data slot' });
  }
});

export default router; 