const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_ENDPOINTS = {
  register: `${backendUrl}/v1/auth/register`,
  login: `${backendUrl}/v1/auth/login`,
  logout: `${backendUrl}/v1/auth/logout`,
  queryData: `${backendUrl}/v1/data/query`,
  welcomeInfo: `${backendUrl}/v1/data`,
  chartData: `${backendUrl}/v1/charts`
};