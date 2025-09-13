import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EUserRole, User } from './entities/user.entity';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import JwtAuthGuard from 'src/auth/guard/jwt.guard';
import { forgotPassword } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-userPassword.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
@ApiTags('[Users] Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Signup',
  })
  @ApiOkResponse({
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User | CoreOutPut> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.USER)
  @ApiBearerAuth('token')
  @Get('/profile')
  @ApiOkResponse({
    type: User,
  })
  @ApiOperation({
    summary: 'Get profile',
  })
  async getProfile(@CurrentUser() user: User) {
    return {
      user,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get info',
  })
  @ApiOkResponse({
    type: User,
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
  })
  async forgotPassword(@Body() dto: forgotPassword) {
    return this.usersService.forgotPassword(dto);
  }

  @Post('update-password')
  @ApiOperation({
    summary: 'Update password',
  })
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
