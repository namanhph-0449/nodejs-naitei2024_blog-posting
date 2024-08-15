import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { handleValidationErrors } from '../dtos/validate';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from '../services/user.service';

const userService = new UserService();

function validateSessionRole(req: Request) {
  return req.session.user ? req.session.user.role : null;
}

export const getRegister = asyncHandler(async (req: Request, res: Response) => {
  if (!validateSessionRole(req)) {
    res.render('auth/register', { title: 'title.register' });
  }
  else res.redirect('/');
});

export const postRegister = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, confirm_password } = req.body;
  const registerDto = new RegisterDto();
  registerDto.email = email;
  registerDto.username = username;
  registerDto.password = password;
  registerDto.confirm_password = confirm_password;
  // Check for any invalidations from input
  const input_errors = await handleValidationErrors(registerDto);
  if (input_errors) {
    return res.render('auth/register', {
      title: 'title.register',
      input_errors,
      user: req.body
    });
  }
  else {
    // Attempt to creating an user
    const result = await userService.createUser(registerDto);
    if (!result.success) {
      return res.render('auth/register', {
        title: 'title.register',
        other_errors: result.errors,
        user: req.body
      });
    }
    else res.redirect('/login');
  }
});

export const getLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!validateSessionRole(req)) {
    res.render('auth/login', { title: 'title.login' });
  }
  else res.redirect('/');
});

export const postLogin = asyncHandler(async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  const loginDto = new LoginDto();
  loginDto.usernameOrEmail = usernameOrEmail;
  loginDto.password = password;
  const input_errors = await handleValidationErrors(loginDto);
  if (input_errors) {
    console.log(input_errors);
    return res.render('auth/login', {
      title: 'title.login',
      input_errors, // remind user of input validation
      user: req.body
    });
  }
  else {
    const result = await userService.verifyUser(loginDto);
    if (!result) { // invalid credentials
      return res.render('auth/login', {
        title: 'title.login',
        verify_errors: 'error.verifyUserFailed',
        user: req.body
      });
    }
    else { // Create session and redirect
      req.session.user = result;
      res.redirect('/posts/fyp/1');
    }
  }
});
