const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_ENDPOINTS = {
  login: `${backendUrl}/api/auth/login`,
  register: `${backendUrl}/api/auth/register`,
  logout: `${backendUrl}/api/auth/logout`,
  queryData: `${backendUrl}/api/data/query`,
  welcomeInfo: `${backendUrl}/api/welcome-info`,
  chartData: `${backendUrl}/api/chart-data`
};