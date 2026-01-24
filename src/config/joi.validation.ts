
import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
PORT:Joi.number().default(3000),
DB_HOST:Joi.string().required(),
DB_PORT:Joi.number().required(),
DB_NAME:Joi.string().required(),
DB_PASSWORD:Joi.string().required(),
DB_USERNAME:Joi.string().required()
});