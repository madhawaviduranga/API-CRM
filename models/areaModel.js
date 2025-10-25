import pool from '../config/db.js';

const areaModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM areas');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM areas WHERE area_id = $1', [id]);
    return rows[0];
  },

  async create(area) {
    const { area_name, description } = area;
    const { rows } = await pool.query(
      'INSERT INTO areas (area_name, description) VALUES ($1, $2) RETURNING *',
      [area_name, description]
    );
    return rows[0];
  },

  async update(id, area) {
    const { area_name, description } = area;
    const { rows } = await pool.query(
      'UPDATE areas SET area_name = $1, description = $2 WHERE area_id = $3 RETURNING *',
      [area_name, description, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM areas WHERE area_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default areaModel;
