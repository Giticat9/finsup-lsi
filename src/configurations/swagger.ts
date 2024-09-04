import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

export const configureSwaggerDoc = (app: INestApplication) => {
    const configService = app.get(ConfigService);

    const title = configService.get<string>('SWAGGER_TITLE') ?? 'Finsup LSI Api'
    const version = configService.get<string>('SWAGGER_VERSION') ?? '1.0.0'

    const swaggerConfig = new DocumentBuilder()
        .setTitle(title)
        .setVersion(version)
        .addTag('limits', 'Методы для работы со списком лимитов ИНН')
        .addTag('requests', 'Методы для работы со списком заявок')
        .addTag('logs')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/swagger', app, document);
}