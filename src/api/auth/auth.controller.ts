import { ErrorType, HttpCode } from "../../core/enums";
import { AppError } from "../../core/errors/app.error";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
    // login method
    async signup(req: Request, res: Response): Promise<void> {
        // Validate request body
        try {
            const user = await authService.signUp(req.body);
            res.send(user);
        } catch (error: any) {
            // Handle validation errors
            res.status(400).json({ message: error.message });
        }
    }

    signin(req: Request, res: Response): void {
        // Validate request body
        try {
            if (!req.user) {
                throw AppError.unauthorized(ErrorType.Unauthorized);
            }
            res.send(authService.signIn(req.user));
        } catch (error: any) {
            // Handle validation errors
            res.status(HttpCode.unauthorized).json({ message: error.message });
        }
    }

    getProfile(req: Request, res: Response): any {
        if (req.user) {
            const {
                firstName,
                lastName,
                email,
                dateOfBirth,
                address,
                accountActivated
            } = req.user;

            res.json({
                firstName,
                lastName,
                email,
                dateOfBirth,
                address,
                accountActivated
            });
        }
    }
}