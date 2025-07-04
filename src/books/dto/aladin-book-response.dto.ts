import { AladinBookItem } from './index';

export interface AladinBookResponse {
  version: string;
  logo: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinBookItem[];
  errorCode?: string;
  errorMessage?: string;
}
