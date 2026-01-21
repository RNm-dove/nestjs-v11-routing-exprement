import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { UserProfileModule } from './user-profile.module';
import { UsersFrendsIndexModule } from './users-frends-index.module';

/**
 * UsersIndexModule - Main index module for all user-related functionality
 * 
 * This module aggregates all user-related sub-modules:
 * - UserModule (basic user routes)
 * - UserProfileModule (user profile routes)
 * - UsersFrendsIndexModule (user friends routes)
 * 
 * Module hierarchy:
 * UsersIndexModule
 *   ├── UserModule
 *   ├── UserProfileModule
 *   └── UsersFrendsIndexModule
 *         └── UserFrendsModule
 */
@Module({
  imports: [
    UserModule,
    UserProfileModule,
    UsersFrendsIndexModule,
  ],
})
export class UsersIndexModule {}
