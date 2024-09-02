import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { raw } from 'body-parser';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        credentials: true,
    });

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(raw({ type: 'application/octet-stream', limit: '10mb' }));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Finsup LSI Api')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/swagger', app, document);

    const configService: ConfigService = app.get(ConfigService);
    const port = configService.get<number>('SERVER_PORT') ?? 3000;

    await app.listen(port);
}
bootstrap();
