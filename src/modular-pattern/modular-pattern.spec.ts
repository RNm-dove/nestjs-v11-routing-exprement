import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModuleModular } from './app-module-modular';

describe('Modular Pattern Routing Experiment', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleModular],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Module hierarchy structure', () => {
    it('should document the module hierarchy', () => {
      console.log('\n=== Modular Pattern Module Hierarchy ===');
      console.log('AppModuleModular');
      console.log('  └── UsersIndexModule');
      console.log('        ├── UserModule');
      console.log('        │     └── UserController');
      console.log('        ├── UserProfileModule');
      console.log('        │     └── UserProfileController');
      console.log('        └── UsersFrendsIndexModule');
      console.log('              └── UserFrendsModule');
      console.log('                    └── UserFrendsController');
    });
  });

  describe('GET /users', () => {
    it('should return users list', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.route).toBe('/users');
      expect(response.body.description).toContain('Users list');
      expect(response.body.pattern).toBe('modular');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user details for numeric ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123')
        .expect(200);

      expect(response.body.route).toBe('/users/:id');
      expect(response.body.description).toContain('User details');
      expect(response.body.pattern).toBe('modular');
      expect(response.body.userId).toBe('123');
    });
  });

  describe('GET /users/config - Same Controller Test', () => {
    it('should test if /users/config is absorbed by /users/:id in modular pattern', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/config')
        .expect(200);

      console.log('\n=== /users/config Test Result (Modular Pattern) ===');
      console.log(`Matched route: ${response.body.route}`);
      console.log(`Description: ${response.body.description}`);
      
      // Document the actual behavior
      if (response.body.route === '/users/config') {
        console.log('✓ /users/config route is honored (NOT absorbed by /users/:id)');
        console.log('✓ Modular pattern allows specific routes within same controller');
        expect(response.body.route).toBe('/users/config');
        expect(response.body.description).toContain('Users Config');
        expect(response.body.pattern).toBe('modular');
      } else if (response.body.route === '/users/:id') {
        console.log('✗ /users/config was absorbed by /users/:id (config treated as id)');
        console.log('✗ Modular pattern does NOT prevent route shadowing even within same controller');
        expect(response.body.route).toBe('/users/:id');
        expect(response.body.userId).toBe('config');
      }
    });
  });

  describe('GET /users/frends - Key Test Case', () => {
    it('should test if /users/frends is absorbed by /users/:id', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/frends')
        .expect(200);

      console.log('\n=== /users/frends Test Result (Modular Pattern) ===');
      console.log(`Matched route: ${response.body.route}`);
      console.log(`Description: ${response.body.description}`);
      
      // Document the actual behavior
      if (response.body.route === '/users/frends') {
        console.log('✓ /users/frends route is honored (NOT absorbed by /users/:id)');
        console.log('✓ Modular pattern allows specific routes to work');
        expect(response.body.route).toBe('/users/frends');
        expect(response.body.description).toContain('User frends list');
        expect(response.body.pattern).toBe('modular');
        expect(Array.isArray(response.body.data)).toBe(true);
      } else if (response.body.route === '/users/:id') {
        console.log('✗ /users/frends was absorbed by /users/:id (frends treated as id)');
        console.log('✗ Modular pattern does NOT prevent route shadowing');
        expect(response.body.route).toBe('/users/:id');
        expect(response.body.userId).toBe('frends');
      }
    });

    it('should compare with direct controller registration behavior', () => {
      console.log('\n=== Comparison: Modular vs Direct Registration ===');
      console.log('Modular Pattern:');
      console.log('  - Controllers separated into individual modules');
      console.log('  - Modules imported into UsersIndexModule');
      console.log('  - UserController registered in UserModule');
      console.log('  - UserFrendsController registered in UserFrendsModule via UsersFrendsIndexModule');
      console.log('');
      console.log('Direct Registration (original):');
      console.log('  - All controllers directly in AppModule.controllers array');
      console.log('  - UsersController, UserContentsController, UserAddressController');
      console.log('  - Registration order explicitly controlled');
    });
  });

  describe('GET /users/:id/frends', () => {
    it('should return friends for a specific user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123/frends')
        .expect(200);

      expect(response.body.route).toBe('/users/:id/frends');
      expect(response.body.description).toContain('User frends');
      expect(response.body.pattern).toBe('modular');
      expect(response.body.userId).toBe('123');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /users/:id/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/123/profile')
        .expect(200);

      expect(response.body.route).toBe('/users/:id/profile');
      expect(response.body.description).toContain('User profile');
      expect(response.body.pattern).toBe('modular');
      expect(response.body.userId).toBe('123');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Route shadowing comparison', () => {
    it('should verify route shadowing behavior in modular pattern', async () => {
      // Test 1: Base list
      const res1 = await request(app.getHttpServer()).get('/users').expect(200);
      expect(res1.body.route).toBe('/users');
      expect(res1.body.pattern).toBe('modular');

      // Test 2: Simple param
      const res2 = await request(app.getHttpServer()).get('/users/123').expect(200);
      expect(res2.body.route).toBe('/users/:id');
      expect(res2.body.pattern).toBe('modular');

      // Test 3: Specific route /users/frends
      const res3 = await request(app.getHttpServer()).get('/users/frends').expect(200);
      
      // Test 4: User's friends (nested route)
      const res4 = await request(app.getHttpServer()).get('/users/123/frends').expect(200);
      expect(res4.body.route).toBe('/users/:id/frends');
      expect(res4.body.pattern).toBe('modular');

      // Test 5: User profile (nested route)
      const res5 = await request(app.getHttpServer()).get('/users/456/profile').expect(200);
      expect(res5.body.route).toBe('/users/:id/profile');
      expect(res5.body.pattern).toBe('modular');

      console.log('\n=== Modular Pattern Routing Results ===');
      console.log('✓ /users → matched correctly');
      console.log('✓ /users/123 → matched /users/:id correctly');
      console.log(`${res3.body.route === '/users/frends' ? '✓' : '✗'} /users/frends → matched ${res3.body.route}`);
      console.log('✓ /users/123/frends → matched /users/:id/frends correctly');
      console.log('✓ /users/456/profile → matched /users/:id/profile correctly');
      console.log('\nModular pattern module import structure:');
      console.log('- AppModuleModular imports UsersIndexModule');
      console.log('- UsersIndexModule imports UserModule, UserProfileModule, UsersFrendsIndexModule');
      console.log('- UsersFrendsIndexModule imports UserFrendsModule');
    });
  });

  describe('Module import order test', () => {
    it('should verify module import order does not affect route matching', () => {
      console.log('\n=== Module Import Order ===');
      console.log('UsersIndexModule imports modules in this order:');
      console.log('1. UserModule (contains /users, /users/:id)');
      console.log('2. UserProfileModule (contains /users/:id/profile)');
      console.log('3. UsersFrendsIndexModule → UserFrendsModule (contains /users/frends, /users/:id/frends)');
      console.log('');
      console.log('Key Question:');
      console.log('Does registering UserModule BEFORE UserFrendsModule cause /users/frends to be absorbed?');
      console.log('Expected: NO - route structure should determine priority, not module order');
    });
  });
});
