import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const userModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return rows[0];
  },

  async create(user) {
    const { username, password, email, full_name, role_id } = user;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash, email, full_name, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, password_hash, email, full_name, role_id]
    );
    return rows[0];
  },

  async update(id, user) {
    const { username, email, full_name, role_id, is_active } = user;
    const { rows } = await pool.query(
      'UPDATE users SET username = $1, email = $2, full_name = $3, role_id = $4, is_active = $5 WHERE user_id = $6 RETURNING *',
      [username, email, full_name, role_id, is_active, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async getPermissions(userId) {
    const { rows } = await pool.query(
      `SELECT p.permission_name
       FROM permissions p
       JOIN role_permissions rp ON p.permission_id = rp.permission_id
       JOIN roles r ON rp.role_id = r.role_id
       JOIN users u ON r.role_id = u.role_id
       WHERE u.user_id = $1`,
      [userId]
    );
    return rows.map(row => row.permission_name);
  }
};

export default userModel;
