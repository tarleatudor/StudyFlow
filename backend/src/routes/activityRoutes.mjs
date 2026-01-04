import {Router} from 'express'
import { createActivity, getAllActivities, getActivityByCode, getActivityById, deleteActivityById } from '../controllers/activityController.mjs';
import { protect } from '../middleware/authMiddleware.mjs'

const router = Router();
router.use(protect)
router.post('/', createActivity);
router.get('/', getAllActivities);
router.get('/:code', getActivityByCode);
router.get('/find/:id', getActivityById);
router.delete('/:id', deleteActivityById);

export default router;