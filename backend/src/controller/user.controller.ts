import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/models/user.dto';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private configService: ConfigService,
  ) { }

  @Post('/register')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiBearerAuth('access-token')
  async googleAuth(@Req() req) { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiBearerAuth('access-token')
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const userProfile = req.user as { email: string; name: string };

    const result = await this.userService.oauthLogin({
      email: userProfile.email,
      name: userProfile.name,
    });

    const url = new URL(`${this.configService.get('URL_FRONTEND')}/auth/callback`);
    url.searchParams.append('token', result.token);
    url.searchParams.append('isNewUser', String(result.newUser));

    return res.redirect(url.toString());
  }

  @Post('register-oauth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async registerOAuthUser(@CurrentUser() userId: { sub: string }, @Body() user: CreateUserDTO) {
    return this.userService.finishregisterOAuthUser(userId, user);
  }

  @Post("login")
  login(@Body() user: LoginUserDTO) {
    return this.userService.login(user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  findOne(@CurrentUser() user: { sub: string }) {
    return this.userService.findOne(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  update(@CurrentUser() user: { sub: string }, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.updateUser(user, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  remove(@CurrentUser() user: { sub: string }) {
    return this.userService.removeUser(user);
  }
}
