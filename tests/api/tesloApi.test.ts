import { sgcbApi } from '@/api/sgcbApi';
import MockAdapter from 'axios-mock-adapter';

const mockSgcbApi = new MockAdapter(sgcbApi);

mockSgcbApi.onGet('/test').reply(200, { data: 'test' });

describe('sgcbApi axios instance', () => {
  test('should have baseURL set to VITE_TESLO_API_URL', () => {
    expect(sgcbApi.defaults.baseURL).toEqual(import.meta.env.VITE_TESLO_API_URL);
  });

  test('should set Authorization header with token from localhost', async () => {
    const token = 'myAuthToken';
    localStorage.setItem('token', token);

    const resp = await sgcbApi.get('/test');

    expect(resp.config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  test('should not set Authorization header if token is not in LocalStorage', async () => {
    localStorage.clear();

    const resp = await sgcbApi.get('/test');

    expect(resp.config.headers.Authorization).toBeUndefined();
  });
});
