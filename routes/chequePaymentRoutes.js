import express from 'express';
import chequePaymentController from '../controllers/chequePaymentController.js';

const router = express.Router();

router.get('/', chequePaymentController.getAllChequePayments);
router.get('/:id', chequePaymentController.getChequePaymentById);
router.post('/', chequePaymentController.createChequePayment);
router.put('/:id', chequePaymentController.updateChequePayment);
router.delete('/:id', chequePaymentController.deleteChequePayment);

export default router;
