import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";
import { ErrorType, HttpCode } from "../../core/enums";
import { AppError } from "../../core/errors/app.error";
import { UserModel } from "../../domain/models/user";
import { SignUpDTO } from "./auth.validator";

export class AuthMiddleware {

    static userExists = async (req: Request<{}, {}, SignUpDTO>, res: Response, next: NextFunction): Promise<any> => {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                return res.status(HttpCode.badRequest).json({
                    message: 'User already exists',
                    error: ErrorType.BadRequest
                });
            }
        } catch (error) {
            console.error('Registration Check fail', error);
            return res.status(HttpCode.internalServerError).json({
                message: 'Internal server error',
            });
        }
        next();
    };

    static validateSignIn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { email, password } = req.body;
        const unauthResponse = {
            message: 'Invalid credentials provided',
            error: ErrorType.Unauthorized
        };

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(HttpCode.unauthorized).json(unauthResponse);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(HttpCode.unauthorized).json(unauthResponse);
            }
            if (user.accountLocked) {
                return res.status(HttpCode.unauthorized).json({
                    message: 'Account is locked',
                    error: ErrorType.Unauthorized
                });
            }
            if (!user.accountActivated) {
                return res.status(HttpCode.unauthorized).json({
                    message: 'Account is not activated',
                    error: ErrorType.Unauthorized
                });
            }
            req.user = user.toObject();

        } catch (error) {
            console.error('Registration Check fail', error);
            return res.status(HttpCode.internalServerError).json({
                message: 'Internal server error',
            });
        }
        next();
    };

    static authenticateJwt = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { JWT_SECRET } = process.env;
        const { authorization } = req.headers;

        if (!authorization || !authorization?.startsWith('Bearer ')) {
            return AppError.unauthorized('Missing or invalid authorization header!');
        }

        const token = authorization.split(' ')[1];
        try {
            const payload = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
            const user = await UserModel.findOne({ email: payload.email });
            if (user) {
                req.user = user;
            }
            next();
        } catch (error) {
            return AppError.unauthorized('Invalid or expired token!');
        }
    }

    static validateUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { email } = req.body;
        const unauthResponse = {
            message: 'Invalid credentials provided',
            error: ErrorType.Unauthorized
        };

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(HttpCode.unauthorized).json(unauthResponse);
            }
            if (user.accountLocked) {
                return res.status(HttpCode.unauthorized).json({
                    message: 'Account is locked',
                    error: ErrorType.Unauthorized
                });
            }
            if (!user.accountActivated) {
                return res.status(HttpCode.unauthorized).json({
                    message: 'Account is not activated',
                    error: ErrorType.Unauthorized
                });
            }

            req.user = user.toObject();

        } catch (error) {
            console.error('Registration Check fail', error);
            return res.status(HttpCode.internalServerError).json({
                message: 'Internal server error',
            });
        }
        next();
    }


    static validateResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        if (!req.user) {
            return res.status(HttpCode.unauthorized).json({
                message: 'Unauthorized',
                error: ErrorType.Unauthorized
            });
        }

        if (req.user.passwordReset) {
            const isOTPExpired = moment(req.user.passwordReset.expires).isBefore(moment());
            if (isOTPExpired) {
                throw AppError.unauthorized('OTP expired');
            }
            next();
        }
    }
}