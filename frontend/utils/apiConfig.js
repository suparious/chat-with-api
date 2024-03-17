const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_ENDPOINTS = {
  register: `${backendUrl}/api/auth/register`,
  login: `${backendUrl}/api/auth/login`,
  logout: `${backendUrl}/api/auth/logout`,
  queryData: `${backendUrl}/api/data/query`,
  welcomeInfo: `${backendUrl}/api/welcome-info`,
  chartData: `${backendUrl}/api/chart-data`
};