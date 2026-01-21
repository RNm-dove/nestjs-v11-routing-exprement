import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';

describe('NestJS v11 Routing Experiment', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return users list', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.route).toBe('/users');
      expect(response.body.description).toBe('Users list');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user details for numeric ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123')
        .expect(200);

      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('123');
    });

    it('should return user details for string ID "xxxx"', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/xxxx')
        .expect(200);

      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('xxxx');
    });

    it('should return user details for ID "contents" (edge case)', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/contents')
        .expect(200);

      // This tests whether /users/contents is treated as a user ID or routes to contents
      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toBe('User details');
      expect(response.body.userId).toBe('contents');
    });
  });

  describe('GET /users/config (defined AFTER /users/:id)', () => {
    it('should test if /users/config route is honored or absorbed by /users/:id', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/config')
        .expect(200);

      // In NestJS, more specific routes should be prioritized
      // We'll document whether it matches /users/config or /users/:id
      console.log('\n=== /users/config Test Result ===');
      console.log(`Matched route: ${response.body.route}`);
      console.log(`Description: ${response.body.description}`);
      
      // Document the actual behavior
      if (response.body.route === '/users/config') {
        console.log('✓ NestJS prioritizes specific route /users/config over /users/:id');
      } else if (response.body.route === '/users/:id') {
        console.log('✗ /users/config was absorbed by /users/:id (config treated as id)');
      }
    });
  });

  describe('GET /users/address (different controller, same segment count)', () => {
    it('should test if /users/address route is honored or absorbed by /users/:id', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/address')
        .expect(200);

      // This tests the key difference:
      // - /users/config is in the SAME controller as /users/:id
      // - /users/address is in a DIFFERENT controller (UserAddressController)
      console.log('\n=== /users/address Test Result ===');
      console.log(`Matched route: ${response.body.route}`);
      console.log(`Description: ${response.body.description}`);
      
      // Document the actual behavior
      if (response.body.route === '/users/address') {
        console.log('✓ NestJS prioritizes specific route /users/address over /users/:id');
        console.log('  (Different controller from /users/:id)');
      } else if (response.body.route === '/users/:id') {
        console.log('✗ /users/address was absorbed by /users/:id (address treated as id)');
        console.log('  (Even though in different controller)');
      }
    });
  });

  describe('GET /users/:id/contents', () => {
    it('should return user contents list and NOT be absorbed by /users/:id', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123/contents')
        .expect(200);

      // This is the KEY test - verifying the route is NOT absorbed by /users/:id
      expect(response.body.route).toBe('/users/:id/contents');
      expect(response.body.description).toBe('User contents list');
      expect(response.body.userId).toBe('123');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id/contents/:contentId', () => {
    it('should return specific user content and NOT be absorbed by other routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123/contents/456')
        .expect(200);

      // This tests that the most specific route is matched
      expect(response.body.route).toBe('/users/:id/contents/:contentId');
      expect(response.body.description).toBe('User specific content');
      expect(response.body.userId).toBe('123');
      expect(response.body.contentId).toBe('456');
    });
  });

  describe('Route priority verification', () => {
    it('should demonstrate NestJS v11 routing behavior', async () => {
      // Test 1: Base list
      const res1 = await request(app.getHttpServer()).get('/users').expect(200);
      expect(res1.body.route).toBe('/users');

      // Test 2: Simple param
      const res2 = await request(app.getHttpServer()).get('/users/123').expect(200);
      expect(res2.body.route).toBe('/users/:id');

      // Test 3: Nested path - should NOT be absorbed
      const res3 = await request(app.getHttpServer())
        .get('/users/123/contents')
        .expect(200);
      expect(res3.body.route).toBe('/users/:id/contents');

      // Test 4: Double nested path - should NOT be absorbed
      const res4 = await request(app.getHttpServer())
        .get('/users/123/contents/456')
        .expect(200);
      expect(res4.body.route).toBe('/users/:id/contents/:contentId');

      console.log('\n=== NestJS v11 Routing Experiment Results ===');
      console.log('✓ /users → matched correctly');
      console.log('✓ /users/123 → matched /users/:id correctly');
      console.log('✓ /users/123/contents → matched /users/:id/contents (NOT absorbed by /users/:id)');
      console.log('✓ /users/123/contents/456 → matched /users/:id/contents/:contentId correctly');
      console.log('\nConclusion: NestJS v11 prioritizes more specific routes over generic parameter routes.');
    });
  });

  describe('Controller registration order test', () => {
    it('should verify controller registration order does not affect route matching', async () => {
      // Controllers are registered in this order: UsersController, UserContentsController, UserAddressController
      // UsersController has /users/:id (registered FIRST)
      // UserContentsController has /users/:id/contents (registered SECOND)
      
      // Even though UsersController with /users/:id is registered first,
      // the more specific /users/:id/contents should still work
      const response = await request(app.getHttpServer())
        .get('/users/999/contents')
        .expect(200);

      expect(response.body.route).toBe('/users/:id/contents');
      
      console.log('\n=== Controller Registration Order Test ===');
      console.log('Registration order: [UsersController, UserContentsController, UserAddressController]');
      console.log(`Request to /users/999/contents matched: ${response.body.route}`);
      console.log('✓ Controller registration order does not cause route shadowing for different segment counts');
    });

    it('should compare same-segment routes in different controllers', async () => {
      // /users/config is in UsersController (same as /users/:id)
      // /users/address is in UserAddressController (different from /users/:id)
      
      const configResponse = await request(app.getHttpServer())
        .get('/users/config')
        .expect(200);
      
      const addressResponse = await request(app.getHttpServer())
        .get('/users/address')
        .expect(200);

      console.log('\n=== Same Segment Count Comparison ===');
      console.log(`/users/config (same controller as :id): matched ${configResponse.body.route}`);
      console.log(`/users/address (different controller): matched ${addressResponse.body.route}`);
      
      // Key finding: Both are absorbed by /users/:id regardless of controller
      expect(configResponse.body.route).toBe('/users/:id');
      expect(addressResponse.body.route).toBe('/users/:id');
      
      console.log('\n=== Key Finding ===');
      console.log('⚠️ Both /users/config AND /users/address are absorbed by /users/:id');
      console.log('⚠️ Being in a different controller does NOT prevent route absorption');
      console.log('⚠️ Controller registration order determines route priority for same-segment routes');
    });
  });
});
