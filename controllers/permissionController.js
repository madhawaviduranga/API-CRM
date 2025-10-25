import permissionModel from '../models/permissionModel.js';

const permissionController = {
  async getAllPermissions(req, res) {
    try {
      const permissions = await permissionModel.getAll();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching permissions', error });
    }
  },

  async getPermissionById(req, res) {
    try {
      const permission = await permissionModel.getById(req.params.id);
      if (permission) {
        res.json(permission);
      } else {
        res.status(404).json({ message: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching permission', error });
    }
  },

  async createPermission(req, res) {
    try {
      const newPermission = await permissionModel.create(req.body);
      res.status(201).json(newPermission);
    } catch (error) {
      res.status(500).json({ message: 'Error creating permission', error });
    }
  },

  async updatePermission(req, res) {
    try {
      const updatedPermission = await permissionModel.update(req.params.id, req.body);
      if (updatedPermission) {
        res.json(updatedPermission);
      } else {
        res.status(404).json({ message: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating permission', error });
    }
  },

  async deletePermission(req, res) {
    try {
      const deletedPermission = await permissionModel.delete(req.params.id);
      if (deletedPermission) {
        res.json({ message: 'Permission deleted' });
      } else {
        res.status(404).json({ message: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting permission', error });
    }
  }
};

export default permissionController;
