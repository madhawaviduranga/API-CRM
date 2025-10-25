import express from 'express';
import returnController from '../controllers/returnController.js';

const router = express.Router();

router.get('/', returnController.getAllReturns);
router.get('/:id', returnController.getReturnById);
router.post('/', returnController.createReturn);
router.put('/:id', returnController.updateReturn);
router.delete('/:id', returnController.deleteReturn);

export default router;
