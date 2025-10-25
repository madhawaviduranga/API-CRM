import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Explicitly load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const result = dotenv.config({ path: path.resolve(__dirname, './.env') });

// --- Start Debugging ---
console.log('Dotenv config result:', result);
if (result.error) {
  console.error('Error loading .env file', result.error);
}
console.log('JWT_EXPIRES_IN from process.env:', process.env.JWT_EXPIRES_IN);
// --- End Debugging ---

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import pool from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import scheduleJobs from './utils/scheduler.js';

// Route Imports
import areaRoutes from './routes/areaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chequePaymentRoutes from './routes/chequePaymentRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import distributorRoutes from './routes/distributorRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import rolePermissionRoutes from './routes/rolePermissionRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// --- Global Middlewares ---

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Data sanitization against XSS
app.use(xss());

// Gzip compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Hello, this is the root of the API!');
});

// API Routes
app.use('/areas', areaRoutes);
app.use('/auth', authRoutes);
app.use('/cheque-payments', chequePaymentRoutes);
app.use('/customers', customerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/distributors', distributorRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/permissions', permissionRoutes);
app.use('/products', productRoutes);
app.use('/reports', reportsRoutes);
app.use('/returns', returnRoutes);
app.use('/role-permissions', rolePermissionRoutes);
app.use('/roles', roleRoutes);
app.use('/sales', saleRoutes);
app.use('/users', userRoutes);


// Centralized Error Handler
app.use(errorHandler);

// --- Server Initialization ---

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Test database connection
        const client = await pool.connect();
        console.log('Successfully connected to the database.');
        client.release();

        // Start scheduler
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
