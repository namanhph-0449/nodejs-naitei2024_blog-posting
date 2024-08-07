import {  IsEmail,
          IsString,
          MinLength,
          Length,
          registerDecorator,
          ValidationOptions,
          ValidationArguments
        } from 'class-validator';
import { InputValidation } from '../constants/index'

export class RegisterDto {
  @IsEmail({}, { message: 'error.invalidEmail' })
  email: string;

  @IsString()
  @Length(InputValidation.MIN_USERNAME_LENGTH,
          InputValidation.MAX_USERNAME_LENGTH,
          { message: 'error.invalidUsername' })
  username: string;

  @IsString()
  @MinLength(InputValidation.MIN_PASSWORD_LENGTH,
          { message: 'error.invalidPassword' })
  password: string;

  @IsMatch('password', { message: 'error.passwordMismatch' })
  confirm_password: string;
}

function IsMatch(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
