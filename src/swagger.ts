import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { forgetPasswordSchema, resetPasswordSchema } from './api/auth/schemas.ts/forgot-password.schema';
import { signInResponseSchema, signInSchema } from './api/auth/schemas.ts/signin.schema';
import { signUpResponseSchema, signupSchema } from './api/auth/schemas.ts/signup.schema';
import { profileSchema } from './api/auth/schemas.ts/profile.schema';

const validationErrorSchema = {
    type: 'object',
    properties: {
        statusCode: {
            type: 'integer',
            example: 400,
        },
        message: {
            type: 'string',
            example: 'Validation error',
        },
        error: {
            type: 'string',
            example: 'Bad Request',
        },
        validationErrors: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    field: {
                        type: 'string',
                        example: 'email',
                    },
                    message: {
                        type: 'string',
                        example: 'Email is required',
                    },
                },
            },
        },
    },
};

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the project.',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT token e.g. Bearer <JWT_TOKEN>'
            },
        },
        schemas: {
            ValidationError: validationErrorSchema,
            UserSignInRequest: signInSchema,
            UserSignInResponse: signInResponseSchema,
            UserSignUpRequest: signupSchema,
            UserSignUpResponse: signUpResponseSchema,
            UserProfileResponse:profileSchema,
            ForgetPassword: forgetPasswordSchema,
            ResetPassword: resetPasswordSchema,
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/api/**/*.routes.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerUiSetup = (app: any) => {
    const { API_HOST, API_PORT, API_PREFIX } = process.env;
    app.use(`${API_PREFIX}/documentation`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`API documentation available at ${API_HOST}:${API_PORT}${API_PREFIX}/documentation`);
};