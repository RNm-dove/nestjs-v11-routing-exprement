import { Module } from '@nestjs/common';
import { UserFrendsController } from './user-frends.controller';

/**
 * UserFrendsModule - Module for user friends routes
 * 
 * This module encapsulates the UserFrendsController which handles:
 * - GET /users/frends
 * - GET /users/:id/frends
 */
@Module({
  controllers: [UserFrendsController],
})
export class UserFrendsModule {}
