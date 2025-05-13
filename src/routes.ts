import { NextFunction, Request, Response, Router } from "express";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.get("/", (_, res) => {
            res.status(200).json({ message: "Welcome to the API!" });
        });
        return router;
    }
}