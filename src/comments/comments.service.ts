import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  create(isbn: string, createCommentDto: CreateCommentDto, userId: number) {
    return this.commentRepository.save({
      content: createCommentDto.content,
      bookId: isbn,
      userId: userId,
    });
  }

  findAll(isbn: string) {
    return this.commentRepository.find({ where: { bookId: isbn } });
  }

  update(isbn: string, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(isbn, updateCommentDto);
  }

  remove(isbn: string) {
    return this.commentRepository.delete(isbn);
  }
}
