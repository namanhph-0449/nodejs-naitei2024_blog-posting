import { MinLength, Length, IsEmail, IsString } from 'class-validator';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { InputValidation } from '../constants';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
import { IsMatch } from './register.dto';
import { sanitizeContent } from '../utils/';

export class UserInfoDto {
  id: number;

  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @IsString()
  @Length(InputValidation.MIN_USERNAME_LENGTH,
          InputValidation.MAX_USERNAME_LENGTH,
          { message: 'error.invalidUsername' })
  username: string;

  role: UserRole;

  constructor(data: {
    id: number;
    email: string;
    username: string;
    role: UserRole;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.role = data.role;
  }
}

export class UserWithBlogsDto {
  id: number
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  posts: Post[];
  status: UserStatus;
  deactiveReason?: string;

  constructor(user: User) {
    this.id = user.userId;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    //sanitize post content
    this.posts = user.posts.map(post => ({
      ...post,
      content: sanitizeContent(post.content)
    }));
    this.status = user.status;
    if (user.deactiveReason) this.deactiveReason = user.deactiveReason;
  }
}

export class PasswordDto {
  id: number
  oldPwd: string;
  @IsString()
  @MinLength(InputValidation.MIN_PASSWORD_LENGTH,
          { message: 'error.invalidPassword' })
  newPwd: string;
  @IsMatch('newPwd', { message: 'error.passwordMismatch' })
  confirmNewPwd: string;

  constructor(data: {
    id: number;
    oldPwd: string;
    newPwd: string;
    confirmNewPwd: UserRole
  }) {
    this.id = data.id;
    this.oldPwd = data.oldPwd;
    this.newPwd = data.newPwd;
    this.confirmNewPwd = data.confirmNewPwd;
  }
}
