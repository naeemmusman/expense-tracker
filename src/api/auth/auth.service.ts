import Jwt from "jsonwebtoken";
import { UserDocument, UserModel } from "../../domain/models/user";
import { generateToken, JWTPayload } from "../../utils/jwt.utils";
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
}