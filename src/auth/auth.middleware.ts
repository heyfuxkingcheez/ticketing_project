import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: Function) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('JWT 토큰을 찾을 수 없습니다.');
    }

    let token: string;
    try {
      token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verify(token);
      req.user = payload;
      console.log('payload: ', payload);
      next();
    } catch (error) {
      throw new UnauthorizedException('JWT 토큰이 올바르지 않습니다.');
    }
  }
}
