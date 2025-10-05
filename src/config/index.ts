import * as Joi from 'joi';
import dbConfig, { dbSchema } from './db.config';

export const configArray = [dbConfig];

export const environmentSchema = Joi.object({
  ...dbSchema,
});
