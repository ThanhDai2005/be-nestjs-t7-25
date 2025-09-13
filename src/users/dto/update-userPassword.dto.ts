import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Code sent to email',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  resetCode: string;

  @ApiProperty({
    description: 'New password',
  })
  @Length(6, 20)
  newPassword: string;
}
