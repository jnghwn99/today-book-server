import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('reviews')
export class Review {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	content: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'book_isbn13' })
	bookIsbn13: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// 관계 설정
	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Book, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'book_isbn13', referencedColumnName: 'isbn13' })
	book: Book;
}
