import { Controller, Get, Param } from '@nestjs/common';

/**
 * UserProfileController handles user profile routes in the modular pattern.
 * Using empty @Controller() decorator to define all routes via method decorators.
 */
@Controller()
export class UserProfileController {
  /**
   * GET /users/profile-meta - Returns profile metadata
   * Tests whether this route is absorbed by /users/:id
   * Note: Same segment count (2 segments), different controller
   */
  @Get('/users/profile-meta')
  getProfileMeta() {
    return {
      route: '/users/profile-meta',
      description: 'Profile metadata (modular pattern)',
      pattern: 'modular',
      data: {
        version: '1.0',
        fields: ['name', 'email', 'avatar'],
      },
    };
  }

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
