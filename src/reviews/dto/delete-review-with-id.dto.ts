import { IsNumber } from 'class-validator';

export class DeleteReviewWithIdDto {
	@IsNumber()
	reviewId: number;
}
