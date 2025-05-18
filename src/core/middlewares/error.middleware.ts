import { NextFunction, Request, Response } from "express";
import { IErrorResponse } from "../types";
import { AppError } from "../errors/app.error";
import { ErrorType, HttpCode } from "../enums";

export class ErrorMiddleware {
    public static handleError = (err: unknown, _: Request, res: Response<IErrorResponse>, next: NextFunction): void => {
        if (err instanceof AppError) {
            const { name, message, stack, validationErrors } = err;
            const statusCode = err.statusCode || HttpCode.internalServerError;
            res.statusCode = statusCode;
            res.json({
                name,
                message,
                stack: process.env.NODE_ENV === 'production' ? undefined : stack,
                validationErrors
            });
        } else {
            const statusCode = HttpCode.internalServerError;
            res.statusCode = statusCode;
            res.json({
                name: ErrorType.InternalServerError,
                message: 'An internal server error occurred',
            });
        }
        next();
    }
};