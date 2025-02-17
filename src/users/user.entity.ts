import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '@/utils/constant';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  userType: UserType;
}
