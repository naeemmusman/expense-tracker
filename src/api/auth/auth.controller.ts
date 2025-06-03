import { Request, Response } from "express";
import { Types } from "mongoose";
import { ErrorType, HttpCode } from "../../core/enums";
import { AppError } from "../../core/errors/app.error";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {

    async signup(req: Request, res: Response): Promise<void> {
        try {
            const user = await authService.signUp(req.body);
            res.send(user);
        } catch (error: any) {
            res.status(HttpCode.badRequest).json({ message: error.message });
        }
    }

    signin(req: Request, res: Response): void {
        try {
            if (!req.user) {
                throw AppError.unauthorized(ErrorType.Unauthorized);
            }
            res.send(authService.signIn(req.user));
        } catch (error: any) {
            res.status(HttpCode.unauthorized).json({ message: error.message });
        }
    }

    getProfile(req: Request, res: Response): any {
        if (req.user) {
            const { firstName, lastName, email, dateOfBirth, address, accountActivated } = req.user;

            res.json({ firstName, lastName, email, dateOfBirth, address, accountActivated });
        }
    }


    async createPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw AppError.unauthorized(ErrorType.Unauthorized);
            }

            const resetPasswordOTP = await authService.createPasswaordResetRequest(req.user);
            res.send(resetPasswordOTP);
        } catch (error: any) {
            res.status(HttpCode.unauthorized).json({ message: error.message });
        }

    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw AppError.unauthorized(ErrorType.Unauthorized);
            }
            const { password } = req.body;
            const result = await authService.resetPassword(req.user._id as Types.ObjectId, password);

            res.send(result);
        } catch (error: any) {
            res.send({ success: false, message: error.message });
        }
    }
}