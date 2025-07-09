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
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../jwt-cookie/jwt-auth.guard';

// Request 타입 확장
interface RequestWithUser extends Request {
	user: {
		id: string;
		email: string;
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
	@UseGuards(JwtAuthGuard)
	async getCurrentUser(@Req() req: RequestWithUser) {
		const userId = req.user.id;
		return await this.usersService.findById(userId);
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	async update(
		@Req() req: RequestWithUser,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const userId = req.user.id;
		return await this.usersService.updateById(userId, updateUserDto);
	}

	@Delete('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteCurrentUser(@Req() req: RequestWithUser) {
		const userId = req.user.id;
		await this.usersService.deleteById(userId);
	}
}
