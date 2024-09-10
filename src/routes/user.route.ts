import express from 'express';
import * as userController from '../controllers/user.controller';
import * as adminUserController from '../controllers/admin/user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/assign-admin', adminUserController.assignAdmin);
router.post('/update/status', adminUserController.postUpdateStatus);
router.post('/update/profile', userController.postUpdateUser);
router.post('/update/password', userController.postUpdatePassword);

export default router;
