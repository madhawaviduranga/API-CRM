import pool from '../config/db.js';

const reportsModel = {
	async getStatusOverview() {
		const { rows } = await pool.query(
			`SELECT s.status_name, COUNT(i.invoice_id) AS count
       FROM invoice_statuses s
       LEFT JOIN invoices i ON s.status_id = i.status_id
       GROUP BY s.status_name`
		);
		return rows;
	},

	async getOutstandingSummary() {
		const { rows } = await pool.query(
			`SELECT c.customer_name, i.invoice_number, i.total_amount - i.paid_amount AS outstanding_amount
       FROM invoices i
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE i.status_id IN (SELECT status_id FROM invoice_statuses WHERE status_name IN ('Pending', 'Overdue'))`
		);
		return rows;
	},

	async getRevenueByArea() {
		const { rows } = await pool.query(
			`SELECT a.area_name, SUM(i.total_amount) AS total_revenue
       FROM invoices i
       JOIN customers c ON i.customer_id = c.customer_id
       JOIN routes r ON c.route_id = r.route_id
       JOIN areas a ON r.area_id = a.area_id
       WHERE i.status_id = (SELECT status_id FROM invoice_statuses WHERE status_name = 'Paid')
       GROUP BY a.area_name`
		);
		return rows;
	},

	async getInvoiceOverdueAnalysis() {
		const { rows } = await pool.query(
			`SELECT c.customer_name, i.invoice_number, i.due_date, CURRENT_DATE - i.due_date AS days_overdue
       FROM invoices i
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE i.status_id = (SELECT status_id FROM invoice_statuses WHERE status_name = 'Overdue')`
		);
		return rows;
	},

	async getPaymentMethods() {
		const { rows } = await pool.query(
			`SELECT 'Cash' as method, COUNT(*) as count FROM cash_payments
       UNION ALL
       SELECT 'Cheque' as method, COUNT(*) as count FROM cheque_payments`
		);
		return rows;
	},

	async getSalesTrend() {
		const { rows } = await pool.query(
			`SELECT TO_CHAR(invoice_date, 'YYYY-MM') AS month, SUM(total_amount) AS total_sales
       FROM invoices
       WHERE invoice_date >= NOW() - INTERVAL '12 months'
       GROUP BY month
       ORDER BY month`
		);
		return rows;
	},

	async getDailySales() {
		const { rows } = await pool.query(
			`SELECT invoice_date, SUM(total_amount) AS total_sales
       FROM invoices
       WHERE invoice_date = CURRENT_DATE
       GROUP BY invoice_date`
		);
		return rows[0];
	},

	async getMonthlySales() {
		const { rows } = await pool.query(
			`SELECT TO_CHAR(invoice_date, 'YYYY-MM') AS month, SUM(total_amount) AS total_sales
       FROM invoices
       WHERE TO_CHAR(invoice_date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
       GROUP BY month`
		);
		return rows[0];
	},

	async getTopCustomers() {
		const { rows } = await pool.query(
			`SELECT c.customer_name, SUM(i.total_amount) AS total_spent
       FROM invoices i
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE i.status_id = (SELECT status_id FROM invoice_statuses WHERE status_name = 'Paid')
       GROUP BY c.customer_name
       ORDER BY total_spent DESC
       LIMIT 10`
		);
		return rows;
	},

	async getCustomerCreditSummary() {
		const { rows } = await pool.query(
			`SELECT c.customer_name, SUM(i.total_amount - i.paid_amount) AS total_outstanding
       FROM invoices i
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE i.status_id IN (SELECT status_id FROM invoice_statuses WHERE status_name IN ('Pending', 'Overdue'))
       GROUP BY c.customer_name`
		);
		return rows;
	},

	async getReliabilityDistribution() {
		const { rows } = await pool.query(
			`SELECT reliability_score, COUNT(*) AS customer_count
       FROM customers
       GROUP BY reliability_score`
		);
		return rows;
	},

	async getChequeStatusOverview() {
		const { rows } = await pool.query(
			`SELECT cs.status_name, COUNT(cp.cheque_id) AS count
       FROM cheque_statuses cs
       LEFT JOIN cheque_payments cp ON cs.status_id = cp.status_id
       GROUP BY cs.status_name`
		);
		return rows;
	},

	async getBouncedCheques() {
		const { rows } = await pool.query(
			`SELECT cp.*, c.customer_name
       FROM cheque_payments cp
       JOIN cheque_invoice_links cil ON cp.cheque_id = cil.cheque_id
       JOIN invoices i ON cil.invoice_id = i.invoice_id
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE cp.status_id = (SELECT status_id FROM cheque_statuses WHERE status_name = 'Bounced')`
		);
		return rows;
	},

	async getBouncedChequeInvoices() {
		const { rows } = await pool.query(
			`SELECT i.*, c.customer_name
       FROM invoices i
       JOIN cheque_invoice_links cil ON i.invoice_id = cil.invoice_id
       JOIN cheque_payments cp ON cil.cheque_id = cp.cheque_id
       JOIN customers c ON i.customer_id = c.customer_id
       WHERE cp.status_id = (SELECT status_id FROM cheque_statuses WHERE status_name = 'Bounced')`
		);
		return rows;
	},

	async getOnHandCheques() {
		const { rows } = await pool.query(
			`SELECT * FROM cheque_payments
       WHERE status_id = (SELECT status_id FROM cheque_statuses WHERE status_name = 'On Hand')`
		);
		return rows;
	},
};

export default reportsModel;
