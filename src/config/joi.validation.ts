
import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
PORT:Joi.number().default(3000),
ENVIRONMENT:Joi.string().default('dev'),
DB_HOST:Joi.string().required(),
DB_PORT:Joi.number().required(),
DB_NAME:Joi.string().required(),
DB_PASSWORD:Joi.string().required(),
DB_USERNAME:Joi.string().required(),
JWT_SECRET:Joi.string().required(),
JWT_EXPIRES_IN:Joi.string().required(),
SMTP_HOST:Joi.string().required(),
SMTP_PORT:Joi.number().required(),
SMTP_USER:Joi.string().required(),
SMTP_PASS:Joi.string().required(),
});