import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserContentsController } from './user-contents.controller';
import { UserAddressController } from './user-address.controller';

/**
 * AppModule - Main application module
 * 
 * Controllers are registered in this order to test route shadowing:
 * 1. UsersController (handles /users, /users/:id, /users/config)
 * 2. UserContentsController (handles /users/:id/contents/*)
 * 3. UserAddressController (handles /users/address)
 * 
 * This order tests:
 * - Whether /users/:id/contents is absorbed by /users/:id (different segment count)
 * - Whether /users/address is absorbed by /users/:id (same segment count, different controller)
 * - Whether /users/config is absorbed by /users/:id (same segment count, same controller)
 */
@Module({
  imports: [],
  controllers: [
    UsersController,        // Registered FIRST
    UserContentsController, // Registered SECOND
    UserAddressController,  // Registered THIRD
  ],
  providers: [],
})
export class AppModule {}
