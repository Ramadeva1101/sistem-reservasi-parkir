import jwt from 'jsonwebtoken';

export function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Pastikan role user adalah admin
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Anda bukan admin' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('adminAuth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 