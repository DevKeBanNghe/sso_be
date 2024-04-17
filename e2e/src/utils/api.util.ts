import axios from 'axios';

const {
  get: getApi,
  patch: patchApi,
  post: postApi,
  put: putApi,
  delete: deleteApi,
} = axios;

export { getApi, patchApi, postApi, putApi, deleteApi };
