import express from 'express';
import invoiceController from '../controllers/invoiceController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('read_invoice'), invoiceController.getAllInvoices);
router.get('/:id', restrictTo('read_invoice'), invoiceController.getInvoiceById);
router.post('/', restrictTo('create_invoice'), invoiceController.createInvoice);
router.put('/:id', restrictTo('update_invoice'), invoiceController.updateInvoice);
router.delete('/:id', restrictTo('delete_invoice'), invoiceController.deleteInvoice);

export default router;
