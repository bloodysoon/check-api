import * as Joi from 'joi';

export const configArray = [];

export const environmentSchema = Joi.object({
  SUPABASE_URL: Joi.string().min(1).required(),
  SUPABASE_ANON_KEY: Joi.string().min(1).required(),
});
