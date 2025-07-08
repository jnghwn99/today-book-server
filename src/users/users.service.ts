import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = this.usersRepository.create(createUserDto);
		return await this.usersRepository.save(user);
	}

	async findById(id: number): Promise<User | null> {
		const user = await this.usersRepository.findOne({ where: { id } });
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.usersRepository.findOne({ where: { email } });
		return user;
	}

	async updateById(userId: number, updateUserDto: UpdateUserDto) {
		const user = await this.findById(userId);
		if (!user) {
			throw new NotFoundException('사용자를 찾을 수 없습니다.');
		}
		return await this.usersRepository.save({ ...user, ...updateUserDto });
	}

	async deleteById(userId: number): Promise<void> {
		const user = await this.findById(userId);
		if (!user) {
			throw new NotFoundException('사용자를 찾을 수 없습니다.');
		}

		await this.usersRepository.remove(user);
	}
}
