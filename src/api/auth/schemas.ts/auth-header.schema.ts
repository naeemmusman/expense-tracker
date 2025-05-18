import Joi from "joi";

export const authHeaderSchema = Joi.object({
    authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Authorization header must be a valid Bearer token',
            'any.required': 'Authorization header is required',
        }),
});