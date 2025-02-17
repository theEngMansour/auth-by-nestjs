import { UserType } from '@/utils/constant';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
