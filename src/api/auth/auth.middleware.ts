import bcrypt from "bcrypt";
import e, { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";
import { ErrorType, HttpCode, NotificationType } from "../../core/enums";
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
        const { FAILED_LOGINS_ATTEMPTS = 3 , ACCOUNT_LOCK_DURATION_HOURS = 3 } = process.env;
        const unauthResponse = {
            message: 'Invalid credentials provided',
            error: ErrorType.Unauthorized,
            notification: NotificationType.error
        };

        
        try {
            let user = await UserModel.findOne({ email }).select('+password');
            if (!user) {
                // user can make multiple failed attempts using incorrect emails, 
                return res.status(HttpCode.unauthorized).json(unauthResponse);
            }
            const { _id, failedLogins } = user;

            if (!user.accountActivated) {
                return res.status(HttpCode.unauthorized).json({
                    message: 'Account is not activated',
                    error: ErrorType.Unauthorized,
                    notification: NotificationType.error
                });
            }

            // if account is or was locked
            if (user.lockedUntil !== null) {
                if (moment(user.lockedUntil).isBefore(moment()) ) {
                    // account lockout period has passed, unlock user account.
                    await UserModel.findByIdAndUpdate( _id, 
                        {
                            failedLogins: 0,
                            lockedUntil: null
                        },
                        { new: true } 
                    );

                } else {
                    return res.status(HttpCode.forbidden).json({
                        message: 'Account is locked',
                        error: ErrorType.Unauthorized,
                        notification: NotificationType.critical
                    });
                }
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                // TODO:    implement failed login attempt increament if attempts <= 3 then 
                
                const maxAllowedAttempts =  Number(FAILED_LOGINS_ATTEMPTS)

                if (failedLogins <= maxAllowedAttempts ) {
                    // if failedLogins = 3 means this is 4th failed attempt. in this scenioro we locked the account.  
                    const toUpdate = failedLogins === maxAllowedAttempts ?  
                                        { 
                                            $set: {
                                                lockedUntil:  moment().add(ACCOUNT_LOCK_DURATION_HOURS, 'hour').toDate() 
                                            }
                                        }:
                                        { 
                                            $inc: { failedLogins: 1 }
                                        } ; 
                
                    if (failedLogins === maxAllowedAttempts) {
                        unauthResponse.message =  'Invalid credentials provided , your account is locked now !';
                        unauthResponse.notification = NotificationType.critical;
                    } else if (failedLogins === 2) {
                        unauthResponse.message = 'Too many failed attempts, any futher attempts will result in account being locked.';
                    }

                    await UserModel.findByIdAndUpdate( _id, toUpdate, { new: true } );
                    return res.status(HttpCode.unauthorized).json(unauthResponse);
                }
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
            if (user.lockedUntil !== null) {
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