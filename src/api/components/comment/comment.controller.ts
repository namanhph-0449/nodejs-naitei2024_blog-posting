import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { CommentService } from '../../../services/comment.service';
import { CreateCommentDto } from '../../../dtos/comment/create-comment-dto';


const commentService = new CommentService();

// Create Comment API
export const createCommentApi = [
  isAuthenticated,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.session.user?.id || 0;
    const postId = parseInt(req.body.postId, 10);
    const parentCommentId = req.body.parentCommentId ? parseInt(req.body.parentCommentId, 10) : null;
    const createCommentDto: CreateCommentDto = {
      ...req.body,
    };

    const newComment = await commentService.createComment(createCommentDto, currentUserId, postId, parentCommentId);
    res.status(201).json({ success: true, comment: newComment });
  })
];

// Get Comments by Post API
export const getCommentsByPostApi = [
  isAuthenticated,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId, 10);
    const currentUserId = req.session.user?.id || 0;
    const comments = await commentService.getCommentsByPost(currentUserId, postId);
    res.status(200).json({ success: true, comments });
  })
];

// Delete Comment API
export const deleteCommentApi = [
  isAuthenticated,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const commentId = parseInt(req.params.commentId, 10);
    await commentService.deleteComment(commentId);
    res.status(204).json({ success: true });
  })
];
