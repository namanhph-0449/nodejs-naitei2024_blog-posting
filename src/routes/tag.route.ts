import express from 'express';
import * as tagController from '../controllers/tag.controller';

const router = express.Router();

router.get('/', tagController.getTags);

export default router;
