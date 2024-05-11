import * as Joi from 'joi';
import { Environments } from 'src/consts';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.DEVELOPMENT),
  PORT: Joi.number().default(3000),
});
