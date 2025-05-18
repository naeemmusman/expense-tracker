export const signupSchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'phone', 'password'],
    properties: {
        firstName: {
            type: 'string',
            example: 'John'
        },
        lastName: {
            type: 'string',
            example: 'Doe'
        },
        dateOfBirth: {
            type: 'string',
            format: 'date',
            example: '1990-01-01'
        },
        email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com'
        },
        phone: {
            type: 'string',
            example: '+1234567890'
        },
        address: {
            type: 'object',
            properties: {
                building: {
                    type: 'string',
                    example: '123'
                },
                street: {
                    type: 'string',
                    example: 'Main St'
                },
                town: {
                    type: 'string',
                    example: 'Springfield'
                },
                county: {
                    type: 'string',
                    example: 'IL'
                },
                postcode: {
                    type: 'string',
                    example: '62704'
                }
            }
        },
        password: {
            type: 'string',
            example: 'password123'
        }
    }
};
