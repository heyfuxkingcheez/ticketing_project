import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtNaverStrategy } from './naver.strategy';
import { AuthService } from './auth.service';
import { PerformanceModule } from 'src/performance/performance.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PerformanceModule,
  ],
  providers: [AuthService, JwtStrategy, JwtNaverStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
