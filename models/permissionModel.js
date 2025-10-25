import pool from '../config/db.js';

const permissionModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM permissions');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM permissions WHERE permission_id = $1', [id]);
    return rows[0];
  },

  async create(permission) {
    const { permission_name, permission_description } = permission;
    const { rows } = await pool.query(
      'INSERT INTO permissions (permission_name, permission_description) VALUES ($1, $2) RETURNING *',
      [permission_name, permission_description]
    );
    return rows[0];
  },

  async update(id, permission) {
    const { permission_name, permission_description } = permission;
    const { rows } = await pool.query(
      'UPDATE permissions SET permission_name = $1, permission_description = $2 WHERE permission_id = $3 RETURNING *',
      [permission_name, permission_description, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM permissions WHERE permission_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default permissionModel;
