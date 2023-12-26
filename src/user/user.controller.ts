import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.sex,
      registerDto.phone,
    );
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return await this.userService.login(loginDto.email, loginDto.password, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }

  @Get('check')
  checkUser(@Req() req: any) {
    const userPayload = req.user;
    return this.userService.checkUser(userPayload);
  }

  // 물어봐야지 check 보다 위에있으면 왜 일로 넘어가는지...
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    const user = this.userService.getUser(userId);
    return user;
  }

  @UseGuards(AuthGuard('naver'))
  @Get('login/naver')
  async loginNaver() {
    return;
  }

  @UseGuards(AuthGuard('naver'))
  @Get('naver/callback')
  async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    console.log(req.user);
    try {
      return await this.userService.OAuthLogin({ req, res });
    } catch (error) {
      console.error('Error in loginNaver', error);
    }
  }
}
