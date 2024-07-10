import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAuthMiddleware } from 'middlewares/wsauth.middleware';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(WsAuthMiddleware);
  await app.listen(3000);
}
bootstrap();
