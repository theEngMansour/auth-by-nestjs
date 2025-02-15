import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly config: ConfigService) {}
  getAllUser() {
    return {
      say: this.config.get<string>('SAY'),
    };
  }
}
