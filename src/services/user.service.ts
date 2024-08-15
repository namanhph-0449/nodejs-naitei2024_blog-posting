import bcrypt from 'bcryptjs';
import { Not } from "typeorm";
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { GEN_SALT_ROUND } from '../constants';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInfoDto, PasswordDto } from '../dtos/user.info.dto';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserById(userId: number) {
    return await this.userRepository.findOne({
      where: { userId },
      relations: ['posts'],
    });
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserByUsernameOrEmail(identifier: string) {
    const userByUsername = await this.getUserByUsername(identifier);
    if (userByUsername) {
      return userByUsername;
    }
    const userByEmail = await this.getUserByEmail(identifier);
    return userByEmail;
  }

  async verifyUser(userDto: LoginDto): Promise<UserInfoDto | null> {
    const { usernameOrEmail, password } = userDto;
    const user = await this.getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return null;
    }
    // User is valid, return a UserInfoDto object
    return new UserInfoDto({
      id: user.userId,
      email: user.email,
      username: user.username,
      role: user.role
    });
  }

  async createUser(userDto: RegisterDto): Promise<{ success: boolean; errors?: string }> {
    const { email, username, password } = userDto;
    const existUsernameUser = await this.getUserByUsername(username);
    if (existUsernameUser) {
      return { success: false, errors: 'error.usernameExist' }
    }
    const existEmailUser = await this.getUserByEmail(email);
    if (existEmailUser) {
      return { success: false, errors: 'error.emailExist' }
    }
    const salt: string = await bcrypt.genSalt(GEN_SALT_ROUND);
    const passwordHash: string = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      email,
      salt,
      passwordHash
    })
    await this.userRepository.save(user)
    return { success: true }
  }

  async updateUser(userDto: UserInfoDto): Promise<{ success: boolean; errors?: string }> {
    const { id, email, username, role } = userDto;
    const user = await this.getUserById(id);
    if (!user) {
      return { success: false, errors: 'error.userNotFound' };
    }
    // Check for existing username/email excluding current user
    const existingUsernameUser = await this.userRepository.findOne({
      where: { username, userId: Not(id) } // Exclude current user
    });
    if (existingUsernameUser) {
      return { success: false, errors: 'error.usernameExist' };
    }
    const existingEmailUser = await this.userRepository.findOne({
      where: { email, userId: Not(id) } // Exclude current user
    });
    if (existingEmailUser) {
      return { success: false, errors: 'error.emailExist' };
    }
    // Update user properties
    user.email = email;
    user.username = username;
    if (role) user.role = role;
    try {
      await this.userRepository.save(user);
      return { success: true };
    } catch (error) {
      return { success: false, errors: 'error.default' };
    }
  }

  async updatePassword(passwordDto: PasswordDto): Promise<{ success: boolean; errors?: string }> {
    const { id, oldPwd, newPwd, confirmNewPwd } = passwordDto;
    const user = await this.getUserById(id);
    if (!user) {
      return { success: false, errors: 'error.userNotFound' };
    }
    const passwordMatch = await bcrypt.compare(oldPwd, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, errors: 'error.wrongPassword' };
    }
    const salt: string = await bcrypt.genSalt(GEN_SALT_ROUND);
    const passwordHash: string = await bcrypt.hash(newPwd, salt);
    user.passwordHash = passwordHash;
    user.salt = salt;
    try {
      await this.userRepository.save(user);
      return { success: true };
    } catch (error) {
      return { success: false, errors: 'error.default' };
    }
  }

  async assignAdminByUserId(id: number) {
    const user = await this.getUserById(id);
    if(!user) return;
    user.role = UserRole.ADMIN;
    return await this.userRepository.save(user);
  }

  async updateUserStatus(id: number, status: UserStatus, reason?: string) {
    const user = await this.getUserById(id);
    if(!user) return;
    user.status = status;
    if (status===UserStatus.DEACTIVE && reason) user.deactiveReason = reason;
    return await this.userRepository.save(user);
  }
}
