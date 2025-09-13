import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EUserRole, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/hash-password';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { forgotPassword } from './dto/forgot-password.dto';
import { MailService } from 'src/mails/mail.service';
import { UpdatePasswordDto } from './dto/update-userPassword.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | CoreOutPut> {
    try {
      const exists = await this.user.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (exists) {
        return {
          success: false,
          error: 'Email already exist',
        };
      }

      const passwordByHash = await hashPassword(createUserDto.password);

      const user = this.user.create({
        email: createUserDto.email,
        password: passwordByHash,
        name: createUserDto.name,
        role: EUserRole.USER,
      });

      await this.user.save(user);

      return user;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    try {
      const user = await this.user.findOne({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.user.findOneOrFail({
        where: {
          email: email,
        },
      });

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async findById(userId: number) {
    try {
      const user = await this.user.findOneOrFail({
        where: {
          id: userId,
        },
      });

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async forgotPassword({ email }: forgotPassword) {
    const userExists = await this.user.findOneOrFail({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const resetCodeExpiry = new Date(Date.now() + 15 * 60000);

    userExists.resetCode = resetCode;
    userExists.resetCodeExpiry = resetCodeExpiry;

    this.mailService.sendMailForgotPassword(email, resetCode);

    await this.user.save(userExists);

    return {
      success: true,
    };
  }

  async updatePassword(dto: UpdatePasswordDto) {
    const { email, resetCode, newPassword } = dto;

    const userExists = await this.user.findOneOrFail({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new BadRequestException('Không tìm thấy user');
    }

    if (
      !userExists.resetCode ||
      userExists.resetCode != resetCode ||
      userExists.resetCodeExpiry < new Date()
    ) {
      throw new BadRequestException('Code không khớp hoặc đã hết hạn');
    }

    //update password
    userExists.password = await hashPassword(newPassword);
    userExists.resetCode = null;
    userExists.resetCodeExpiry = null;

    await this.user.save(userExists);
    return {
      success: true,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
