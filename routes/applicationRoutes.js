import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public — anyone can apply (no login required)
router.post('/', upload.single('resume'), applyForJob);

// Logged-in user — view own applications
router.get('/me', protect, getMyApplications);

// Admin — view all applications
router.get('/', protect, adminOnly, getApplications);

// Admin — update application status
router.put('/:id', protect, adminOnly, updateApplicationStatus);

export default router;
