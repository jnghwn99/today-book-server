export class ReviewResponseDto {
  id: number;
  content: string;
  userId: number;
  bookIsbn13: string;
  createdAt: Date;
  updatedAt: Date;

  // 사용자 정보 (선택적)
  user?: {
    id: number;
    email?: string;
    nickname: string;
    image?: string;
  };
}
