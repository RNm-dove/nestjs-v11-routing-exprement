import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';

/**
 * UserProfileModule - Module for user profile routes
 * 
 * This module encapsulates the UserProfileController which handles:
 * - GET /users/:id/profile
 */
@Module({
  controllers: [UserProfileController],
})
export class UserProfileModule {}
