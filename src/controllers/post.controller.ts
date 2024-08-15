import { Request, Response } from 'express';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { PostService } from '../services/post.service';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';

const { t } = i18next;

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.session.user?.id;

    if (currentUserId === undefined) {
        res.status(400).json({ message: t('error.userNotFound') });
        return; 
    }

    const createPostDto: CreatePostDto = req.body;
    const postService = new PostService();
    const post = await postService.create(createPostDto, currentUserId);

    res.status(201).json(post);
});

export const renderPostForm = asyncHandler(async (req: Request, res: Response) => {
    res.render('post/create-post', { 
        title: t('title.createBlog'),
        content: t('content.createBlog'),
    });
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
    const postService = new PostService();
    const posts = await postService.getPosts();

    res.status(200).json(posts);
});
