import Jwt from "jsonwebtoken";
import { Address } from "../domain/models/address";

export interface JWTPayload {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: Address;
}

export function expiresInToSeconds(expiresIn: string | number): number {
    if (typeof expiresIn === 'number') {
        return expiresIn; // Already in seconds
    }

    const regex = /^(\d+)([smhdwy])$/i;
    const match = expiresIn.match(regex);

    if (!match) {
        throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    const unitToSeconds: Record<string, number> = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
        w: 604800,
        y: 31536000,
    };

    return value * unitToSeconds[unit];
}

export function generateToken(payload: JWTPayload): string {
    const { JWT_SECRET, JWT_EXPIRATION = '8h' } = process.env;
    return Jwt.sign(
        payload,
        JWT_SECRET as string,
        {
            expiresIn: expiresInToSeconds(JWT_EXPIRATION as string),
        });
}