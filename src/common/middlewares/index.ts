import compression from 'compression';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import { MiddlewareConsumer } from '@nestjs/common';
import { helmetMiddleware } from 'src/confs/middlewares.confs';

export const applyOtherMiddlewares = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(helmetMiddleware, compression(), cookieParser(), useragent.express())
    .forRoutes('*');
};
