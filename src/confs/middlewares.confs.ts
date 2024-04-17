import helmet from 'helmet';
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'https://fonts.googleapis.com/css',
        'https://cdn.jsdelivr.net',
      ],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
    },
  },
});
