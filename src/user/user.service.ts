import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtStrategy } from './../auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    sex: string,
    phone: string,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser)
      throw new ConflictException('이미 사용중인 이메일 입니다.');

    const hashedPassword = await hash(password, 12);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      sex,
      phone,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user))
      throw new UnauthorizedException('이메일을 확인해주세요.');

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException('비밀번호를 확인해주세요.');

    const payload = { email, sub: user.userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async getUser(userId: string) {
    console.log('하이');
    return await this.userRepository.findOne({
      where: { userId: +userId },
      select: ['userId', 'email', 'name', 'sex', 'phone'],
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
