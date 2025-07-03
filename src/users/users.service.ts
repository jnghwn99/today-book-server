import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

interface JwtPayload {
  email: string;
}
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  // async findAll(): Promise<User[]> {
  //   return await this.usersRepository.find();
  // }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  // async getCurrentUser(token: string): Promise<User> {
  //   try {
  //     const payload = this.jwtService.verify(token, {
  //       secret: this.configService.get<string>('JWT_SECRET'),
  //     });

  //     if (
  //       typeof payload !== 'object' ||
  //       payload === null ||
  //       typeof payload.email !== 'string'
  //     ) {
  //       throw new UnauthorizedException('유효하지 않은 JWT 토큰입니다.');
  //     }

  //     const email = payload.email;

  //     const user = await this.findByEmail(email);
  //     if (!user) {
  //       throw new NotFoundException('사용자를 찾을 수 없습니다.');
  //     }

  //     return user;
  //   } catch (error) {
  //     if (
  //       error instanceof UnauthorizedException ||
  //       error instanceof NotFoundException
  //     ) {
  //       throw error;
  //     }
  //     throw new UnauthorizedException('JWT 토큰 검증에 실패했습니다.');
  //   }
  // }
}
