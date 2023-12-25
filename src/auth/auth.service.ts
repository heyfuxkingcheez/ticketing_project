import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async validateUser(userEmail: string): Promise<any> {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      return null;
    }
    return user;
  }
}
