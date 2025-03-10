import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '@/utils/constant';
import { Exclude } from 'class-transformer';
import { Product } from '@/products/product.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isAccountVerified: boolean;
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  userType: UserType;

  @Column({ nullable: true, default: null })
  profileImage: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @OneToMany(
    (): typeof Product => Product,
    (product: Product): UserEntity => product.user,
  )
  products: Product[];

  getFullName() {
    return this.username;
  }
}
