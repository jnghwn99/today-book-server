import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindBooksQueryDto } from './dto/findAll-book.dto';
import { SearchBooksQueryDto } from './dto/search-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async search(searchBookQueryDto: SearchBooksQueryDto) {
    const { query, queryType, page, limit, sort, categoryId } =
      searchBookQueryDto;
    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx`;
    const params = new URLSearchParams({
      TTBKey: TTBKey ?? '',
      Query: query,
      QueryType: queryType || 'Keyword',
      Start: page ? String((page - 1) * (limit || 20) + 1) : '1',
      MaxResults: limit ? String(limit) : '20',
      Sort: sort || 'accuracy',
      CategoryId: categoryId ? String(categoryId) : '0',
      Output: 'js',
      Version: '20131101',
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;
    // console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인
    const response = await this.httpService.axiosRef.get(fullUrl);
    // console.log(response.data);
    return response.data;
  }

  async findAll(findBookQueryDto: FindBooksQueryDto) {
    const { page, limit, type: queryType, categoryId } = findBookQueryDto;
    const queryTypeMap: Record<string, string> = {
      today: 'ItemEditorChoice',
      new: 'ItemNewSpecial',
      best: 'Bestseller',
    };
    const mappedQueryType = queryTypeMap[queryType];
    if (!mappedQueryType) {
      console.log(mappedQueryType);
      throw new BadRequestException('Invalid query type');
    }

    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
    const queryParams = `?TTBKey=${TTBKey}&QueryType=Bestseller&MaxResults=20&start=1&SearchTarget=Book&Output=js&Version=20131101`;

    const params = new URLSearchParams({
      TTBKey: TTBKey ?? '',
      QueryType: mappedQueryType,
      SearchTarget: 'Book',
      Start: page ? String((page - 1) * (limit || 20) + 1) : '1',
      MaxResults: limit ? String(limit) : '20',
      CategoryId: categoryId ? String(categoryId) : '0',
      Output: 'js',
      Version: '20131101',
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인
    const response = await this.httpService.axiosRef.get(fullUrl);
    console.log(response.data);
    return response.data;
  }

  async findOne(isbn: string) {
    const TTBKey = process.env.API_TTB_KEY;
    const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx`;
    const params = new URLSearchParams({
      TTBKey: TTBKey ?? '',
      ItemId: isbn,
      ItemIdType: 'ISBN13',

      output: 'js',
      Version: '20131101',
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;
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
