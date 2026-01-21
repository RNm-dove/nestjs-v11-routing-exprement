import { Controller, Get, Param } from '@nestjs/common';

/**
 * UserProfileController handles user profile routes in the modular pattern.
 * Using empty @Controller() decorator to define all routes via method decorators.
 */
@Controller()
export class UserProfileController {
  /**
   * GET /users/:id/profile - Returns profile of a specific user
   */
  @Get('/users/:id/profile')
  getUserProfile(@Param('id') id: string) {
    return {
      route: '/users/:id/profile',
      description: 'User profile (modular pattern)',
      pattern: 'modular',
      userId: id,
      data: {
        name: `User ${id}`,
        email: `user${id}@example.com`,
      },
    };
  }
}
