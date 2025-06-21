import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(process.cwd(), 'key.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), 'cert.pem')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  // const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173',

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드
    credentials: true, // 인증 정보(쿠키, 인증 헤더 등)를 포함한 요청 허용 여부
    // preflight requests에 대한 응답 상태 코드 (일부 레거시 브라우저 호환성을 위해 200으로 설정하기도 함)
    optionsSuccessStatus: 200,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
