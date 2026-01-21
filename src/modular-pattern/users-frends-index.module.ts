import { Module } from '@nestjs/common';
import { UserFrendsModule } from './user-frends.module';

/**
 * UsersFrendsIndexModule - Index module for user friends functionality
 * 
 * This module aggregates the UserFrendsModule.
 * Module hierarchy:
 * UsersFrendsIndexModule
 *   └── UserFrendsModule
 */
@Module({
  imports: [UserFrendsModule],
})
export class UsersFrendsIndexModule {}
