import express, { NextFunction, Request, Response, Router } from 'express';
import { CustomMiddleware } from './core/middlewares/custom.middleware';
import { CorsMiddleware, ErrorMiddleware } from './core/middlewares';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { swaggerUiSetup } from './swagger';
import { AppError } from './core/errors/app.error';

interface IServerOptions {
    port: number;
    routes: Router;
    apiPrefix: string;
    apiVersion: string;
};

export class Server {
    public readonly app = express();
    private serverListener?: HttpServer<typeof IncomingMessage, typeof ServerResponse>;
    private readonly port: number;
    private readonly routes: Router;
    private readonly apiPrefix: string;
    private readonly apiVersion: string;

    constructor(options: IServerOptions) {
        this.port = options.port;
        this.routes = options.routes;
        this.apiPrefix = options.apiPrefix;
        this.apiVersion = options.apiVersion;
    }

    async start(): Promise<void> {
        // Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));


        // Custom Middlewares
        this.app.use(CustomMiddleware.logRequest);
        // CORS Middleware
        this.app.use(CorsMiddleware.enableCors);
        this.app.use(this.apiPrefix, this.routes);
        // Swagger Middleware
        swaggerUiSetup(this.app);
        // this.app.all('*', (req: Request, _: Response, next: NextFunction): void => {
        //     next(AppError.notFound(`Route ${req.path} not found`));
        // });

        // Error Handling Middleware
        this.app.use(ErrorMiddleware.handleError);

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
