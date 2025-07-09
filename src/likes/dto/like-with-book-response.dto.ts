export class LikeWithBookResponseDto {
	id: number;
	userId: number;
	bookIsbn13: string;
	createdAt: Date;
	updatedAt: Date;

	// 책 정보 포함
	book: {
		isbn13: string;
		title: string;
		author?: string;
		publisher?: string;
		pubDate?: string;
		cover?: string;
		description?: string;
		priceSales?: number;
		priceStandard?: number;
		categoryName?: string;
	};
}
