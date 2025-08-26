import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EUserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

interface TokenPayload {
  userId: number;
  role: EUserRole;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log('accessToken:: ', req?.cookies?.accessToken);
          return req?.cookies?.accessToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ userId, role }: TokenPayload) {
    const user = await this.userService.findById(userId);

    user['password'] = null;

    return user;
  }
}
