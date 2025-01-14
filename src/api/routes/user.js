import express from 'express';
import { auth, checkRole } from '../../middleware/auth.js';
import db from '../../config/db.js';

const router = express.Router();

// Get user reservations
router.get('/reservations', auth, checkRole(['user']), async (req, res) => {
  try {
    const [reservations] = await db.execute(`
      SELECT r.*, p.name as parking_name, p.address as parking_address
      FROM reservations r
      JOIN parking_lots p ON r.parking_lot_id = p.id
      WHERE r.user_id = ?
    `, [req.user.userId]);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Cancel reservation
router.put('/reservations/:id/cancel', auth, checkRole(['user']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'UPDATE reservations SET status = "cancelled" WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );
    res.json({ message: 'Reservasi berhasil dibatalkan' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

export default router; 