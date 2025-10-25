import dashboardModel from '../models/dashboardModel.js';
import AppError from '../utils/AppError.js';

const dashboardController = {
  async getDailySummary(req, res, next) {
    try {
      const { date } = req.query;
      const data = await dashboardModel.getDailySummary(date || new Date());
      res.json(data);
    } catch (error) {
      next(new AppError('Error fetching daily summary', 500));
    }
  },

  async getMonthlySummary(req, res, next) {
    try {
      const { year, month } = req.query;
      const data = await dashboardModel.getMonthlySummary(year || new Date().getFullYear(), month || new Date().getMonth() + 1);
      res.json(data);
    } catch (error) {
      next(new AppError('Error fetching monthly summary', 500));
    }
  },

  async getAnnualSummary(req, res, next) {
    try {
      const { year } = req.query;
      const data = await dashboardModel.getAnnualSummary(year || new Date().getFullYear());
      res.json(data);
    } catch (error) {
      next(new AppError('Error fetching annual summary', 500));
    }
  },
};

export default dashboardController;
