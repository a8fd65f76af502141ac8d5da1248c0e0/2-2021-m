import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {APP_FILTER} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import SwaggerConfig from "src/config/swagger.config";
import TypeormConfig, {REGISTER_DATABASE_TOKEN} from "src/config/typeorm.config";
import {HttpExceptionFilter} from "src/core/http-exception-filter";
import {ProductModule} from "./product/product.module";

@Module({
    controllers: [],
    exports: [ConfigModule],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [TypeormConfig, SwaggerConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ...config.get(REGISTER_DATABASE_TOKEN),
            }),
        }),
        ProductModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
