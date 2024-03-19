import {registerAs} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import * as process from "process";
import {ProductEntity} from "../product/entities/product.entity";
import {CategoryEntity} from "../product/entities/category.entity";

export const REGISTER_DATABASE_TOKEN = "database";

/**
 * Конфигуратор для TypeORM.
 * */
export default registerAs(REGISTER_DATABASE_TOKEN, (): TypeOrmModuleOptions => {
    return {
        type: "postgres",
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT),
        username: process.env.TYPEORM_USER,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DB,
        entities: [ProductEntity, CategoryEntity],
        migrations: [],
        logging: process.env.TYPEORM_LOGGING == "true",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        loggerLevel: (process.env.TYPEORM_LOGGING_LEVEL as unknown) || "debug",
        synchronize: true,
        dropSchema: false,
    };
});
