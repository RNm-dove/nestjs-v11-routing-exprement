import { Controller, Get, Param } from '@nestjs/common';

/**
 * UserContentsController handles user content routes.
 * Using empty @Controller() decorator to define all routes via method decorators.
 */
@Controller()
export class UserContentsController {
  /**
   * GET /users/:id/contents - Returns list of contents for a specific user
   * This tests whether the route is absorbed by /users/:id
   */
  @Get('/users/:id/contents')
  getUserContents(@Param('id') id: string) {
    return {
      route: '/users/:id/contents',
      description: 'User contents list',
      userId: id,
      data: ['content1', 'content2'],
    };
  }

  /**
   * GET /users/:id/contents/:contentId - Returns specific content for a user
   */
  @Get('/users/:id/contents/:contentId')
  getUserContentById(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ) {
    return {
      route: '/users/:id/contents/:contentId',
      description: 'User specific content',
      userId: id,
      contentId: contentId,
    };
  }
}
