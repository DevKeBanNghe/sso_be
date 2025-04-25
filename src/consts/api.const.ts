export const PATHS_SIGN = ['/auth/sign-in', '/auth/sign-up'];

export const PATHS_NOT_AUTH = [
  ...PATHS_SIGN,
  '/auth/logout',
  '/auth/refresh-token',
  '/auth/google',
  '/auth/google-redirect',
  '/auth/github',
  '/auth/github-redirect',
  '/auth/facebook',
  '/auth/facebook-redirect',
  '/auth/cookie-keys',
];
