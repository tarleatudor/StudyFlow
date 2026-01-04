import { Router } from "express";
import { getActivityStatsById, sendFeedback } from "../controllers/feedbackController.mjs";



const router = Router()

// students endpoint - sending feedback
router.post('/send', sendFeedback);

// professor endpoint - viewing stats
router.get('/stats/:id', getActivityStatsById);

export default router;