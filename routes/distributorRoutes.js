import express from 'express';
import distributorController from '../controllers/distributorController.js';

const router = express.Router();

router.get('/', distributorController.getAllDistributors);
router.get('/:id', distributorController.getDistributorById);
router.post('/', distributorController.createDistributor);
router.put('/:id', distributorController.updateDistributor);
router.delete('/:id', distributorController.deleteDistributor);

export default router;
