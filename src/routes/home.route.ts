import express from 'express';
import * as homeController from '../controllers/home.controller';
import * as actionController from '../controllers/action.controller';

const router = express.Router();

router.get('/', homeController.index);
router.get('/me', homeController.getMyProfile);
router.get('/logout', homeController.logout);
router.post('/increase-view', actionController.postView);
router.post('/like/:id', actionController.postLike);
router.post('/bookmark/:id', actionController.postBookmark);

export default router;
