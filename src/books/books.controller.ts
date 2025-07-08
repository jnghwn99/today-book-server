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
import { FindBooksQueryDto, SearchBooksQueryDto } from './dto';

@Controller('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Get('search')
	search(@Query() searchBooksQueryDto: SearchBooksQueryDto) {
		return this.booksService.search(searchBooksQueryDto);
	}

	@Get(':isbn13')
	findOne(@Param('isbn13') isbn13: string) {
		return this.booksService.findOne(isbn13);
	}

	@Get()
	findAll(@Query() findBooksQueryDto: FindBooksQueryDto) {
		return this.booksService.findAll(findBooksQueryDto);
	}
}
