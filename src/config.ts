export const isProd = process.env.NODE_ENV === 'production';
export const apiBase =
  isProd || !process.env.VUE_APP_PROXY ? process.env.VUE_APP_API_BASE : '';
export const apiNamespace = process.env.VUE_APP_API_NAMESPACE;
export const baseUrl = apiBase + apiNamespace;
export const appVersion = process.env.VUE_APP_VERSION;
export const useCookies = process.env.VUE_APP_USE_COOKIES === 'true';
export const frontendBaseUrl = process.env.BASE_URL;
