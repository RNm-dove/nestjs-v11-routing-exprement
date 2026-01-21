import { Controller, Get, Param } from '@nestjs/common';

/**
 * UsersController handles basic user routes.
 * Using empty @Controller() decorator to define all routes via method decorators.
 */
@Controller()
export class UsersController {
  /**
   * GET /users - Returns list of all users
   */
  @Get('/users')
  getUsers() {
    return {
      route: '/users',
      description: 'Users list',
      data: ['user1', 'user2', 'user3'],
    };
  }

  /**
   * GET /users/:id - Returns details of a specific user
   */
  @Get('/users/:id')
  getUserById(@Param('id') id: string) {
    return {
      route: '/users/:id',
      description: 'User details',
      userId: id,
    };
  }

  /**
   * GET /users/config - Defined AFTER /users/:id to test route absorption
   * In Express, this would be absorbed by /users/:id
   */
  @Get('/users/config')
  getUsersConfig() {
    return {
      route: '/users/config',
      description: 'Users Config',
    };
  }
}
