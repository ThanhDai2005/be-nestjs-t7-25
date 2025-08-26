import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, SignInOutPut } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import JwtRefreshTokenGuard from './guard/jwt-refresh-token.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('[Users] Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOkResponse({
    type: SignInOutPut,
  })
  async create(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInOutPut> {
    const data = await this.authService.create(createAuthDto);

    res.cookie('accessToken', data.accessToken, {
      maxAge: Number(process.env.JWT_EXPIRATION_TIME),
    });

    res.cookie('refreshToken', data.refreshToken, {
      maxAge: Number(process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN),
    });

    return {
      ...data,
    };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(JwtRefreshTokenGuard)
  @ApiBearerAuth('token')
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.refreshToken(user);

    res.cookie('accessToken', data.accessToken, {
      maxAge: Number(process.env.JWT_EXPIRATION_TIME),
    });

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
