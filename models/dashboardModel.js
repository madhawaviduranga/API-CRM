import pool from '../config/db.js';

const dashboardModel = {
  async getDailySummary(date) {
    const { rows } = await pool.query(
      `SELECT
        (SELECT SUM(total_amount) FROM invoices WHERE invoice_date = $1) AS total_sales,
        (SELECT COUNT(*) FROM invoices WHERE invoice_date = $1) AS sales_count,
        (SELECT SUM(amount) FROM cash_payments WHERE payment_date = $1) AS total_payments,
        (SELECT COUNT(*) FROM cash_payments WHERE payment_date = $1) AS payment_count,
        (SELECT SUM(cheque_amount) FROM cheque_payments WHERE received_date = $1) AS total_cheques,
        (SELECT COUNT(*) FROM cheque_payments WHERE received_date = $1) AS cheque_count,
        (SELECT SUM(total_value) FROM returns WHERE return_date = $1) AS total_returns,
        (SELECT COUNT(*) FROM returns WHERE return_date = $1) AS return_count`,
      [date]
    );
    return rows[0];
  },

  async getMonthlySummary(year, month) {
    const { rows } = await pool.query(
      `SELECT
        (SELECT SUM(total_amount) FROM invoices WHERE EXTRACT(YEAR FROM invoice_date) = $1 AND EXTRACT(MONTH FROM invoice_date) = $2) AS total_sales,
        (SELECT COUNT(*) FROM invoices WHERE EXTRACT(YEAR FROM invoice_date) = $1 AND EXTRACT(MONTH FROM invoice_date) = $2) AS sales_count,
        (SELECT SUM(amount) FROM cash_payments WHERE EXTRACT(YEAR FROM payment_date) = $1 AND EXTRACT(MONTH FROM payment_date) = $2) AS total_payments,
        (SELECT COUNT(*) FROM cash_payments WHERE EXTRACT(YEAR FROM payment_date) = $1 AND EXTRACT(MONTH FROM payment_date) = $2) AS payment_count,
        (SELECT SUM(cheque_amount) FROM cheque_payments WHERE EXTRACT(YEAR FROM received_date) = $1 AND EXTRACT(MONTH FROM received_date) = $2) AS total_cheques,
        (SELECT COUNT(*) FROM cheque_payments WHERE EXTRACT(YEAR FROM received_date) = $1 AND EXTRACT(MONTH FROM received_date) = $2) AS cheque_count,
        (SELECT SUM(total_value) FROM returns WHERE EXTRACT(YEAR FROM return_date) = $1 AND EXTRACT(MONTH FROM return_date) = $2) AS total_returns,
        (SELECT COUNT(*) FROM returns WHERE EXTRACT(YEAR FROM return_date) = $1 AND EXTRACT(MONTH FROM return_date) = $2) AS return_count`,
      [year, month]
    );
    return rows[0];
  },

  async getAnnualSummary(year) {
    const { rows } = await pool.query(
      `SELECT
        (SELECT SUM(total_amount) FROM invoices WHERE EXTRACT(YEAR FROM invoice_date) = $1) AS total_sales,
        (SELECT COUNT(*) FROM invoices WHERE EXTRACT(YEAR FROM invoice_date) = $1) AS sales_count,
        (SELECT SUM(amount) FROM cash_payments WHERE EXTRACT(YEAR FROM payment_date) = $1) AS total_payments,
        (SELECT COUNT(*) FROM cash_payments WHERE EXTRACT(YEAR FROM payment_date) = $1) AS payment_count,
        (SELECT SUM(cheque_amount) FROM cheque_payments WHERE EXTRACT(YEAR FROM received_date) = $1) AS total_cheques,
        (SELECT COUNT(*) FROM cheque_payments WHERE EXTRACT(YEAR FROM received_date) = $1) AS cheque_count,
        (SELECT SUM(total_value) FROM returns WHERE EXTRACT(YEAR FROM return_date) = $1) AS total_returns,
        (SELECT COUNT(*) FROM returns WHERE EXTRACT(YEAR FROM return_date) = $1) AS return_count`,
      [year]
    );
    return rows[0];
  },
};

export default dashboardModel;
