import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn()
  id: string;
  @Column()
  title: string;
}
