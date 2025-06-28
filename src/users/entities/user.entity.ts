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

  //body->kakao_account.email : KakaoAccount:string
  @Column({ unique: true, nullable: true })
  email: string;

  //body -> kakao_account.profile.nickname : KakaoAccount:Profile:string
  @Column({ nullable: true })
  nickname: string;

  //body -> kakao_account.profile.profile_image_url : KakaoAccount:Profile:string
  @Column({ nullable: true, name: 'image' })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
