import compression from 'compression';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import { MiddlewareConsumer } from '@nestjs/common';
import { helmetMiddleware } from 'src/confs/middlewares.confs';
import { DecodedTokenMiddleware } from './decoded-token.middleware';
import { DefaultParamsMiddleware } from './default-params.middleware';

export const applyMiddlewares = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(
      helmetMiddleware,
      compression(),
      cookieParser(),
      useragent.express(),
      DefaultParamsMiddleware,
      DecodedTokenMiddleware
    )
    .forRoutes('*');
};
