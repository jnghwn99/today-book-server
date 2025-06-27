import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn()
  id: string;
  @Column()
  title: string;
}

// backend/src/books/entities/book-item.type.ts (새 파일로 만들어도 되고, entity에 추가해도 됨)
