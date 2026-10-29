import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { env } from '../config/env';
import { logOut, updateTokens } from '../../features/auth/store/authSlice';
import type { LoginResponse } from '../../features/auth/types';

interface AuthState {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const mutex = new Mutex();

export const createStandardBaseQuery = (baseUrl: string) => fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const createBaseQueryWithReauth = (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = createStandardBaseQuery(baseUrl);

  return async (args, api, extraOptions) => {
    // ── Mock session guard ────────────────────────────────────────────────
    // If the token starts with "mock-token-", this is a dev mock user.
    // Skip the real API entirely and return an empty successful response
    // so charts/queries render "No data" instead of spamming 401s.
    const token = (api.getState() as AuthState).auth.accessToken;
    if (token?.startsWith('mock-token-')) {
      return { data: { data: [], success: true, message: 'mock session' } };
    }
    // ─────────────────────────────────────────────────────────────────────

    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshToken = (api.getState() as AuthState).auth.refreshToken;

          if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
            const authBaseQuery = createStandardBaseQuery(env.AUTH_API_BASE_URL);
            const refreshResult = await authBaseQuery(
              {
                url: '/auth/refreshToken',
                method: 'POST',
                body: { token: refreshToken },
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              const data = refreshResult.data as LoginResponse;
              api.dispatch(
                updateTokens({
                  accessToken: data.token,
                  refreshToken: data.refreshToken,
                })
              );
              result = await baseQuery(args, api, extraOptions);
            } else {
              api.dispatch(logOut());
            }
          } else {
            api.dispatch(logOut());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  };
};

export const baseQueryWithReauth = createBaseQueryWithReauth(env.AUTH_API_BASE_URL);