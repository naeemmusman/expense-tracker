import express, { Router } from 'express';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { CorsMiddleware, ErrorMiddleware } from './core/middlewares';
import { CustomMiddleware } from './core/middlewares/custom.middleware';
import { swaggerUiSetup } from './swagger';
import { Database } from './config';

interface IServerOptions {
    port: number;
    routes: Router;
    apiPrefix: string;
    apiVersion: string;
    dbUri: string;
}

export class Server {
    public readonly app = express();
    private serverListener?: HttpServer<typeof IncomingMessage, typeof ServerResponse>;
    private readonly port: number;
    private readonly router: Router;
    private readonly apiPrefix: string;
    private readonly apiVersion: string;
    private dbUri: string;

    constructor(options: IServerOptions) {
        this.port = options.port;
        this.router = options.routes;
        this.apiPrefix = options.apiPrefix;
        this.apiVersion = options.apiVersion;
        this.dbUri = options.dbUri;
    }

    async start(): Promise<void> {
        // Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Custom Middlewares
        this.app.use(CustomMiddleware.logRequest);          //Logs Middlewares
        this.app.use(CorsMiddleware.enableCors);            // CORS Middleware
        this.app.use(this.apiPrefix, this.router);
        swaggerUiSetup(this.app);                           // Swagger Middleware
        this.app.use(ErrorMiddleware.handleError);           // Error Handling Middleware

        await Database.getInstance().connect(this.dbUri as string);
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
            console.log(`API is available at ${this.apiPrefix}/${this.apiVersion}`);
        });

        this.serverListener.on('error', (error) => {
            console.error('Error starting server:', error);
        });
    }

    async stop(): Promise<void> {
        if (this.serverListener) {
            this.serverListener.close(() => {
                console.log('Server stopped');
            });
        }
    }
};
