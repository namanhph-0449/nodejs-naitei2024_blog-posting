import express from 'express';
import * as apiUserController from '../components/auth/auth.controller';

const router = express.Router();
// /api/login
router.post('/', apiUserController.login);

export default router;
