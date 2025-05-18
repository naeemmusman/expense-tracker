import { NextFunction, Request, Response } from "express";

export class CorsMiddleware {
    public static enableCors = (req: Request, res: Response, next: NextFunction): void => {
        const allowedOrigins = ['http://localhost:3000', 'http://example.com', 'http://abc.com'];
        console.log(`Request Origin: ${req.headers.origin}`);
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin as string)) {
            res.setHeader('Access-Control-Allow-Origin', origin!);
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }
};