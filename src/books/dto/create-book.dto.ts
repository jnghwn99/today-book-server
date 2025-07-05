import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsString()
  isbn13: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  pubDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  itemId?: number;

  @IsOptional()
  @IsNumber()
  priceSales?: number;

  @IsOptional()
  @IsNumber()
  priceStandard?: number;

  @IsOptional()
  @IsString()
  mallType?: string;

  @IsOptional()
  @IsString()
  stockStatus?: string;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsNumber()
  salesPoint?: number;

  @IsOptional()
  @IsBoolean()
  adult?: boolean;

  @IsOptional()
  @IsBoolean()
  fixedPrice?: boolean;

  @IsOptional()
  @IsNumber()
  customerReviewRank?: number;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsOptional()
  @IsString()
  originalTitle?: string;

  @IsOptional()
  @IsNumber()
  itemPage?: number;
}
