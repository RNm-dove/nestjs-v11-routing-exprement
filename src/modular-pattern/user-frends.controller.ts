import { Controller, Get, Param } from '@nestjs/common';

/**
 * UserFrendsController handles user friends routes in the modular pattern.
 * Using empty @Controller() decorator to define all routes via method decorators.
 * 
 * Note: "frends" is intentionally spelled this way as per the requirement.
 */
@Controller()
export class UserFrendsController {
  /**
   * GET /users/frends - Returns list of all user friends
   * This tests route shadowing: will it be absorbed by /users/:id?
   */
  @Get('/users/frends')
  getUserFrends() {
    return {
      route: '/users/frends',
      description: 'User frends list (modular pattern)',
      pattern: 'modular',
      data: ['frend1', 'frend2', 'frend3'],
    };
  }

  /**
   * GET /users/:id/frends - Returns friends of a specific user
   */
  @Get('/users/:id/frends')
  getUserFrendsById(@Param('id') id: string) {
    return {
      route: '/users/:id/frends',
      description: 'User frends (modular pattern)',
      pattern: 'modular',
      userId: id,
      data: ['frend1', 'frend2'],
    };
  }
}
