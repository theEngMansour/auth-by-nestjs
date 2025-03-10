import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { CurrentUser } from '@/users/decorators/current-user.decorator';
import { JWTPayLoadType } from '@/utils/type';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { AuthRolesGuard } from '@/users/guards/auth-roles.guard';
import { Roles } from '@/users/decorators/user-role.decorator';
import { UserType } from '@/utils/constant';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public async create(
    @CurrentUser() payload: JWTPayLoadType,
    @Body() body: CreateProductDto,
  ): Promise<{ message: string }> {
    return await this.productsService.createProduct(payload.id, body);
  }
}
