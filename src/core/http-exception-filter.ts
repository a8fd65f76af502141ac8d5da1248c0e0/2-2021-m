import {ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger} from "@nestjs/common";
import {Response} from "express";
import {AdapterException} from "src/core/common/exceptions/adapter.exception";

@Catch(AdapterException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    public catch(exception: AdapterException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error(exception.message, exception.stack);

        const isDevEnv: boolean = process.env.APP_ENV === "dev";
        const errorObject = {name: exception.name, reason: exception.message};

        const handledExceptionInstance = new InternalServerErrorException(errorObject);

        handledExceptionInstance.cause = exception;

        const responseMessage = isDevEnv
            ? Object.assign(handledExceptionInstance.getResponse(), {trace: exception.stack})
            : handledExceptionInstance.getResponse();

        response.status(handledExceptionInstance.getStatus()).json(responseMessage);
    }
}
