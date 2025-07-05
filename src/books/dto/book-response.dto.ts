export class BookResponseDto {
  id: string; // ISBN13
  title: string;
  link?: string;
  author?: string;
  pubDate?: string;
  description?: string;
  itemId?: number;
  priceSales?: number;
  priceStandard?: number;
  mallType?: string;
  stockStatus?: string;
  mileage?: number;
  cover?: string;
  categoryId?: number;
  categoryName?: string;
  publisher?: string;
  salesPoint?: number;
  adult?: boolean;
  fixedPrice?: boolean;
  customerReviewRank?: number;
  subTitle?: string;
  originalTitle?: string;
  itemPage?: number;

  // 메타데이터
  createdAt?: Date;
  updatedAt?: Date;
  reviewCount?: number;
}
