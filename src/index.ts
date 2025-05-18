import dotenv from 'dotenv';
import { AppRoutes } from './routes';
import { Server } from './server';

(() => {
    dotenv.config();
    main();
})();

function main(): void {
    const { API_PORT = 3000, API_PREFIX, API_VERSION, DB_URI } = process.env;
    const server = new Server({
        port: Number(API_PORT),
        routes: AppRoutes.routes,
        apiPrefix: API_PREFIX || '/api',
        apiVersion: API_VERSION || 'v1',
        dbUri: DB_URI || 'mongodb://localhost:27017/mydb',
    });

    void server.start();
};