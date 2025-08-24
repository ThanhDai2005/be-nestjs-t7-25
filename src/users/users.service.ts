import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EUserRole, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/hash-password';
import { CoreOutPut } from 'src/common/dtos/output.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
