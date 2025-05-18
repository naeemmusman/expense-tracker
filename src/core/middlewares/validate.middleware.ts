import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ErrorType, HttpCode } from "../enums";
import { authHeaderSchema } from "../../api/auth/schemas.ts/auth-header.schema";
import { AppError } from "../errors/app.error";

export class ValidateMiddleware {
    public static validate = <T>(schema: Joi.ObjectSchema<T>) => {
        return (req: Request<{}, {}, T>, res: Response, next: NextFunction): any => {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            });
            if (error) {
                const validationErrors = error.details.map((err: any) => ({
                    field: err.path[0],
                    message: err.message,
                }));
                return res.status(HttpCode.badRequest).json({
                    statusCode: HttpCode.badRequest,
                    message: ErrorType.ValidationError,
                    error: ErrorType.BadRequest,
                    validationErrors,
                });
            }
            req.body = value; // Update the request body with the validated value
            next();
        };
    };


    public static validateAuthHeader = (req: Request, res: Response, next: NextFunction): any => {
        const { error } = authHeaderSchema.validate(req.headers, { allowUnknown: true });

        if (error) {
            throw AppError.badRequest(error.details[0].message);
        }
        next();
    }

}