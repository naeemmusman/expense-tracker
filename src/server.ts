import express, { Request, Response, Router } from 'express';
import { CustomMiddleware } from './core/middlewares/custom.middleware';
import { CorsMiddleware, ErrorMiddleware } from './core/middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  throw new Error('Error');
  res.send('Hello With Typescript, Express, Nodejs !');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

interface IServerOptions {
    port: number;
    routes: Router;
    apiPrefix: string;
    apiVersion: string;
};

export class Server {
    public readonly app = express();
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
        



        // Error Handling Middleware
        this.app.use(ErrorMiddleware.handleError);

    }
};
