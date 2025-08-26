import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsNotEmpty()
  password: string;
}

export class SignInOutPut extends CoreOutPut {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}
