import express from 'express';
import authRoutes from './auth.js';
import reservationRoutes from './reservations.js';
import adminRoutes from './admin.js';
import parkingSlotsRoutes from './parkingSlots.js';
import { adminAuth } from '../middleware/adminAuth.js';
import managerRoutes from './manager.js';

const router = express.Router();

// Prefix /api/auth untuk route otentikasi
router.use('/api/auth', authRoutes);

// Prefix /api/reservations untuk route reservasi
router.use('/api/reservations', reservationRoutes);

// Prefix /api/admin, dengan middleware adminAuth
router.use('/api/admin', adminAuth, adminRoutes);

// Prefix /api/parking-slots untuk kelola slot parkir
router.use('/api/parking-slots', parkingSlotsRoutes);

// Prefix /api/manager untuk kelola manager
router.use('/api/manager', managerRoutes);

export default router;