import express from 'express';
import db from '../config/database.js';  // Pastikan path sesuai
import { managerAuth } from '../middleware/managerAuth.js';

const router = express.Router();

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
        DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(r.start_time, '%Y-%m-%d %H:%i:%s') as start_time,
        DATE_FORMAT(r.end_time, '%Y-%m-%d %H:%i:%s') as end_time
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.userId]);

    console.log('Reservations fetched:', reservations); // Debug
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data reservasi' });
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
        SUM(CASE WHEN payment_status IN ('paid', 'completed') THEN total_cost ELSE 0 END) as total_revenue
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ?
    `, [req.user.userId]);

    // Get today's statistics
    const [todayStats] = await db.execute(`
      SELECT 
        COUNT(*) as today_reservations,
        SUM(CASE WHEN payment_status IN ('paid', 'completed') THEN total_cost ELSE 0 END) as today_revenue
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE m.manager_id = ? 
      AND DATE(r.created_at) = CURDATE()
    `, [req.user.userId]);

    console.log('Statistics fetched:', { ...stats[0], ...todayStats[0] }); // Debug
    res.json({
      ...stats[0],
      ...todayStats[0]
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik' });
  }
});

// Update payment status
router.put('/reservations/:id/payment', managerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_note } = req.body;

    // Validasi status pembayaran yang diperbolehkan
    const allowedStatuses = ['pending', 'paid', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({ message: 'Status pembayaran tidak valid' });
    }

    // Pastikan reservasi ada dan dimiliki oleh mall yang dikelola manager
    const [[reservation]] = await db.execute(`
      SELECT r.* 
      FROM reservations r
      JOIN malls m ON r.mall_id = m.id
      WHERE r.id = ? AND m.manager_id = ?
    `, [id, req.user.userId]);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
    }

    // Update status pembayaran
    await db.execute(
      `UPDATE reservations 
       SET payment_status = ?, 
           payment_note = ?, 
           updated_at = NOW() 
       WHERE id = ?`,
      [payment_status, payment_note || null, id]
    );

    // Ambil data yang sudah diupdate
    const [[updatedReservation]] = await db.execute(`
      SELECT r.*, 
             u.name as user_name, 
             u.email as user_email
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [id]);

    res.json({ 
      message: 'Status pembayaran berhasil diupdate',
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate pembayaran' });
  }
});

export default router; 