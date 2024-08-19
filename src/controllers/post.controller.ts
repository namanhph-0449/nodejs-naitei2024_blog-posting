import { Request, Response } from 'express';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { PostService } from '../services/post.service';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { PostVisibility } from '../constants/post-visibility';
import { Post } from '../entities/post.entity';
import { isAuthenticated } from '../middlewares/auth.middleware';

const { t } = i18next;
const postService = new PostService();

const validatePost = (post: Post) => {
    if (!post) {
        throw new Error(t('error.postNotFound'));
    }
}

export const createPost = [
    isAuthenticated,
    asyncHandler(async (req: Request, res: Response) => {
        const currentUserId = req.session.user?.id || 0;

        const createPostDto: CreatePostDto = req.body;
        await postService.create(createPostDto, currentUserId);

        res.redirect(`/posts/fyp/1`);
    })
];

export const renderPostForm = asyncHandler(async (req: Request, res: Response) => {
    res.render('post/create-post', { 
        title: t('title.createBlog'),
        content: t('content.createBlog'),
    });
});

export const getPostsForGuest = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.session.user?.id;
    if (currentUserId) {
        res.redirect(`/posts/fyp/1`);
    }
    const page = parseInt(req.params.page as string, 10) || 1; 
    const posts = await postService.getPostsForGuest(page);

    res.render('post/guest-fyp', { 
        posts, 
        currentPage: page,
        previous: t('menu.previous'),
        next: t('menu.next'),
        title: t('title.header')
    });
});

export const getFYPPosts = [
    isAuthenticated,
    asyncHandler(async (req: Request, res: Response) => {
        const currentUserId = req.session.user!.id;
        const page = parseInt(req.params.page as string, 10) || 1; 
        
        try {
            const posts = await postService.getFYPPosts(currentUserId, page);
            res.render('post/fyp', { 
                posts, 
                currentPage: page,
                previous: t('menu.previous'),
                next: t('menu.next'),
                title: t('title.header'),
                createPost: t('menu.createBlog'),
            });
        } 
        catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    })
];

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = req.session.user?.id;
    const post = await postService.getPostById(currentUserId, postId);

    validatePost(post);

    const isOwner = post.user.userId === currentUserId;

    res.render('post/post-detail', { post, isOwner });
});

export const renderUpdateForm = asyncHandler(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = req.session.user?.id;
    const post = await postService.getPostById(currentUserId, postId);

    validatePost(post);

    res.render('post/update-post', {
        post,
        postVisibility: PostVisibility,
        title: t('title.editBlog'),
        content: t('content.editBlog'),
    });
});

// Handle the update request
export const updatePost = [
    isAuthenticated,
    asyncHandler(async (req: Request, res: Response) => {
        const postId = parseInt(req.params.id, 10);
        const currentUserId = req.session.user?.id || 0;

        const updatePostDto: CreatePostDto = req.body;

        try {
            await postService.updatePost(postId, updatePostDto, currentUserId);
            res.redirect(`/posts/${postId}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: t('error.updateFailed') });
        }
    })
]

// Handle the delete request
export const deletePost = [
    isAuthenticated,
    asyncHandler(async (req: Request, res: Response) => {
        const postId = parseInt(req.params.id, 10);
        const currentUserId = req.session.user?.id || 0;

        try {
            await postService.deletePost(postId, currentUserId);
            res.redirect('/posts/fyp/1');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: t('error.deleteFailed') });
        }
    })
];
