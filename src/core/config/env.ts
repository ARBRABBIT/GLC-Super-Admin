
export const env = {
  AUTH_API_BASE_URL: import.meta.env.VITE_AUTH_API_BASE_URL as string,
  ROLE_MANAGER_API_BASE_URL: import.meta.env.VITE_ROLE_MANAGER_API_BASE_URL as string,
  SUPER_ADMIN_API_BASE_URL: import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL as string || "https://2k87b6hh9d.execute-api.ap-south-1.amazonaws.com",
  MAINTENANCE_API_BASE_URL: import.meta.env.VITE_MAINTENANCE_API_BASE_URL as string || "https://u8nxiqwl84.execute-api.ap-south-1.amazonaws.com",
  APP_NAME: import.meta.env.VITE_APP_NAME || 'GLC-UI',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || 'v1.0.0',

  ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS === 'true',
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true',

  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'accessToken',
  AUTH_REFRESH_KEY: import.meta.env.VITE_AUTH_REFRESH_KEY || 'refreshToken',

  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
console.log(import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL, "envi")
export type Env = typeof env;
