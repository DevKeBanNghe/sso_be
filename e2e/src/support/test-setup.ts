/* eslint-disable */

import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  const server_prefix = process.env.SERVER_PREFIX ?? '/';
  axios.defaults.baseURL = `http://${host}:${port}${server_prefix}`;
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((req) => {
    return req;
  });

  axios.interceptors.response.use(
    ({ data: data_res, status }) => {
      return { ...data_res, status };
    },
    ({ response: { data, status } }) => {
      return { ...data, status };
    }
  );
};
