import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AppDataSource } from '../config/data-source';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInfoDto } from '../dtos/user.info.dto';

let connection: DataSource;
let userRepository: Repository<User>;
let userService: UserService;
let existedUser: User | null;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  userService = new UserService();
  // Create sample user, delete later
  existedUser = await userService.getUserByUsername('existed_username');
  if (!existedUser) {
    await userService.createUser({
      email: 'existed_email@domain',
      username: 'existed_username',
      password: 'good_password',
      confirm_password: 'good_password'
    });
    existedUser = await userService.getUserByUsername('existed_username');
  }
  // Make sure this user does not exists
  await userRepository.delete({ username: 'not_existed_username' });
});

afterEach(async () => {
  await userRepository.delete({ username: 'valid_username' });
});

afterAll(async () => {
  if (existedUser) await userRepository.remove(existedUser);
  await connection.destroy();
});

describe('Register', () => {
  it('should return success if register successfully', async () => {
    const params: RegisterDto = {
      email: 'valid_email@domain',
      username: 'valid_username',
      password: 'valid_password',
      confirm_password: 'valid_password'
    };
    const result = await userService.createUser(params);
    expect(result.success).toBeTruthy();
    expect(result.errors).toBeUndefined();
  });

  it('should return error when username exists', async () => {
    const params = {
      email: 'valid_email@domain',
      username: 'existed_username',
      password: 'valid_password',
      confirm_password: 'valid_password'
    };
    const result = await userService.createUser(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.usernameExist');
  });

  it('should return error when email exists', async () => {
    const params = {
      email: 'existed_email@domain',
      username: 'valid_username',
      password: 'valid_password',
      confirm_password: 'valid_password'
    };
    const result = await userService.createUser(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.emailExist');
  });

  it('should return error when password mismatch', async () => {
    const params = {
      email: 'existed_email@domain',
      username: 'valid_username',
      password: 'valid_password',
      confirm_password: 'mismatch_password'
    };
    const result = await userService.createUser(params);
    expect(result.success).toBeFalsy();
    expect(result.errors).toBe('error.passwordMismatch');
  });
});

describe('Login', () => {
  it('should return UserInfoDto when logged in successfully ', async () => {
    const params = {
      usernameOrEmail: 'existed_username',
      password: 'good_password',
    };
    const user = await userService.verifyUser(params);
    expect(user).toBeDefined();
    expect(user?.username).toBe(params.usernameOrEmail);
  });

  it('should return null if user does not exists', async () => {
    const params = {
      usernameOrEmail: 'not_exists_username',
      password: 'good_password',
    };
    const user = await userService.verifyUser(params);
    expect(user).toBeNull();
  });

  it('should return null if password is incorrect', async () => {
    const params = {
      usernameOrEmail: 'existed_username',
      password: 'wrong_pwd'
    };
    const user = await userService.verifyUser(params);
    expect(user).toBeNull();
  });
});
