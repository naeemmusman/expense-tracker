import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Address, AddressSchema } from "./address";

const SALT_ROUNDS = 10;

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: Address;
    password: string;
    verificationCode: string | null;
    accountActivated: boolean;
    accountLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: AddressSchema,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
        default: null,
    },
    accountActivated: {
        type: Boolean,
        default: false,
    },
    accountLocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this as any;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error as Error);
    }
});


export const UserModel = mongoose.model<UserDocument>('User', userSchema);
