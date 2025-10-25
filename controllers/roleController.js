import roleModel from '../models/roleModel.js';

const roleController = {
  async getAllRoles(req, res) {
    try {
      const roles = await roleModel.getAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching roles', error });
    }
  },

  async getRoleById(req, res) {
    try {
      const role = await roleModel.getById(req.params.id);
      if (role) {
        res.json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching role', error });
    }
  },

  async createRole(req, res) {
    try {
      const newRole = await roleModel.create(req.body);
      res.status(201).json(newRole);
    } catch (error) {
      res.status(500).json({ message: 'Error creating role', error });
    }
  },

  async updateRole(req, res) {
    try {
      const updatedRole = await roleModel.update(req.params.id, req.body);
      if (updatedRole) {
        res.json(updatedRole);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating role', error });
    }
  },

  async deleteRole(req, res) {
    try {
      const deletedRole = await roleModel.delete(req.params.id);
      if (deletedRole) {
        res.json({ message: 'Role deleted' });
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting role', error });
    }
  }
};

export default roleController;
