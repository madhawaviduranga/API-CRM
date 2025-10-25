import returnModel from '../models/returnModel.js';

const returnController = {
  async getAllReturns(req, res) {
    try {
      const returns = await returnModel.getAll();
      res.json(returns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching returns', error });
    }
  },

  async getReturnById(req, res) {
    try {
      const singleReturn = await returnModel.getById(req.params.id);
      if (singleReturn) {
        res.json(singleReturn);
      } else {
        res.status(404).json({ message: 'Return not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching return', error });
    }
  },

  async createReturn(req, res) {
    try {
      const newReturn = await returnModel.create(req.body);
      res.status(201).json(newReturn);
    } catch (error) {
      res.status(500).json({ message: 'Error creating return', error });
    }
  },

  async updateReturn(req, res) {
    try {
      const updatedReturn = await returnModel.update(req.params.id, req.body);
      if (updatedReturn) {
        res.json(updatedReturn);
      } else {
        res.status(404).json({ message: 'Return not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating return', error });
    }
  },

  async deleteReturn(req, res) {
    try {
      const deletedReturn = await returnModel.delete(req.params.id);
      if (deletedReturn) {
        res.json({ message: 'Return deleted' });
      } else {
        res.status(404).json({ message: 'Return not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting return', error });
    }
  }
};

export default returnController;
