import { Module } from '@nestjs/common';
import { UsersIndexModule } from './users-index.module';

/**
 * AppModuleModular - Alternative app module using modular pattern
 * 
 * This module demonstrates a different approach to organizing controllers:
 * - All controllers are separated into their own modules
 * - Each module is imported into UsersIndexModule
 * - AppModule only imports UsersIndexModule
 * 
 * Module hierarchy:
 * AppModuleModular
 *   └── UsersIndexModule
 *         ├── UserModule
 *         │     └── UserController
 *         ├── UserProfileModule
 *         │     └── UserProfileController
 *         └── UsersFrendsIndexModule
 *               └── UserFrendsModule
 *                     └── UserFrendsController
 * 
 * This pattern tests route shadowing behavior with nested module imports.
 */
@Module({
  imports: [UsersIndexModule],
})
export class AppModuleModular {}
