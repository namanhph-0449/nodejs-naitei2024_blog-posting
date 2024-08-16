import { Request, Response } from 'express';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { PostService } from '../services/post.service';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';

const { t } = i18next;
const postService = new PostService();

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.session.user?.id;

    if (currentUserId === undefined) {
        res.status(400).json({ message: t('error.userNotFound') });
        return; 
    }

    const createPostDto: CreatePostDto = req.body;
    const post = await postService.create(createPostDto, currentUserId);

    res.status(201).json(post);
});

export const renderPostForm = asyncHandler(async (req: Request, res: Response) => {
    res.render('post/create-post', { 
        title: t('title.createBlog'),
        content: t('content.createBlog'),
    });
});

export const getPostsForGuest = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.params.page as string, 10) || 1; 
    const posts = await postService.getPostsForGuest(page);

    // res.status(200).json(posts);
    res.render('post/fyp', { posts, currentPage: page });
});

export const getFYPPosts = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.session.user?.id;
    const userRole = req.session.user ? req.session.user.role : null;

    if (currentUserId === undefined) {
        res.status(400).json({ message: t('error.userNotFound') });
        return; 
    }

    const page = parseInt(req.params.page as string, 10) || 1; 
    
    try {
        const posts = await postService.getFYPPosts(currentUserId, page);
        res.render('post/fyp', { posts, currentPage: page, userRole });
        // res.status(200).json(posts);
    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = req.session.user?.id;
    const post = await postService.getPostById(currentUserId, postId);

    if (!post) {
        res.status(404).json({ message: t('error.postNotFound') });
        return;
    }

    const isOwner = post.user.userId === currentUserId;

    // res.status(200).json(post);
    res.render('post/post-detail', { post, isOwner });
});

