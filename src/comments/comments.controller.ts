import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { extractTokenOrThrow } from 'src/common/utils/cookie.util';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post(':isbn')
  async create(
    @Param('isbn') isbn: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const token = extractTokenOrThrow(req);
    const user = await this.usersService.getCurrentUser(token);
    return this.commentsService.create(isbn, createCommentDto, user.id);
  }

  @Get(':isbn')
  findAll(@Param('isbn') isbn: string) {
    return this.commentsService.findAll(isbn);
  }

  @Patch(':isbn')
  update(
    @Param('isbn') isbn: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(isbn, updateCommentDto);
  }

  @Delete(':isbn')
  remove(@Param('isbn') isbn: string) {
    return this.commentsService.remove(isbn);
  }
}
