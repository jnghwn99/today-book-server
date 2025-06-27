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

  // async findAll(): Promise<User[]> {
  //   return await this.usersRepository.find();
  // }

  async findByKakaoId(kakaoId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { kakaoId } });
    return user;
  }
  // async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.findOne(id);
  //   Object.assign(user, updateUserDto);
  //   return await this.usersRepository.save(user);
  // }

  // async remove(id: number): Promise<void> {
  //   const user = await this.findOne(id);
  //   await this.usersRepository.remove(user);
  // }
}
