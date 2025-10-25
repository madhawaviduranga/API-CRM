import pool from '../config/db.js';

const cashPaymentModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM cash_payments');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM cash_payments WHERE payment_id = $1', [id]);
    return rows[0];
  },

  async create(cashPayment) {
    const { invoice_id, amount, payment_date, received_by } = cashPayment;
    const { rows } = await pool.query(
      'INSERT INTO cash_payments (invoice_id, amount, payment_date, received_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [invoice_id, amount, payment_date, received_by]
    );
    return rows[0];
  },

  async update(id, cashPayment) {
    const { invoice_id, amount, payment_date, received_by } = cashPayment;
    const { rows } = await pool.query(
      'UPDATE cash_payments SET invoice_id = $1, amount = $2, payment_date = $3, received_by = $4 WHERE payment_id = $5 RETURNING *',
      [invoice_id, amount, payment_date, received_by, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM cash_payments WHERE payment_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default cashPaymentModel;
