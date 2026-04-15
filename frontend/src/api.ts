const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

function inferFallbackBaseUrl(): string {
  if (!import.meta.env.PROD) {
    return '';
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'maptech-event.up.railway.app') {
    return 'https://maptech-event-api.up.railway.app';
  }

  return '';
}

const API_BASE_URL = (configuredBaseUrl || inferFallbackBaseUrl()).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
