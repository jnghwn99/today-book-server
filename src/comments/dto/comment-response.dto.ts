export class CommentResponseDto {
  id: number;
  content: string;
  userId: number;
  bookId: number;
  createdAt: Date;
  updatedAt: Date;

  // 사용자 정보 (선택적)
  user?: {
    id: number;
    nickname: string;
    image?: string;
  };
}
