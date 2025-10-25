import pool from '../config/db.js';

const roleModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM roles');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM roles WHERE role_id = $1', [id]);
    return rows[0];
  },

  async create(role) {
    const { role_name } = role;
    const { rows } = await pool.query(
      'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
      [role_name]
    );
    return rows[0];
  },

  async update(id, role) {
    const { role_name } = role;
    const { rows } = await pool.query(
      'UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [role_name, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM roles WHERE role_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default roleModel;
