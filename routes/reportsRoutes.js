import express from 'express';
import reportsController from '../controllers/reportsController.js';

const router = express.Router();

router.get('/status-overview', reportsController.getStatusOverview);
router.get('/outstanding-summary', reportsController.getOutstandingSummary);
router.get('/revenue-by-area', reportsController.getRevenueByArea);
router.get('/invoice-overdue-analysis', reportsController.getInvoiceOverdueAnalysis);
router.get('/payment-methods', reportsController.getPaymentMethods);
router.get('/sales-trend', reportsController.getSalesTrend);
router.get('/daily-sales', reportsController.getDailySales);
router.get('/monthly-sales', reportsController.getMonthlySales);
router.get('/top-customers', reportsController.getTopCustomers);
router.get('/customer-credit-summary', reportsController.getCustomerCreditSummary);
router.get('/reliability-distribution', reportsController.getReliabilityDistribution);
router.get('/cheque-status-overview', reportsController.getChequeStatusOverview);
router.get('/bounced-cheques', reportsController.getBouncedCheques);
router.get('/bounced-cheque-invoices', reportsController.getBouncedChequeInvoices);
router.get('/on-hand-cheques', reportsController.getOnHandCheques);

export default router;
