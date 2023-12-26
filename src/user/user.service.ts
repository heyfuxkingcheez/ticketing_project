import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Point } from 'src/point/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
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
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      phone,
      sex,
    });

    await this.pointRepository.save({
      UserId: newUser.userId,
    });
  }

  // 로컬 로그인
  async login(
    email: string,
    password: string,
    res,
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

    return { accessToken };
  }

  // 네이버 로그인
  async OAuthLogin({ req, res }) {
    console.log('네이버 유저 서비스 진입 성공!', req);
    // 1. 회원조회
    let user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    // 2. 회원가입이 안되어 있다면, 자동회원 가입
    const hashedPassword = await hash(req.user.id, 12);
    if (!user) {
      await this.userRepository.save({
        email: req.user.email,
        password: hashedPassword,
        name: req.user.name,
        phone: req.user.phone,
        sex: req.user.gender,
      });
      const { email } = req.user;
      const payload = { email };
      const accessToken = await this.jwtService.signAsync(payload);

      return { message: '네이버 로그인 성공!', accessToken };
    }
    // 3. 회원가입이 되어 있다면, 로그인
    const { email } = req.user;
    const payload = { email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { message: '네이버 로그인 성공!', accessToken };
  }

  // 유저 정보 조회
  async getUser(userId: string) {
    return await this.userRepository.findOne({
      where: { userId: +userId },
      select: ['userId', 'email', 'name', 'sex', 'phone'],
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  checkUser(userPayload: any) {
    return `유저 정보: ${JSON.stringify(userPayload)}}`;
  }
}
