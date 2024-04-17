import axios, { HttpStatusCode } from 'axios';
import { deleteApi, postApi } from '../utils/api.util';

describe('Sign in user', () => {
  const user_testing = {
    user_name: 'test',
    password: '123456',
    email: 'test@example.com',
  };

  describe('when not have account', () => {
    describe('sign up user', () => {
      it('when account not exists', async () => {
        const {
          data: { access_token, refresh_token, ...dataSingUp },
          status,
        } = await postApi('/auth/sign-up', user_testing);
        expect(status).toBe(HttpStatusCode.Created);
        expect(dataSingUp).toEqual({
          user_name: user_testing.user_name,
          user_email: user_testing.email,
        });

        axios.defaults.headers['Authorization'] = `Bearer ${access_token}`;
      });

      it('when account exists', async () => {
        const { data, status } = await postApi('/auth/sign-up', user_testing);
        expect(status).toBe(HttpStatusCode.BadRequest);
        expect(data).toBeNull();
      });
    });
  });

  describe('when have account', () => {
    it('when user_name and password are correct', async () => {
      const {
        data: { access_token, refresh_token, ...data_auth },
        status,
      } = await postApi('/auth/sign-in', {
        user_name: user_testing.user_name,
        password: user_testing.password,
      });
      expect(status).toBe(HttpStatusCode.Ok);
      expect(data_auth).toEqual({
        user_name: user_testing.user_name,
        user_email: user_testing.email,
      });
    });

    it('when user_name and password are not correct', async () => {
      const { data, status } = await postApi('/auth/sign-in', {
        user_name: 'account not exists',
        password: 'account not exists',
      });
      expect(status).toBe(HttpStatusCode.Unauthorized);
      expect(data).toBeNull();
    });
  });

  describe('clear data testing', () => {
    it('delete user testing', async () => {
      const { data, status } = await deleteApi(
        `/users?user_email=${user_testing.email}`
      );
      expect(status).toBe(HttpStatusCode.Ok);
    });
  });
});
