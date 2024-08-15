import express from 'express';
import * as homeController from '../controllers/home.controller';

const router = express.Router();

router.get('/', homeController.index);
router.get('/me', homeController.getMyProfile);
router.get('/logout', homeController.logout)

export default router;
