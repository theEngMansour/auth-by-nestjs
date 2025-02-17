import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from '@/utils/constant';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request[CURRENT_USER_KEY];
  },
);
