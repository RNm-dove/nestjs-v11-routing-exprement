import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

/**
 * UserModule - Module for basic user routes
 * 
 * This module encapsulates the UserController which handles:
 * - GET /users
 * - GET /users/:id
 */
@Module({
  controllers: [UserController],
})
export class UserModule {}
