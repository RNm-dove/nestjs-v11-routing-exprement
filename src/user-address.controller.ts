import { Controller, Get } from '@nestjs/common';

/**
 * UserAddressController handles user address routes.
 * Using empty @Controller() decorator to define all routes via method decorators.
 * 
 * This controller tests routing behavior when:
 * - Same segment count as /users/config (2 segments)
 * - Different controller (separate from UsersController)
 * - Imported after UsersController in AppModule
 */
@Controller()
export class UserAddressController {
  /**
   * GET /users/address - Returns user address configuration
   * Same segment count as /users/:id but in a different controller
   */
  @Get('/users/address')
  getUserAddress() {
    return {
      route: '/users/address',
      description: 'User address endpoint',
      data: {
        addressType: 'delivery',
        available: true,
      },
    };
  }
}
