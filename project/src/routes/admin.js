import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    // Log activity
    await logActivity(req.user?.id || 1, 'CREATE_USER', `Created new user: ${name} (${role})`);

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Get user details
    const [users] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    // Log activity
    await logActivity(req.user?.id || 1, 'UPDATE_USER_ROLE', 
      `Updated role for ${users[0].name} to ${role}`);

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user details before deletion
    const [users] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    // Log activity
    await logActivity(req.user?.id || 1, 'DELETE_USER', 
      `Deleted user: ${users[0].name}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get activity logs
router.get('/activities', async (req, res) => {
  try {
    const [activities] = await db.query(`
      SELECT a.*, u.name as user_name 
      FROM activities a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 100
    `);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to log activities
async function logActivity(userId, action, details) {
  try {
    await db.query(
      'INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)',
      [userId, action, details]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export default router; 