import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the project.',
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/api/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerUiSetup = (app: any) => {
    const { API_HOST, API_PORT, API_PREFIX } = process.env;
    app.use(`${API_PREFIX}/documentation`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`API documentation available at ${API_HOST}:${API_PORT}${API_PREFIX}/documentation`);
};