import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from 'src/auth/types/jwt.type';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  //read
  async getCurrentUser(token: string): Promise<User> {
    try {
      const payload = await this.authService.verifyJwt(token);

      // JwtPayload 클래스로 검증
      const jwtPayload = Object.assign(new JwtPayload(), payload);
      const errors = await validate(jwtPayload);

      if (errors.length > 0) {
        throw new UnauthorizedException('유효하지 않은 JWT 토큰입니다.');
      }

      const user = await this.findByEmail(jwtPayload.email);
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async update(token: string, updateUserDto: UpdateUserDto) {
    const payload = await this.authService.verifyJwt(token);
    const jwtPayload = Object.assign(new JwtPayload(), payload);
    const errors = await validate(jwtPayload);

    if (errors.length > 0) {
      throw new UnauthorizedException('유효하지 않은 JWT 토큰입니다.');
    }
    const user = await this.usersRepository.findOne({
      where: { email: jwtPayload.email },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
