import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsNotEmpty({ message: '성별을 입력해주세요' })
  sex: string;

  @IsNumberString()
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  phone: string;
}
