import express from 'express';
import rolePermissionController from '../controllers/rolePermissionController.js';

const router = express.Router();

router.get('/', rolePermissionController.getAllRolePermissions);
router.get('/:id', rolePermissionController.getRolePermissionById);
router.post('/', rolePermissionController.createRolePermission);
router.put('/:id', rolePermissionController.updateRolePermission);
router.delete('/:id', rolePermissionController.deleteRolePermission);

export default router;
