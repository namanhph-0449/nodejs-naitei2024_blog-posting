import express from 'express';
//import { authenticate } from '../middleware/auth';
import * as apiPostController from '../components/post/post.controller';

const router = express.Router();
// /api/posts
router.get('/search', apiPostController.searchPosts); // search posts
router.get('/:postId', apiPostController.readPost); // read post
router.get('/', apiPostController.getPosts); // get posts
router.post('/', apiPostController.createPost); // create post
router.put('/:postId', apiPostController.updatePost); // update post
router.delete('/:postId', apiPostController.deletePost); // delete post

export default router;
