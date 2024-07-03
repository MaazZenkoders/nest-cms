import { ExecutionContext } from '@nestjs/common';

export const emailExtractor = (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request;
};