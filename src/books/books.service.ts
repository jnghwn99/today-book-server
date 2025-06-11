import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async getBooks() {
    const ttbKey = process.env.API_TTB_KEY;
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=Bestseller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;
    const response = await this.httpService.axiosRef.get(url);
    return response.data;
  }

  // create(createBookDto: CreateBookDto) {
  //   return 'This action adds a new book';
  // }

  // findAll() {
  //   return `This action returns all books`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} book`;
  // }

  // update(id: number, updateBookDto: UpdateBookDto) {
  //   return `This action updates a #${id} book`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} book`;
  // }
}
