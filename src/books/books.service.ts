import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FindBooksQueryDto } from './dto/findAll-book.dto';
import { SearchBooksQueryDto } from './dto/search-book.dto';
import { AladinBookResponse } from './types/aladin-api.type';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  async search(searchBookQueryDto: SearchBooksQueryDto) {
    try {
      const {
        keyword: query,
        keywordType: queryType,
        page,
        limit,
        sort,
        categoryId,
      } = searchBookQueryDto;
      const TTBKey = process.env.ALADIN_TTB_KEY;

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
      return response.data as AladinBookResponse;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch book details');
    }
  }

  async findAll(findBookQueryDto: FindBooksQueryDto) {
    try {
      const { page, limit, type: queryType, categoryId } = findBookQueryDto;
      const queryTypeMap: Record<string, string> = {
        today: 'ItemNewSpecial',
        new: 'ItemNewAll',
        best: 'Bestseller',
      };
      const mappedQueryType = queryTypeMap[queryType];
      if (!mappedQueryType) {
        console.log(mappedQueryType);
        throw new BadRequestException('Invalid query type');
      }

      const TTBKey = process.env.ALADIN_TTB_KEY;
      const baseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
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
      // console.log(`[BooksService] Requesting URL: ${fullUrl}`); // 3. 최종 요청 URL 확인

      const response = await this.httpService.axiosRef.get(fullUrl);
      // console.log(response.data);
      return response.data as AladinBookResponse;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch book details');
    }
  }

  async findOne(isbn: string) {
    try {
      const TTBKey = process.env.ALADIN_TTB_KEY;
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
      return response.data as AladinBookResponse;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch book details');
    }
  }
}
