import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateReviewDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다.' })
	@MaxLength(1000, { message: '댓글 내용은 최대 1000자까지 입력 가능합니다.' })
	content: string;
}
