import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userController = {
  async login(req, res) {
    try {
      const user = await userModel.findByUsername(req.body.username);
      if (user && await bcrypt.compare(req.body.password, user.password_hash)) {
        const token = jwt.sign({ id: user.user_id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userModel.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userModel.getById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  },

  async createUser(req, res) {
    try {
      const newUser = await userModel.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  async updateUser(req, res) {
    try {
      const updatedUser = await userModel.update(req.params.id, req.body);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await userModel.delete(req.params.id);
      if (deletedUser) {
        res.json({ message: 'User deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
};

export default userController;
