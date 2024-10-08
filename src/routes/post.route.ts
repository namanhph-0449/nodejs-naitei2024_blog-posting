import express from 'express';
import * as postController from '../controllers/post.controller';

const router = express.Router();
//
router.get('/create', postController.renderPostForm);
router.post('/create', postController.createPost);

router.get('/search', postController.searchPost);

router.get('/', postController.getPostsForGuest);
router.get('/fyp', postController.getFYPPosts);

router.get('/tag/:id', postController.getPostsOfTag);
router.get('/detail/:id/tags', postController.getTagsOfPost);
router.get('/detail/:id', postController.getPostById);

router.get('/update/:id', postController.renderUpdateForm);
router.post('/update/:id', postController.updatePost);

router.post('/update/:id/visibility', postController.updatePostVisibility);

router.get('/delete/:id', postController.deletePost);

export default router;
