import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { HttpService } from '@nestjs/axios';
import { FindBooksQueryDto } from './dto/findAll-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(queryDto: FindBooksQueryDto) {
    const { page, limit, type: queryType, categoryId } = queryDto;
    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
    // const queryParams = `?TTBKey=${TTBKey}&QueryType=Bestseller&MaxResults=20&start=1&SearchTarget=Book&Output=js&Version=20131101`;
    const params = new URLSearchParams({
      TTBKey: TTBKey ?? '',
      QueryType: queryType || 'Bestseller',
      MaxResults: limit ? String(limit) : '20',
      start: page ? String((page - 1) * (limit || 20) + 1) : '1',
      SearchTarget: 'Book',
      Output: 'js',
      Version: '20131101',
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;
    // console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인
    const response = await this.httpService.axiosRef.get(fullUrl);
    // console.log(response.data);
    return response.data.item;
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
