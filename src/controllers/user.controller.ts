import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { handleValidationErrors } from '../dtos/validate';
import { UserService } from '../services/user.service';
import { UserStatus } from '../constants/user-status';
import { UserRole } from '../constants/user-roles';
import { UserInfoDto,
        UserWithBlogsDto,
        PasswordDto } from '../dtos/user.info.dto';
import { validateSessionRole,
        validateAdminRole,
        validateActiveUser,
        shortenContent } from '../utils/';
import { PostService } from '../services/post.service';

const userService = new UserService();
const postService = new PostService();

async function validateUserById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.render('error', { message: 'error.InvalidRequest' });
    return;
  }
  const user = await userService.getUserById(id);
  if (!user) {
    res.render('error', { message: 'error.userNotFound' });
    return;
  }
  return new UserWithBlogsDto(user);
}

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userDto = await validateUserById(req, res);
  const currentUserId = req.session.user?.id;
  if (!userDto) return;
  const userPosts = await postService.getPostsByUserId(id, currentUserId);
  // Admin and page owner can Edit profile.
  res.render('users/show', {
    title: 'title.userProfile',
    user: userDto,
    userActive: validateActiveUser(userDto.status),
    userAdmin: userDto?.role === UserRole.ADMIN,
    userRole: req.session.user?.role,
    userPosts,
    userStatus: UserStatus,
    isOwner: id == req.session.user?.id,
    isAdmin: validateAdminRole(req)
  });
});

export const postUpdateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id, username, email } = req.body;
  const userInfoDto = new UserInfoDto(req.body);
  const input_errors = await handleValidationErrors(userInfoDto);
  if (input_errors) {
    return res.render('error', { message: 'error.validation' });
  }
  const result = await userService.updateUser(userInfoDto);
  if (!result.success) {
    return res.render('error', {
      message: 'error.default'
    });
  }
  res.redirect('/users/'+id);
});

export const postUpdatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { id, oldPwd, newPwd, confirmNewPwd} = req.body;
  const passwordDto = new PasswordDto(req.body);
  const input_errors = await handleValidationErrors(passwordDto);
  if (input_errors) {
    return res.render('error', { message: 'error.default' });
  }
  const result = await userService.updatePassword(passwordDto);
  if (!result.success) {
    return res.render('error', { message: 'error.default' });
  }
  res.redirect('/users/'+id);
});
