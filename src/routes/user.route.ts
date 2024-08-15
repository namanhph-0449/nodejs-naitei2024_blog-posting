import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

//router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/assign-admin', userController.assignAdmin);
router.post('/update/status', userController.postUpdateStatus);
router.post('/update/profile', userController.postUpdateUser);
router.post('/update/password', userController.postUpdatePassword);

export default router;
