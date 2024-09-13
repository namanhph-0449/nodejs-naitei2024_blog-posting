import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { LoginDto } from '../../../dtos/login.dto';
import { handleValidationErrors } from '../../../dtos/validate';
import { plainToClass } from 'class-transformer';
import { UserService } from '../../../services/user.service';

config();
const userService = new UserService();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "T0P_S3CR3T" ;

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  const loginDto = new LoginDto();
  loginDto.usernameOrEmail = usernameOrEmail;
  loginDto.password = password;

  try {
    const input_errors = await handleValidationErrors(loginDto);
    if (input_errors) {
      res.status(400).json({ loginDto, success: false, errors: input_errors });
      return;
    }

    const result = await userService.verifyUser(loginDto);
    if (!result) {
      res.status(401).json({ success: false, errors: ['Invalid credentials'] });
      return;
    }
    // Create session and redirect
    req.session.user = result;
    const token = jwt.sign({ userId: result.id }, TOKEN_SECRET, {
      expiresIn: '1d', // token expires in 1 day
    });
    res.status(200).json({ success: true, user: result, token });
    return;
  } catch (error) {
    res.status(500).json({ success: false, errors: ['Internal server error'] });
  }
});
