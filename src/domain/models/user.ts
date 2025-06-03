import bcrypt from "bcrypt";
import mongoose, { Document, Query, Schema } from "mongoose";
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
    verificationCode?: string;
    accountActivated: boolean;
    accountLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    passwordReset?: PasswordReset;
}

export interface PasswordReset {
    resetOTP: number;
    expires: Date;
}

const passwordResetSchema = new Schema<PasswordReset>({
    resetOTP: {
        type: Number,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
}, {
    _id: false,
    timestamps: true,
    versionKey: false,
});


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
        // select: false
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
    passwordReset: {
        type: passwordResetSchema,
        default: null,
    },
}, { timestamps: true });

userSchema.pre('save', async (next) => {
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

userSchema.pre(/^findOneAndUpdate/, async function (this: Query<any, UserDocument>, next) {

    const update = (this as any).getUpdate();
    if (update.password) {
        try {
            const hashedPassword = await bcrypt.hash(update.password, SALT_ROUNDS);
            update.password = hashedPassword;
            (this as any).setUpdate(update);
            next();
        } catch (error) {
            return next(error as Error);
        }
    }
});


export const UserModel = mongoose.model<UserDocument>('User', userSchema);
