import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindBooksQueryDto {
  @IsString()
  readonly type: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly categoryId?: number;
}
