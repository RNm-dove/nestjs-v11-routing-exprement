import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('\nAvailable endpoints:');
  console.log('  - GET http://localhost:3000/users');
  console.log('  - GET http://localhost:3000/users/123');
  console.log('  - GET http://localhost:3000/users/config');
  console.log('  - GET http://localhost:3000/users/123/contents');
  console.log('  - GET http://localhost:3000/users/123/contents/456');
}

bootstrap();
