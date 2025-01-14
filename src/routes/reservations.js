import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Create reservation
router.post('/create', async (req, res) => {
  try {
    const {
      user_id,
      mall_id,
      parking_slot,
      start_time,
      vehicle_type,
      plate_number,
      duration,
      total_cost
    } = req.body;

    // Hitung end_time berdasarkan start_time dan duration
    const end_time = new Date(new Date(start_time).getTime() + duration * 60 * 60 * 1000);

    // Validasi input
    if (!user_id || !mall_id || !parking_slot || !start_time || 
        !vehicle_type || !plate_number || !duration || !total_cost) {
      return res.status(400).json({ 
        message: 'Semua field harus diisi',
        received: { user_id, mall_id, parking_slot, start_time, vehicle_type, plate_number, duration, total_cost }
      });
    }

    // Cek apakah slot sudah dipesan
    const [existingReservation] = await db.query(
      `SELECT * FROM reservations 
       WHERE parking_slot = ? 
       AND mall_id = ?
       AND ((start_time BETWEEN ? AND ?) 
       OR (end_time BETWEEN ? AND ?))
       AND payment_status != 'cancelled'`,
      [parking_slot, mall_id, start_time, end_time, start_time, end_time]
    );

    if (existingReservation.length > 0) {
      return res.status(400).json({ 
        message: 'Slot parkir sudah dipesan untuk waktu tersebut' 
      });
    }

    // Simpan reservasi
    const [result] = await db.query(
      `INSERT INTO reservations 
       (user_id, mall_id, parking_slot, start_time, end_time, 
        vehicle_type, plate_number, duration, total_cost, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id, mall_id, parking_slot, start_time, end_time, 
       vehicle_type, plate_number, duration, total_cost]
    );

    // Ambil data reservasi yang baru dibuat
    const [newReservation] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Reservasi berhasil dibuat',
      reservation: newReservation[0]
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat membuat reservasi',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get booked slots
router.get('/booked-slots', async (req, res) => {
  try {
    const { mall_id, date } = req.query;
    const [bookedSlots] = await db.query(
      `SELECT parking_slot, start_time, end_time 
       FROM reservations 
       WHERE mall_id = ? 
       AND DATE(start_time) = DATE(?)
       AND payment_status != 'cancelled'`,
      [mall_id, date]
    );
    res.json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user reservations
router.get('/user/:userId', async (req, res) => {
  try {
    const [reservations] = await db.query(
      `SELECT r.*, m.name as mall_name 
       FROM reservations r
       JOIN malls m ON r.mall_id = m.id
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 