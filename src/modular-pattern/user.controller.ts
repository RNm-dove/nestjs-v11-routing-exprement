import { Controller, Get, Param } from '@nestjs/common';

/**
 * UserController handles basic user routes in the modular pattern.
 * Using empty @Controller() decorator to define all routes via method decorators.
 */
@Controller()
export class UserController {
  /**
   * GET /users - Returns list of all users
   */
  @Get('/users')
  getUsers() {
    return {
      route: '/users',
      description: 'Users list (modular pattern)',
      pattern: 'modular',
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
      description: 'User details (modular pattern)',
      pattern: 'modular',
      userId: id,
    };
  }
}
