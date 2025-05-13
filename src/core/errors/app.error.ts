import { HttpCode, ErrorType } from "../enums";
import { IValidationType } from "../types";

interface IAppErrorArgs {
    name?: ErrorType
    message: string;
    statusCode: HttpCode;
    isOperational?: boolean;
    validationErrors?: IValidationType[];
};

export class AppError extends Error {
    public readonly name: ErrorType;
    public readonly statusCode: HttpCode;
    public readonly isOperational: boolean = true;
    public readonly validationErrors?: IValidationType[];

    constructor(args: IAppErrorArgs) {
        const { name, message, statusCode, isOperational, validationErrors } = args;
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = name ?? ErrorType.ApplicationError;
        this.statusCode = statusCode;
        if (isOperational !== undefined) {
            this.isOperational = isOperational
        }
        this.validationErrors = validationErrors;

        Error.captureStackTrace(this);
    }

    static badRequest(
        message: string,
        validationErrors?: IValidationType[]
    ): AppError {
        return new AppError({
            name: ErrorType.BadRequest,
            message,
            statusCode: HttpCode.badRequest,
            validationErrors
        });
    }

    static unauthorized(
        message: string
    ): AppError {
        return new AppError({
            name: ErrorType.Unauthorized,
            message,
            statusCode: HttpCode.unauthorized
        });
    }

    static forbidden(
        message: string
    ): AppError {
        return new AppError({
            name: ErrorType.Forbidden,
            message,
            statusCode: HttpCode.forbidden
        });
    }

    static notFound(
        message: string
    ): AppError {
        return new AppError({
            name: ErrorType.NotFound,
            message,
            statusCode: HttpCode.notFound
        });
    }

    static conflict(
        message: string
    ): AppError {
        return new AppError({
            name: ErrorType.Conflict,
            message,
            statusCode: HttpCode.conflict
        });
    }

    static internalServerError(
        message: string
    ): AppError {
        return new AppError({
            name: ErrorType.InternalServerError,
            message,
            statusCode: HttpCode.internalServerError
        });
    }
};