import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserContentsController } from './user-contents.controller';

/**
 * AppModule - Main application module
 * 
 * Controllers are registered in REVERSE order to test route shadowing:
 * 1. UserContentsController (handles /users/:id/contents/*)
 * 2. UsersController (handles /users and /users/:id)
 * 
 * This order tests whether NestJS exhibits route shadowing behavior
 * similar to Express v5.
 */
@Module({
  imports: [],
  controllers: [
    UserContentsController, // Registered FIRST (reverse order)
    UsersController,        // Registered SECOND
  ],
  providers: [],
})
export class AppModule {}
