import { AladinBookItemDto } from './aladin-book-item.dto';

export class AladinBookResponse {
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
	item: AladinBookItemDto[];
	errorCode?: string;
	errorMessage?: string;
}
