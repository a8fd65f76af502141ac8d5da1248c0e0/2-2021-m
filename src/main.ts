import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "src/app.module";
import {APP_DEFAULT_PORT, APP_HTTP_X_POWERED_BY, APP_PORT_ENV, SWAGGER_API_AUTH_SCHEMA} from "src/config/constants";
import {REGISTER_SWAGGER_TOKEN, SwaggerConfigSchemaType} from "src/config/swagger.config";
import {HttpExceptionFilter} from "src/core/http-exception-filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.disable(APP_HTTP_X_POWERED_BY);
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 400,
            enableDebugMessages: true,
            transform: true,
            validateCustomDecorators: true,
        })
    );

    app.enableCors();

    const config = app.get(ConfigService);

    const swaggerConfig = config.get<SwaggerConfigSchemaType>(REGISTER_SWAGGER_TOKEN) as SwaggerConfigSchemaType;
    const swaggerDocumentBuilder = new DocumentBuilder()
        .setTitle(swaggerConfig.apiTitle)
        .setDescription(swaggerConfig.apiDescription)
        .setVersion(swaggerConfig.apiVersion)
        .addApiKey(
            {
                description: "Master Token для аутентификации и авторизации в приложении",
                in: "header",
                type: "apiKey",
                name: "Authorization",
            },
            SWAGGER_API_AUTH_SCHEMA
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerDocumentBuilder);
    SwaggerModule.setup(swaggerConfig.apiSwaggerUri, app, document);

    await app.listen(config.get<number>(APP_PORT_ENV, APP_DEFAULT_PORT, {infer: true}));

    app.useGlobalFilters(new HttpExceptionFilter());
}
bootstrap();
