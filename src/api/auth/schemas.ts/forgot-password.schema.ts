export const forgetPasswordSchema = {
    type: 'object',
    required: ['email'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com'
        }
    }
};


export const resetPasswordSchema = {
    type: 'object',
    required: ['password', 'confirmPassword', 'token'],
    properties: {
        password: {
            type: 'string',
            example: 'password123'
        },
        confirmPassword: {
            type: 'string',
            example: 'password123'
        },
        token: {
            type: 'string',
            example: 'eyJhbGciOi'
        }
    }
};