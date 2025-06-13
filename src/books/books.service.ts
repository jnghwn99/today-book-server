import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async getBooks() {
    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
    const queryParams = `?TTBKey=${TTBKey}&QueryType=Bestseller&MaxResults=20&start=1&SearchTarget=Book&Output=js&Version=20131101`;
    const fullUrl = baseUrl + queryParams;
    const response = await this.httpService.axiosRef.get(fullUrl);
    return response.data;
  }

  findAll() {
    return `This action returns all books`;
  }

  async findOne(isbn: string) {
    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx`;
    const queryParams = `?TTBKey=${TTBKey}&ItemId=${isbn}&ItemIdType=ISBN13&output=js&Version=20131101`;
    const fullUrl = baseUrl + queryParams;
    // console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인
    const response = await this.httpService.axiosRef.get(fullUrl);
    // console.log(response.data);
    return response.data.item[0];
  }

  // create(createBookDto: CreateBookDto) {
  //   return 'This action adds a new book';
  // }

  // update(id: number, updateBookDto: UpdateBookDto) {
  //   return `This action updates a #${id} book`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} book`;
  // }
}
