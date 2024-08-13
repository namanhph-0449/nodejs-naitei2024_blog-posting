import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { GEN_SALT_ROUND } from '../constants';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInfoDto } from '../dtos/user.info.dto';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserById(userId: number) {
    return await this.userRepository.findOne({
      where: { userId },
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
      return { success: false, errors: "BTW, Username already exists." }
    }
    const existEmailUser = await this.getUserByEmail(email);
    if (existEmailUser) {
      return { success: false, errors: "BTW, Email already exists." }
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
}
