
import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalAuthGuard } from '../guards/optional-auth/optional-auth.guard';

export function OptionalAuth() {
  return applyDecorators(
    UseGuards(OptionalAuthGuard),
  );
}
