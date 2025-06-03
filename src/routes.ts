import { Router } from "express";
import { AuthRoutes } from "./api/auth/auth.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.get("/", (_, res) => {
            res.status(200).json({ message: "Welcome to the API!" });
        });
        router.use("/auth", AuthRoutes.router);

        return router;
    }
}