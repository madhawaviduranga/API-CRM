import reportsModel from '../models/reportsModel.js';
import AppError from '../utils/AppError.js';

const reportsController = {
	async getStatusOverview(req, res, next) {
		try {
			const data = await reportsModel.getStatusOverview();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching status overview', 500));
		}
	},

	async getOutstandingSummary(req, res, next) {
		try {
			const data = await reportsModel.getOutstandingSummary();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching outstanding summary', 500));
		}
	},

	async getRevenueByArea(req, res, next) {
		try {
			const data = await reportsModel.getRevenueByArea();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching revenue by area', 500));
		}
	},

	async getInvoiceOverdueAnalysis(req, res, next) {
		try {
			const data = await reportsModel.getInvoiceOverdueAnalysis();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching invoice overdue analysis', 500));
		}
	},

	async getPaymentMethods(req, res, next) {
		try {
			const data = await reportsModel.getPaymentMethods();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching payment methods', 500));
		}
	},

	async getSalesTrend(req, res, next) {
		try {
			const data = await reportsModel.getSalesTrend();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching sales trend', 500));
		}
	},

	async getDailySales(req, res, next) {
		try {
			const data = await reportsModel.getDailySales();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching daily sales', 500));
		}
	},

	async getMonthlySales(req, res, next) {
		try {
			const data = await reportsModel.getMonthlySales();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching monthly sales', 500));
		}
	},

	async getTopCustomers(req, res, next) {
		try {
			const data = await reportsModel.getTopCustomers();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching top customers', 500));
		}
	},

	async getCustomerCreditSummary(req, res, next) {
		try {
			const data = await reportsModel.getCustomerCreditSummary();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching customer credit summary', 500));
		}
	},

	async getReliabilityDistribution(req, res, next) {
		try {
			const data = await reportsModel.getReliabilityDistribution();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching reliability distribution', 500));
		}
	},

	async getChequeStatusOverview(req, res, next) {
		try {
			const data = await reportsModel.getChequeStatusOverview();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching cheque status overview', 500));
		}
	},

	async getBouncedCheques(req, res, next) {
		try {
			const data = await reportsModel.getBouncedCheques();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching bounced cheques', 500));
		}
	},

	async getBouncedChequeInvoices(req, res, next) {
		try {
			const data = await reportsModel.getBouncedChequeInvoices();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching bounced cheque invoices', 500));
		}
	},

	async getOnHandCheques(req, res, next) {
		try {
			const data = await reportsModel.getOnHandCheques();
			res.json(data);
		} catch (error) {
			next(new AppError('Error fetching on-hand cheques', 500));
		}
	},
};

export default reportsController;
