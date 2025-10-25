import express from 'express';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/daily-summary', dashboardController.getDailySummary);
router.get('/monthly-summary', dashboardController.getMonthlySummary);
router.get('/annual-summary', dashboardController.getAnnualSummary);

export default router;
