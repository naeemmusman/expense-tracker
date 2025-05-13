import dotenv from 'dotenv';
import { Router } from 'express';
import { Server } from './server';
import { AppRoutes } from './routes';

(() => {
    dotenv.config();
    main();
})();

function main(): void {
    const { API_PORT = 3000, API_PREFIX, API_NAME } = process.env;
    const server = new Server({
        port: Number(API_PORT),
        routes: AppRoutes.routes,
        apiPrefix: API_PREFIX || '/api',
        apiVersion: API_NAME || 'v1',
    });

    void server.start();
};