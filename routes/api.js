import express from 'express';
import areaRoutes from './areaRoutes.js';
import distributorRoutes from './distributorRoutes.js';
import productRoutes from './productRoutes.js';
import saleRoutes from './saleRoutes.js';
import customerRoutes from './customerRoutes.js';
import returnRoutes from './returnRoutes.js';

const router = express.Router();

router.use('/areas', areaRoutes);
router.use('/distributors', distributorRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/customers', customerRoutes);
router.use('/returns', returnRoutes);

export default router;
