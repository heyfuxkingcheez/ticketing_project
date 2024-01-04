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
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    type: RegisterDto,
  })
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

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return await this.userService.login(loginDto.email, loginDto.password, res);
  }

  // 유저 정보 조회
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '조회 성공',
  })
  @ApiResponse({
    status: 401,
    description: '조회 실패',
  })
  @ApiResponse({
    status: 404,
    description: '조회 할 목록이 없습니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'userId',
    required: true,
    description: '사용자 ID',
  })
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    const user = this.userService.getUser(userId);
    return user;
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @UseGuards(AuthGuard('naver'))
  @Get('login/naver')
  async loginNaver() {
    return;
  }

  @ApiOperation({ summary: '네이버 로그인 콜백' })
  @ApiResponse({
    status: 201,
    description: '네이버 로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: '네이버 로그인 실패',
  })
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
