import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserService } from '../../services/user.service';
import { validateAdminRole } from '../../utils/';

const userService = new UserService();

export const assignAdmin = asyncHandler(async (req: Request, res: Response) => {
  const validRequest = validateAdminRole(req);
  if (validRequest) {
    const id = parseInt(req.params.id);
    await userService.assignAdminByUserId(id);
    res.redirect('/users/'+id);
  }
});

export const postUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
  const validRequest = validateAdminRole(req);
  if (validRequest) {
    const { id, status, reason } = req.body;
    await userService.updateUserStatus(id, status, reason);
    res.redirect('/users/'+id);
  }
});
