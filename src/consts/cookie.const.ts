export const COOKIE_ACCESS_TOKEN_KEY = `${process.env.APP_NAME}_AT`,
  COOKIE_REFRESH_TOKEN_KEY = `${process.env.APP_NAME}_RT`;

export const COOKIE_REDIRECT_KEY = `${process.env.APP_NAME}_data_redirect`,
  COOKIE_REDIRECT_EXPIRE_IN = `10m`;

export const COOKIE_DOMAIN_FE = process.env.FE_URL?.split('//')[1];
