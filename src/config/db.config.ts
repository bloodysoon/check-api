import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('db', () => ({
  url: process.env.DATABASE_URL || '',
}));

export const dbSchema = {
  DATABASE_URL: Joi.string().min(1).required(),
};