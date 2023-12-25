import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    console.log(profile);
    const id = profile.id;
    const email = profile.email;
    const name = profile.name;
    const gender = profile.gender;
    const phone = profile.mobile;
    const user = {
      id,
      email,
      name,
      gender,
      phone,
    };

    return user;
  }
}
