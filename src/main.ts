import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BotGateway } from './bot/events/bot.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // (Tuỳ chọn) endpoint health nhanh, giúp kiểm tra service trên Render
  app.getHttpAdapter().get('/health', (_req, res) => res.json({ ok: true }));

  const bot = app.get(BotGateway);
  bot.initEvent(); // đảm bảo hàm này không chạy tác vụ nặng/blocking khi khởi động

  const port = Number(process.env.PORT) || 8888;
  await app.listen(port, '0.0.0.0'); // quan trọng với Render
}
bootstrap();
