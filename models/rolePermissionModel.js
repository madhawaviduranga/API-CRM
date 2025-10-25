import pool from '../config/db.js';

const rolePermissionModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM role_permissions');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM role_permissions WHERE role_permission_id = $1', [id]);
    return rows[0];
  },

  async create(rolePermission) {
    const { role_id, permission_id } = rolePermission;
    const { rows } = await pool.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *',
      [role_id, permission_id]
    );

    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM role_permissions WHERE role_permission_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default rolePermissionModel;
