const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://maptech-event-api.up.railway.app'
).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
