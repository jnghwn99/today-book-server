import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { FindBooksQueryDto, SearchBooksQueryDto } from './dto/index';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('search')
  search(@Query() searchBooksQueryDto: SearchBooksQueryDto) {
    return this.booksService.search(searchBooksQueryDto);
  }

  @Get()
  findAll(@Query() findBooksQueryDto: FindBooksQueryDto) {
    return this.booksService.findAll(findBooksQueryDto);
  }

  @Get(':isbn13')
  findOne(@Param('isbn13') isbn13: string) {
    return this.booksService.findOne(isbn13);
  }
}
