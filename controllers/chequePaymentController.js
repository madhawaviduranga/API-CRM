import chequePaymentModel from '../models/chequePaymentModel.js';

const chequePaymentController = {
  async getAllChequePayments(req, res) {
    try {
      const chequePayments = await chequePaymentModel.getAll();
      res.json(chequePayments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cheque payments', error });
    }
  },

  async getChequePaymentById(req, res) {
    try {
      const chequePayment = await chequePaymentModel.getById(req.params.id);
      if (chequePayment) {
        res.json(chequePayment);
      } else {
        res.status(404).json({ message: 'Cheque payment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cheque payment', error });
    }
  },

  async createChequePayment(req, res) {
    try {
      const newChequePayment = await chequePaymentModel.create(req.body);
      res.status(201).json(newChequePayment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating cheque payment', error });
    }
  },

  async updateChequePayment(req, res) {
    try {
      const updatedChequePayment = await chequePaymentModel.update(req.params.id, req.body);
      if (updatedChequePayment) {
        res.json(updatedChequePayment);
      } else {
        res.status(404).json({ message: 'Cheque payment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating cheque payment', error });
    }
  },

  async deleteChequePayment(req, res) {
    try {
      const deletedChequePayment = await chequePaymentModel.delete(req.params.id);
      if (deletedChequePayment) {
        res.json({ message: 'Cheque payment deleted' });
      } else {
        res.status(404).json({ message: 'Cheque payment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting cheque payment', error });
    }
  }
};

export default chequePaymentController;
