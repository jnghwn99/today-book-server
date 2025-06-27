import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchBooksQueryDto {
  @IsString()
  readonly keyword: string;

  @IsOptional()
  @IsString()
  readonly keywordType: string = 'Keyword';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number = 20;

  @IsOptional()
  @IsString()
  readonly sort?: string = 'accuracy';

  @IsOptional()
  @IsString()
  readonly categoryId?: string = '0';
}
