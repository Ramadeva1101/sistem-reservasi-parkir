import express from 'express';
import { auth, checkRole } from '../../middleware/auth.js';
import db from '../../config/db.js';

const router = express.Router();

// Get all users
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Update user role
router.put('/users/:id/role', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'Role berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Delete user
router.delete('/users/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

export default router; 