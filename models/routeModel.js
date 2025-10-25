import pool from '../config/db.js';

const routeModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM routes');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM routes WHERE route_id = $1', [id]);
    return rows[0];
  },

  async create(route) {
    const { route_name, area_id, description } = route;
    const { rows } = await pool.query(
      'INSERT INTO routes (route_name, area_id, description) VALUES ($1, $2, $3) RETURNING *',
      [route_name, area_id, description]
    );
    return rows[0];
  },

  async update(id, route) {
    const { route_name, area_id, description } = route;
    const { rows } = await pool.query(
      'UPDATE routes SET route_name = $1, area_id = $2, description = $3 WHERE route_id = $4 RETURNING *',
      [route_name, area_id, description, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM routes WHERE route_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default routeModel;
