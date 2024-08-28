import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
import { AppDataSource } from '../config/data-source';
import { UserInfoDto, PasswordDto } from '../dtos/user.info.dto';

let connection: DataSource;
let userRepository: Repository<User>;
let userService: UserService;
let user: User | null;
let existedUser: User | null;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  userService = new UserService();
  // new user
  await userService.createUser({
    email: 'email@domain',
    username: 'username',
    password: 'good_password',
    confirm_password: 'good_password'
  });
  user = await userService.getUserByUsername('username');
  // existed user
  await userService.createUser({
    email: 'existed_email@domain',
    username: 'existed_username',
    password: 'good_password',
    confirm_password: 'good_password'
  });
  existedUser = await userService.getUserByUsername('existed_username');
});

afterAll(async () => {
  if (user) await userRepository.remove(user);
  if (existedUser) await userRepository.remove(existedUser);
  await connection.destroy();
});

describe('Update User', () => {
  it('should update email of existing user', async () => {
    const newEmail = 'new_email@domain';
    const params: UserInfoDto = {
      id: user!.userId,
      email: newEmail,
      username: user!.username,
      role: user!.role
    };
    const result = await userService.updateUser(params);
    const updatedUser = await userService.getUserByEmail(newEmail);
    expect(result.success).toBeTruthy();
    expect(result.errors).toBeUndefined();
    expect(updatedUser!.userId).toBe(user!.userId);
    expect(updatedUser!.username).toBe(user!.username);
  });

  it('should not update email because of existed email', async () => {
    const newEmail = existedUser!.email;
    const params: UserInfoDto = {
      id: user!.userId,
      email: newEmail,
      username: user!.username,
      role: user!.role
    };
    const result = await userService.updateUser(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.emailExist');
  });

  it('should not update password because of wrong old password', async () => {
    const newPassword = 'new_password';
    const params: PasswordDto = {
      id: user!.userId,
      oldPwd: 'wrong_password',
      newPwd: newPassword,
      confirmNewPwd: newPassword
    };
    const result = await userService.updatePassword(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.wrongPassword');
  });

  it('should not update password because of password mismatch', async () => {
    const newPassword = 'new_password';
    const params: PasswordDto = {
      id: user!.userId,
      oldPwd: 'good_password',
      newPwd: newPassword,
      confirmNewPwd: newPassword+'1'
    };
    const result = await userService.updatePassword(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.passwordMismatch');
  });

  it('should update password', async () => {
    const newPassword = 'new_password';
    const params: PasswordDto = {
      id: user!.userId,
      oldPwd: 'good_password',
      newPwd: newPassword,
      confirmNewPwd: newPassword
    };
    const result = await userService.updatePassword(params);
    expect(result.success).toBeTruthy();
    expect(result.errors).toBeUndefined();
  });

  it('should not deactivate without reason', async () => {
    await userService.updateUserStatus(user!.userId, UserStatus.DEACTIVE);
    expect(user!.status).toBe(UserStatus.ACTIVE);
  });

  it('should deactivate user with reason', async () => {
    const reason = "Violate rules";
    await userService.updateUserStatus(user!.userId, UserStatus.DEACTIVE, reason);
    const updatedUser = await userService.getUserById(user!.userId);
    expect(updatedUser!.status).toBe(UserStatus.DEACTIVE);
    expect(updatedUser!.deactiveReason).toBe(reason);
  });

  it('should activate user', async () => {
    await userService.updateUserStatus(user!.userId, UserStatus.ACTIVE);
    const updatedUser = await userService.getUserById(user!.userId);
    expect(updatedUser!.status).toBe(UserStatus.ACTIVE);
    expect(updatedUser!.deactiveReason).toBe('');
  });
});
