import * as dotenv from "dotenv";
import {DataSource, DataSourceOptions} from "typeorm";

import * as Path from "path";

const args = dotenv.config().parsed;

const options: DataSourceOptions = {
    type: "postgres",
    host: args?.TYPEORM_HOST_LOCAL,
    port: Number(args?.TYPEORM_PORT),
    username: args?.TYPEORM_USER,
    password: args?.TYPEORM_PASSWORD,
    database: args?.TYPEORM_DB,
    entities: (args?.TYPEORM_ENTITY_PATHS || "").split("|").map((v) => {
        return Path.join(process.cwd(), v);
    }),
    migrations: (args?.TYPEORM_MIGRATIONS_PATHS || "").split("|").map((v) => {
        return Path.join(process.cwd(), v);
    }),
    logging: args?.TYPEORM_LOGGING == "true",
    synchronize: true,
};

console.log(options);

export default new DataSource(options);
