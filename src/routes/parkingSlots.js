import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get all parking slots
router.get('/', async (req, res) => {
  try {
    const [slots] = await db.query('SELECT * FROM parking_slots ORDER BY floor, slot_number');
    res.json(slots);
  } catch (error) {
    console.error('Error fetching parking slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new parking slot
router.post('/', async (req, res) => {
  try {
    const { slot_number, floor, type, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO parking_slots (slot_number, floor, type, status) VALUES (?, ?, ?, ?)',
      [slot_number, floor, type, status]
    );
    res.status(201).json({ id: result.insertId, slot_number, floor, type, status });
  } catch (error) {
    console.error('Error creating parking slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update parking slot
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query(
      'UPDATE parking_slots SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    res.json({ message: 'Parking slot updated successfully' });
  } catch (error) {
    console.error('Error updating parking slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete parking slot
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM parking_slots WHERE id = ?', [req.params.id]);
    res.json({ message: 'Parking slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting parking slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 