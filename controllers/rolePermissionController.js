import rolePermissionModel from '../models/rolePermissionModel.js';
import AppError from '../utils/AppError.js';

const rolePermissionController = {
  async getAllRolePermissions(req, res, next) {
    try {
      const rolePermissions = await rolePermissionModel.getAll();
      res.json(rolePermissions);
    } catch (error) {
      next(new AppError('Error fetching role permissions', 500));
    }
  },

  async getRolePermissionById(req, res, next) {
    try {
      const rolePermission = await rolePermissionModel.getById(req.params.id);
      if (rolePermission) {
        res.json(rolePermission);
      } else {
        next(new AppError('Role permission not found', 404));
      }
    } catch (error) {
      next(new AppError('Error fetching role permission', 500));
    }
  },

  async createRolePermission(req, res, next) {
    try {
      const newRolePermission = await rolePermissionModel.create(req.body);
      res.status(201).json(newRolePermission);
    } catch (error) {
      next(new AppError('Error creating role permission', 500));
    }
  },

  async updateRolePermission(req, res, next) {
    try {
      const updatedRolePermission = await rolePermissionModel.update(req.params.id, req.body);
      if (updatedRolePermission) {
        res.json(updatedRolePermission);
      } else {
        next(new AppError('Role permission not found', 404));
      }
    } catch (error) {
      next(new AppError('Error updating role permission', 500));
    }
  },

  async deleteRolePermission(req, res, next) {
    try {
      const deletedRolePermission = await rolePermissionModel.delete(req.params.id);
      if (deletedRolePermission) {
        res.json({ message: 'Role permission deleted' });
      } else {
        next(new AppError('Role permission not found', 404));
      }
    } catch (error) {
      next(new AppError('Error deleting role permission', 500));
    }
  }
};

export default rolePermissionController;
