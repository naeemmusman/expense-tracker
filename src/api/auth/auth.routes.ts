// routhes
import { Router } from 'express';
import { ValidateMiddleware } from '../../core/middlewares/validate.middleware';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { SignInDTO, signInSchema, SignUpDTO, signUpSchema } from './auth.validator';
import { authHeaderSchema } from './schemas.ts/auth-header.schema';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const authController = new AuthController();

        /**
         * @swagger
         * /api/auth/signin:
         *  post:
         *   tags:
         *    - Authenication
         *   summary: User Sign in
         *   description: User Sign in
         *   requestBody:
         *    required: true
         *    content:
         *     application/json:
         *      schema:
         *       $ref: '#/components/schemas/UserSignIn'
         *   responses:
         *    200:
         *     description: User signed in successfully!
         *     schema:
         *      $ref: '#/components/schemas/UserSignInResponse'
         *    400:
         *     description: Validation error !
         *     schema:
         *      $ref: '#/components/schemas/ValidationError'
         */
        router.post(
            '/signin',
            ValidateMiddleware.validate<SignInDTO>(signInSchema),
            AuthMiddleware.validateSignIn,
            authController.signin
        );

        /**
         * @swagger
         * /api/auth/signup:
         *  post:
         *   tags:
         *    - Authenication
         *   summary: User Sign up
         *   description: User Sign up
         *   requestBody:
         *    required: true
         *    content:
         *     application/json:
         *      schema:
         *       $ref: '#/components/schemas/UserSignUp'
         *   responses:
         *    200:
         *     description: User signUp successful !
         *    400:
         *     description: Validation error
         *     schema:
         *      $ref: '#/components/schemas/ValidationError'
         * 
         */
        router.post(
            '/signup',
            ValidateMiddleware.validate<SignUpDTO>(signUpSchema),
            AuthMiddleware.userExists,
            authController.signup);


        /**
        * @swagger
        * /api/auth/profile:
        *  get:
        *   tags:
        *    - Authenication
        *   summary: Get signed-in user profile
        *   description: Get signed-in user profile
        *   requestBody:
        *    required: true
        *    content:
        *     application/json:
        *      schema:
        *       $ref: '#/components/schemas/UserSignUp'
        *   responses:
        *    200:
        *     description: User loaded successful !
        *    400:
        *     description: Validation error
        *     schema:
        *      $ref: '#/components/schemas/ValidationError'
        * 
        */
        router.get(
            '/profile',
            ValidateMiddleware.validateAuthHeader,
            AuthMiddleware.authenticateJwt,
            authController.getProfile);

        return router;
    }
}