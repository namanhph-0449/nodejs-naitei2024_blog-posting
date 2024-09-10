import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validateSessionRole,
        sanitizeContent,
        validateActiveUser } from '../utils/';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { PostVisibility } from '../constants/post-visibility';
import { UserWithBlogsDto } from '../dtos/user.info.dto';
import { TOP_POSTS_LIMIT } from '../constants/post-constant';

const userService = new UserService();
const postService = new PostService();

export const index = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.session.user?.id;
  const posts = await postService.getTopPosts(TOP_POSTS_LIMIT, currentUserId);
  res.render('index', {
    title: 'title.default',
    userRole: validateSessionRole(req),
    posts
  });
});

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!validateSessionRole(req) || !req.session?.user?.id) {
    res.redirect('/login');
    return;
  }
  // Get user and convert to DTO
  const id = req.session.user.id;
  const user = await userService.getUserById(id);
  const userDto = user ? new UserWithBlogsDto(user) : null;
  const userPosts = userDto?.posts.map(post => ({
    ...post,
    content: sanitizeContent(post.content)
  }));
  res.render('users/show', {
    title: 'title.myProfile',
    user: userDto,
    postVisibility: PostVisibility,
    userActive: validateActiveUser(userDto?.status),
    userRole: userDto?.role,
    userPosts,
    isOwner: true // users can create blog and cannot follow themselves
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/');
  });
});
