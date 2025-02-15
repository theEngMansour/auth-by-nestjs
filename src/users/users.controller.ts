import { Controller, Get } from '@nestjs/common';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll() {
    return this.usersService.getAllUser();
  }
}
