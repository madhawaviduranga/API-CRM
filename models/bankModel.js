import pool from '../config/db.js';

const bankModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM banks');
    return rows;
  },

  async getByCode(code) {
    const { rows } = await pool.query('SELECT * FROM banks WHERE bank_code = $1', [code]);
    return rows[0];
  },

  async create(bank) {
    const { bank_code, bank_name } = bank;
    const { rows } = await pool.query(
      'INSERT INTO banks (bank_code, bank_name) VALUES ($1, $2) RETURNING *',
      [bank_code, bank_name]
    );
    return rows[0];
  },

  async update(code, bank) {
    const { bank_name } = bank;
    const { rows } = await pool.query(
      'UPDATE banks SET bank_name = $1 WHERE bank_code = $2 RETURNING *',
      [bank_name, code]
    );
    return rows[0];
  },

  async delete(code) {
    const { rows } = await pool.query('DELETE FROM banks WHERE bank_code = $1 RETURNING *', [code]);
    return rows[0];
  }
};

export default bankModel;
