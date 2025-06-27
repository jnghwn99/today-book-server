import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // @Column({ nullable: true })
  // nickname: string;

  // @Column({ nullable: true })
  // profileImage: string;

  // @Column()
  // provider: string;

  // @Column({ unique: true })
  // providerId: string;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
