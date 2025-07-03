import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface RequestWithCookies {
  cookies?: {
    jwt_token?: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getCurrentUser(@Req() req: RequestWithCookies) {
    const token = req.cookies?.jwt_token;
    if (!token) {
      throw new UnauthorizedException('JWT 토큰이 없습니다.');
    }

    return this.usersService.getCurrentUser(token);
  }
}
