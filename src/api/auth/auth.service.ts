import bcrypt from "bcrypt";
import moment from 'moment';
import { Types } from "mongoose";
import { AppError } from '../../core/errors/app.error';
import { UserDocument, UserModel } from "../../domain/models/user";
import { generateToken } from "../../utils/jwt.utils";
import { SignUpDTO } from "./auth.validator";

export class AuthService {
    public async signUp(userData: SignUpDTO): Promise<UserDocument> {
        const { firstName, lastName, dateOfBirth, email, phone, address, password } = userData;

        const newUser = new UserModel({
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone,
            address,
            password,
        });

        return newUser.save();
    }

    public signIn(user: UserDocument): { token: string } {
        const { firstName, lastName, email, phone, address } = user;
        return { token: generateToken({ firstName, lastName, email, phone, address }) };
    }


    public async createPasswaordResetRequest(userDOC: UserDocument): Promise<{ otp: number }> {

        try {
            const passwordReset = {
                resetOTP: this.generateOTP(),
                expires: moment().add(1, 'hour').toDate()
            };

            await UserModel.findOneAndUpdate(
                { email: userDOC.email },
                { passwordReset },
                { new: true }
            );

            // const { API_HOST, API_PORT, API_PREFIX } = process.env;
            // const resetPasswordURL = `${API_HOST}:${API_PORT}/${API_PREFIX}/auth/reset-password/${forgetPasswordToken}`;

            return { otp: passwordReset.resetOTP };

        } catch (error) {
            console.error('Error creating password reset request', error);
            throw AppError.internalServerError('Failed to create password reset request');
        }
    }


    public async resetPassword(_id: Types.ObjectId, password: string): Promise<{ success: boolean, message: string }> {
        try {

            const updatedUser = await UserModel.findByIdAndUpdate(
                _id,
                { password, passwordReset: null },
                { new: true }
            );

            if (!updatedUser) {
                throw AppError.notFound('User not found');
            }
            return { success: true, message: 'Password reset successfully' };

        } catch (error) {
            console.error('Error resetting password');
            console.error(error);
            throw AppError.internalServerError('Failed to reset password');
        }
    }


    private generateOTP(): number {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}