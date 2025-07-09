export class ReviewResponseDto {
	id: number;
	content: string;
	userId: string;
	bookIsbn13: string;
	createdAt: Date;
	updatedAt: Date;

	// 사용자 정보 (선택적)
	user?: {
		id: string;
		email?: string;
		nickname: string;
		image?: string;
	};
}
