import pool from '../config/db.js';

const chequePaymentModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM cheque_payments');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM cheque_payments WHERE cheque_id = $1', [id]);
    return rows[0];
  },

  async create(chequePayment) {
    const { cheque_number, bank_code, branch_details, amount, issue_date, status_id } = chequePayment;
    const { rows } = await pool.query(
      'INSERT INTO cheque_payments (cheque_number, bank_code, branch_details, amount, issue_date, status_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cheque_number, bank_code, branch_details, amount, issue_date, status_id]
    );
    return rows[0];
  },

  async update(id, chequePayment) {
    const { cheque_number, bank_code, branch_details, amount, issue_date, status_id } = chequePayment;
    const { rows } = await pool.query(
      'UPDATE cheque_payments SET cheque_number = $1, bank_code = $2, branch_details = $3, amount = $4, issue_date = $5, status_id = $6 WHERE cheque_id = $7 RETURNING *',
      [cheque_number, bank_code, branch_details, amount, issue_date, status_id, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM cheque_payments WHERE cheque_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default chequePaymentModel;
