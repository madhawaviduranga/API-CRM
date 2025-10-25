import cron from 'node-cron';
import pool from '../config/db.js';

const updateInvoiceStatus = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update invoices based on cleared cheques
    const clearedCheques = await client.query(
      `SELECT ci.invoice_id, cp.amount
       FROM cheque_invoice_links ci
       JOIN cheque_payments cp ON ci.cheque_id = cp.cheque_id
       WHERE cp.status_id = (SELECT status_id FROM cheque_statuses WHERE status_name = 'Cleared')`
    );

    for (const { invoice_id, amount } of clearedCheques.rows) {
      await client.query(
        'UPDATE invoices SET paid_amount = paid_amount + $1 WHERE invoice_id = $2',
        [amount, invoice_id]
      );
    }

    // Update invoice statuses to 'Paid' if fully paid
    await client.query(
      `UPDATE invoices
       SET status_id = (SELECT status_id FROM invoice_statuses WHERE status_name = 'Paid')
       WHERE total_amount <= paid_amount
       AND status_id != (SELECT status_id FROM invoice_statuses WHERE status_name = 'Paid')`
    );

    // Update overdue invoices
    await client.query(
      `UPDATE invoices
       SET status_id = (SELECT status_id FROM invoice_statuses WHERE status_name = 'Overdue')
       WHERE due_date < CURRENT_DATE
       AND status_id NOT IN (
         SELECT status_id FROM invoice_statuses WHERE status_name IN ('Paid', 'Cancelled')
       )`
    );

    await client.query('COMMIT');
    console.log('Successfully updated invoice statuses.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating invoice statuses:', error);
  } finally {
    client.release();
  }
};

const scheduleJobs = () => {
  // Schedule to run once a day at midnight
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled job to update invoice statuses...');
    updateInvoiceStatus();
  });
};

export default scheduleJobs;
