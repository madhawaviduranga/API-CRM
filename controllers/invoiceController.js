import invoiceModel from '../models/invoiceModel.js';
import activityHistoryModel from '../models/activityHistoryModel.js';
import AppError from '../utils/AppError.js';

const invoiceController = {
  async getAllInvoices(req, res, next) {
    try {
      const invoices = await invoiceModel.getAll();
      res.json(invoices);
    } catch (error) {
      next(new AppError('Error fetching invoices', 500));
    }
  },

  async getInvoiceById(req, res, next) {
    try {
      const invoice = await invoiceModel.getById(req.params.id);
      if (invoice) {
        res.json(invoice);
      } else {
        next(new AppError('Invoice not found', 404));
      }
    } catch (error) {
      next(new AppError('Error fetching invoice', 500));
    }
  },

  async createInvoice(req, res, next) {
    try {
      const newInvoice = await invoiceModel.create(req.body);
      await activityHistoryModel.create({
        user_id: req.user.id,
        action_type: 'CREATE_INVOICE',
        details: `Created invoice ${newInvoice.invoice_number}`
      });
      res.status(201).json(newInvoice);
    } catch (error) {
      next(new AppError('Error creating invoice', 500));
    }
  },

  async updateInvoice(req, res, next) {
    try {
      const updatedInvoice = await invoiceModel.update(req.params.id, req.body);
      if (updatedInvoice) {
        await activityHistoryModel.create({
          user_id: req.user.id,
          action_type: 'UPDATE_INVOICE',
          details: `Updated invoice ${updatedInvoice.invoice_number}`
        });
        res.json(updatedInvoice);
      } else {
        next(new AppError('Invoice not found', 404));
      }
    } catch (error) {
      next(new AppError('Error updating invoice', 500));
    }
  },

  async deleteInvoice(req, res, next) {
    try {
      const deletedInvoice = await invoiceModel.delete(req.params.id);
      if (deletedInvoice) {
        await activityHistoryModel.create({
          user_id: req.user.id,
          action_type: 'DELETE_INVOICE',
          details: `Deleted invoice ${deletedInvoice.invoice_number}`
        });
        res.json({ message: 'Invoice deleted' });
      } else {
        next(new AppError('Invoice not found', 404));
      }
    } catch (error) {
      next(new AppError('Error deleting invoice', 500));
    }
  }
};

export default invoiceController;
