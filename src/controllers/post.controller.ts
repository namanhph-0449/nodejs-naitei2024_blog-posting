import { Request, Response } from 'express';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { ActionService } from '../services/action.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { PostVisibility } from '../constants/post-visibility';
import { Post } from '../entities/post.entity';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { reformatTimestamp,
        mapTagsToTagEntities,
        mapTagEntitiesToTags } from '../utils';

const { t } = i18next;
const actionService = new ActionService();
const postService = new PostService();
const commentService = new CommentService();

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
    if (req.body.tags) {
      // convert tags from string[] to Tag[]
      const tagList = req.body.tags.split(",");
      createPostDto.tags = mapTagsToTagEntities(tagList);
    }
    await postService.create(createPostDto, currentUserId);
    res.redirect(`/posts/fyp`);
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
    res.redirect(`/posts/fyp`);
  }
  const page = parseInt(req.query.page as string, 10) || 1;
  const posts = await postService.getPostsForGuest(page);

  res.render('post/guest-fyp', {
    posts,
    currentPage: page,
    title: t('title.header')
  });
});

export const getFYPPosts = [
  isAuthenticated,
  asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.session.user!.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    try {
      const posts = await postService.getFYPPosts(currentUserId, page);
      res.render('post/fyp', {
        userRole: true,
        posts,
        currentPage: page,
        flashMessage: req.flash('flashMessage'),
        title: t('title.header'),
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
  // reformat datetime of post and its comments
  const postedTime = reformatTimestamp(post.createdAt);
  const edittedTime = reformatTimestamp(post.updatedAt);
  const comments = post.comments.map((comment) => {
    return {
      ...comment,
      createdAt: reformatTimestamp(comment.createdAt),
    };
  });
  res.render('post/post-detail', {
    title: post.title,
    post,
    isOwner,
    comments,
    postedTime,
    edittedTime
  });
});

export const searchPost = asyncHandler(async (req: Request, res: Response) => {
  const pattern = req.query.q?.toString();
  if (!pattern) { // render search page
    res.render('post/search-results', {
      title: 'title.searchPage',
    });
  }
  else {
    const currentUserId = req.session.user?.id;
    const posts = await postService.getPostsByPattern(pattern, currentUserId);
    res.render('post/search-results', { // render result
      title: 'title.searchResult',
      query: pattern,
      posts
    });
  } 
});

export const getPostsOfTag = asyncHandler(async (req: Request, res: Response) => {
  const tagId = parseInt(req.params.id, 10);
  const posts = await postService.getPostsByTag(tagId);
  const tagName = posts.length > 0 
    ? posts[0].tags.find((tag) => tag.id === tagId)?.name 
    : '';
  res.render('post/search-results', {
    title: 'title.searchResult',
    query: tagName, 
    posts
  });;
});

export const getTagsOfPost = asyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10);
  const currentUserId = req.session.user?.id;
  const post = await postService.getPostById(currentUserId, postId);
  validatePost(post);
  const postTags = mapTagEntitiesToTags(post.tags);
  res.json(postTags);
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
    if (req.body.tags) {
      // convert tags from string[] to Tag[]
      const tagList = req.body.tags.split(",");
      updatePostDto.tags = mapTagsToTagEntities(tagList);
    }
    try {
      await postService.updatePost(postId, updatePostDto, currentUserId);
      res.redirect(`/posts/detail/${postId}`);
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
      res.redirect('/posts/fyp');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: t('error.deleteFailed') });
    }
  })
];

export const updatePostVisibility = [
  isAuthenticated,
  asyncHandler(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = req.session.user?.id || 0;
    const newVisibility = req.body.visible;

    try {
      await postService.updatePostVisibility(postId, newVisibility, currentUserId);
      res.redirect(`/me`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: t('error.updateFailed') });
    }
  })
];
