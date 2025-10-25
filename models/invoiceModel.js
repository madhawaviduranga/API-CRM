import pool from '../config/db.js';

const invoiceModel = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM invoices');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM invoices WHERE invoice_id = $1', [id]);
    return rows[0];
  },

  async create(invoice) {
    const { invoice_number, customer_id, invoice_date, due_date, total_amount, status_id } = invoice;
    const { rows } = await pool.query(
      'INSERT INTO invoices (invoice_number, customer_id, invoice_date, due_date, total_amount, status_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [invoice_number, customer_id, invoice_date, due_date, total_amount, status_id]
    );
    return rows[0];
  },

  async update(id, invoice) {
    const { invoice_number, customer_id, invoice_date, due_date, total_amount, paid_amount, status_id } = invoice;
    const { rows } = await pool.query(
      'UPDATE invoices SET invoice_number = $1, customer_id = $2, invoice_date = $3, due_date = $4, total_amount = $5, paid_amount = $6, status_id = $7 WHERE invoice_id = $8 RETURNING *',
      [invoice_number, customer_id, invoice_date, due_date, total_amount, paid_amount, status_id, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM invoices WHERE invoice_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default invoiceModel;
