export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const API_ROUTES = {
  REGISTER: `${API_BASE}/auth/register`,
  LOGIN: `${API_BASE}/auth/login`,
  LOGOUT: `${API_BASE}/auth/logout`,
  ME: `${API_BASE}/auth/me`,

  TASKS: `${API_BASE}/tasks`,
  TASK_BY_ID: (id) => `${API_BASE}/tasks/${id}`,
};
