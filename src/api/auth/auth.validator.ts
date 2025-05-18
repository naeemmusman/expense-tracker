import Joi from "joi";

export interface SignInDTO {
    email: string;
    password: string;
}

export const signInSchema = Joi.object<SignInDTO>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
}).required().messages({
    'string.empty': 'Email and password are required',
    'any.required': 'Email and password are required',
    'string.email': 'Email must be a valid email address',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 20 characters long',
});

export interface AddressDTO {
    building: string;
    street: string;
    town: string;
    county?: string;
    postcode: string;
}

export const addressSchema = Joi.object<AddressDTO>({
    building: Joi.string().required(),
    street: Joi.string().required(),
    town: Joi.string().required(),
    county: Joi.string(),
    postcode: Joi.string().required(),
}).required()
    .messages({
        'string.empty': 'Building, street, town and postcode are required',
        'any.required': 'Building, street, town and postcode are required',
        'string.min': 'Building, street, town and postcode must be at least 1 character long',
        'string.max': 'Building, street, town and postcode must be at most 100 characters long',
    });

export interface SignUpDTO {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: AddressDTO;
    password: string;
    confirmPassword: string;
}

export const signUpSchema = Joi.object<SignUpDTO>({
    firstName: Joi.string().min(1).max(100).required(),
    lastName: Joi.string().min(1).max(100).required(),
    dateOfBirth: Joi.date().iso().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    address: addressSchema,
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),
}).required();

