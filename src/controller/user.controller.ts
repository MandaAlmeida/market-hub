import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/models/user.dto';


import { UserService } from 'src/service/user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    const userProfile = req.user as { email: string; name: string };

    const result = await this.userService.oauthLogin({
      email: userProfile.email,
      name: userProfile.name,
    });

    return { message: 'Login successful', user: result };
  }

  @Post('register-oauth')
  @UseGuards(JwtAuthGuard)
  async registerOAuthUser(@Body() user: CreateUserDTO) {
    return this.userService.finishregisterOAuthUser(user);
  }

  @Post("login")
  login(@Body() user: LoginUserDTO) {
    return this.userService.login(user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: { sub: string }) {
    return this.userService.findOne(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: { sub: string }, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.updateUser(user, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: { sub: string }) {
    return this.userService.removeUser(user);
  }
}
