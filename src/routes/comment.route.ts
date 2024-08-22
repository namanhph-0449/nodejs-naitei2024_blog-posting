import * as commentController from '../controllers/comment.controller';
import { Router } from 'express';

const router = Router();

router.post('/create', commentController.createComment);
router.get('/posts/:postId/comments', commentController.getCommentsByPost);
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
