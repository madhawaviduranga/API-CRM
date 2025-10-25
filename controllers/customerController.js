import customerModel from '../models/customerModel.js';
import activityHistoryModel from '../models/activityHistoryModel.js';
import AppError from '../utils/AppError.js';

const customerController = {
  async getAllCustomers(req, res, next) {
    try {
      const { limit, offset, page } = req.pagination;
      const { customers, totalCustomers } = await customerModel.getAll(limit, offset);

      const totalPages = Math.ceil(totalCustomers / limit);

      res.json({
        data: customers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCustomers,
        },
      });
    } catch (error) {
      next(new AppError('Error fetching customers', 500));
    }
  },

  async getCustomerById(req, res, next) {
    try {
      const customer = await customerModel.getById(req.params.id);
      if (customer) {
        res.json(customer);
      } else {
        next(new AppError('Customer not found', 404));
      }
    } catch (error) {
      next(new AppError('Error fetching customer', 500));
    }
  },

  async createCustomer(req, res, next) {
    try {
      const newCustomer = await customerModel.create(req.body);
      await activityHistoryModel.create({
        user_id: req.user.id,
        action_type: 'CREATE_CUSTOMER',
        details: `Created customer ${newCustomer.customer_name}`,
      });
      res.status(201).json(newCustomer);
    } catch (error) {
      next(new AppError('Error creating customer', 500));
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const updatedCustomer = await customerModel.update(req.params.id, req.body);
      if (updatedCustomer) {
        await activityHistoryModel.create({
          user_id: req.user.id,
          action_type: 'UPDATE_CUSTOMER',
          details: `Updated customer ${updatedCustomer.customer_name}`,
        });
        res.json(updatedCustomer);
      } else {
        next(new AppError('Customer not found', 404));
      }
    } catch (error) {
      next(new AppError('Error updating customer', 500));
    }
  },

  async deleteCustomer(req, res, next) {
    try {
      const deletedCustomer = await customerModel.delete(req.params.id);
      if (deletedCustomer) {
        await activityHistoryModel.create({
          user_id: req.user.id,
          action_type: 'DELETE_CUSTOMER',
          details: `Deleted customer ${deletedCustomer.customer_name}`,
        });
        res.json({ message: 'Customer deleted' });
      } else {
        next(new AppError('Customer not found', 404));
      }
    } catch (error) {
      next(new AppError('Error deleting customer', 500));
    }
  },
};

export default customerController;
