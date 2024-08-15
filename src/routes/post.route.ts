import express from 'express';
import * as postController from '../controllers/post.controller';

const router = express.Router();

router.get('/create', postController.renderPostForm);
router.post('/create', postController.createPost);

router.get('/:page', postController.getPostsForGuest);
router.get('/fyp/:page', postController.getFYPPosts);

export default router;
