import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';
import { Sex } from '../types/sex.type';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @ApiProperty({
    example: 'example@gmail.com',
    description: '이메일',
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @ApiProperty({
    example: 'zxc123',
    description: '비밀번호',
    required: true,
  })
  password: string;

  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @ApiProperty({
    example: '홍길동',
    description: '이름',
    required: true,
  })
  name: string;

  @IsNotEmpty({ message: '성별을 입력해주세요' })
  @ApiProperty({
    example: 'MALE',
    description: '성별',
    required: true,
  })
  sex: Sex;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @ApiProperty({
    example: '010-0000-0000',
    description: '휴대폰 번호',
    required: true,
  })
  phone: string;
}
