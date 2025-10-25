import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import pool from './config/db.js';
import apiRoutes from './routes/api.js';
import errorHandler from './middleware/errorHandler.js';
import scheduleJobs from './utils/scheduler.js';

const app = express();

// --- Global Middlewares ---

// Set security HTTP headers
app.use(helmet());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiting middleware to all routes starting with /api
app.use('/api', limiter);

// Data sanitization against Cross-Site Scripting (XSS)
app.use(xss());

// Gzip compression for response bodies
app.use(compression());

// Body parser, reading data from body into req.body, with a limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Routes ---

app.get('/', (req, res) => {
	res.send('Hello, this is the root of the API!');
});

// API Routes
app.use('/api', apiRoutes);

// Centralized Error Handler
app.use(errorHandler);

// --- Server Initialization ---

const port = process.env.PORT || 8080;

const startServer = async () => {
	try {
		// Test the database connection
		const client = await pool.connect();
		console.log('Successfully connected to the database.');
		client.release();

		// Start the scheduler
		scheduleJobs();

		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error('Failed to connect to the database.', error);
		process.exit(1);
	}
};

startServer();

// --- Graceful Shutdown ---

process.on('SIGINT', async () => {
	console.log('\nShutting down gracefully...');
	await pool.end();
	console.log('Database pool has been closed.');
	process.exit(0);
});
