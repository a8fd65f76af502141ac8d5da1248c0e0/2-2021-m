import {registerAs} from "@nestjs/config";

export type SwaggerConfigSchemaType = Readonly<{
    apiVersion: string;
    apiTitle: string;
    apiDescription: string;
    apiSwaggerUri: string;
}>;

export const REGISTER_SWAGGER_TOKEN = "swagger";

export const useSwaggerOptions: () => SwaggerConfigSchemaType = () => {
    return {
        apiVersion: (process.env.SWAGGER_API_VERSION ? process.env.SWAGGER_API_VERSION : process.env.APP_VERSION) as string,
        apiTitle: process.env.SWAGGER_API_TITLE as string,
        apiDescription: process.env.SWAGGER_API_DESCRIPTION as string,
        apiSwaggerUri: process.env.SWAGGER_API_URI as string,
    };
};

/**
 * Конфигурация для NestJS Swagger
 * */
export default registerAs(REGISTER_SWAGGER_TOKEN, (): SwaggerConfigSchemaType => {
    return useSwaggerOptions();
});
