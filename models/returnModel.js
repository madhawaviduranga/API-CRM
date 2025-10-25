import pool from '../config/db.js';

const returnModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM returns');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM returns WHERE return_id = $1', [id]);
    return rows[0];
  },

  async create(returnRecord) {
    const { invoice_id, return_date, returned_items, adjusted_amount, reason } = returnRecord;
    const { rows } = await pool.query(
      'INSERT INTO returns (invoice_id, return_date, returned_items, adjusted_amount, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [invoice_id, return_date, returned_items, adjusted_amount, reason]
    );
    return rows[0];
  },

  async update(id, returnRecord) {
    const { invoice_id, return_date, returned_items, adjusted_amount, reason } = returnRecord;
    const { rows } = await pool.query(
      'UPDATE returns SET invoice_id = $1, return_date = $2, returned_items = $3, adjusted_amount = $4, reason = $5 WHERE return_id = $6 RETURNING *',
      [invoice_id, return_date, returned_items, adjusted_amount, reason, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM returns WHERE return_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default returnModel;
