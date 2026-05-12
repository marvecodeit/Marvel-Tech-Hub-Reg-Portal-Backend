import express from 'express'

import { 
    createJob,
    getJobs,
    getSingleJob,
    deleteJob
} from '../controllers/jobController.js'

import {  protect, adminOnly  } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public Routes
router.get('/', getJobs)
router.get('/:id', getSingleJob)

// Admin Routes
router.post('/', protect, adminOnly, createJob)

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteJob
)

export default router