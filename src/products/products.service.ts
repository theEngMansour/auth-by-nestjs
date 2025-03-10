import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '@/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@/users/users.service';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { UserEntity } from '@/users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  public async createProduct(userId: number, dto: CreateProductDto) {
    const user: UserEntity | null =
      await this.usersService.getCurrentUser(userId);
    if (user) {
      const product: Product = this.productsRepository.create({
        ...dto,
        user,
      });
      await this.productsRepository.save(product);
      return { message: 'create product successfully !' };
    }

    return { message: 'user not found !' };
  }
}
