import * as Joi from 'joi';
import { Environments, EnvVars } from 'src/consts';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.DEVELOPMENT),
  PORT: Joi.number().default(3000),
});

const _getEnvValue = (env_name: string, isNumber = false) => {
  if (!(env_name && env_name in process.env))
    throw new Error(`${env_name} is't declared in environment`);
  env_name = process.env[env_name.toUpperCase()];
  return isNumber ? parseFloat(env_name) : env_name;
};

export const getEnvs = () => {
  return {
    [EnvVars.ENV_LAZY_LOAD]: {
      port: _getEnvValue(EnvVars.PORT, true),
      white_list: _getEnvValue(EnvVars.WHITE_LIST).toString().split(', '),
    },
  };
};
