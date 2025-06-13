import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindBooksQueryDto {
  @IsString()
  readonly type: string = 'Bestseller';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly categoryId?: number = 0;

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
}
