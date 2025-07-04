import { ReviewResponseDto } from './review-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedReviewResponseDto {
  pagination: PaginationMetaDto;
  data: ReviewResponseDto[];
}
