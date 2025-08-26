import { Injectable } from '@nestjs/common';
import { CreateAuthDto, SignInOutPut } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<SignInOutPut> {
    const { email, password } = createAuthDto;

    const { success, user } = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return {
        success: false,
        error: 'Invalid authentication',
      };
    }

    delete user.password;

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN || 3600000,
      secret: process.env.JWT_SECRET,
    });

    return {
      success: true,
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(user: User) {
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET,
    });

    return { accessToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
