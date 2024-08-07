import { IsString, MinLength } from 'class-validator';
import { InputValidation } from '../constants/index';

export class LoginDto {
  @IsString()
  @MinLength(InputValidation.MIN_USERNAME_LENGTH,
          { message: 'error.invalidUsernameOrEmail' })
  usernameOrEmail: string;

  @IsString()
  @MinLength(InputValidation.MIN_PASSWORD_LENGTH,
          { message: 'error.invalidPassword' })
  password: string;
}
