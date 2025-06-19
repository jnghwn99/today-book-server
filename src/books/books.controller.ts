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
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBooksQueryDto } from './dto/findAll-book.dto';
import { SearchBooksQueryDto } from './dto/search-book.dto';

@Controller('api/books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	// @Get('search')
	// search(@Query() searchBooksQueryDto: SearchBooksQueryDto) {
	//   return 'This action returns SEARCH';
	// }

	@Get()
	findAll(@Query() findBooksQueryDto: FindBooksQueryDto) {
		return this.booksService.findAll(findBooksQueryDto);
	}

	@Get(':isbn')
	findOne(@Param('isbn') isbn: string) {
		return this.booksService.findOne(isbn);
	}

	// @Post()
	// create(@Body() createBookDto: CreateBookDto) {
	//   return this.booksService.create(createBookDto);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
	//   return this.booksService.update(+id, updateBookDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.booksService.remove(+id);
	// }
}
