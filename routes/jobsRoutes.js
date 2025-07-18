import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {addJobs, getJobs, updateJobs, deleteJobs} from '../controller/jobsController.js'

const router = express.Router();

router.post('/', protect, restrictTo("COMPANY"), addJobs);
router.get('/', protect, restrictTo("COMPANY", "JOBSEEKER"), getJobs);
router.put('/:id', protect, restrictTo("COMPANY"), updateJobs);
router.delete('/:id', protect, restrictTo("COMPANY"), deleteJobs);

export default router;