import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('books')
export class Book {
  @Column()
  title: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  pubDate: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @PrimaryColumn()
  isbn13: string;

  @Column({ nullable: true })
  itemId: number;

  @Column({ nullable: true })
  priceSales: number;

  @Column({ nullable: true })
  priceStandard: number;

  @Column({ nullable: true })
  mallType: string;

  @Column({ nullable: true })
  stockStatus: string;

  @Column({ nullable: true })
  mileage: number;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  categoryName: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  salesPoint: number;

  @Column({ default: false })
  adult: boolean;

  @Column({ default: false })
  fixedPrice: boolean;

  @Column({ nullable: true })
  customerReviewRank: number;

  @Column({ nullable: true })
  subTitle: string;

  @Column({ nullable: true })
  originalTitle: string;

  @Column({ nullable: true })
  itemPage: number;
}

// backend/src/books/entities/book-item.type.ts (새 파일로 만들어도 되고, entity에 추가해도 됨)
