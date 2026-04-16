const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

function inferFallbackBaseUrl(): string {
  if (!import.meta.env.PROD) {
    return '';
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Railway convention fallback: "<service>.up.railway.app" -> "<service>-api.up.railway.app"
    if (hostname.endsWith('.up.railway.app') && !hostname.includes('-api.')) {
      const serviceName = hostname.slice(0, -'.up.railway.app'.length);
      return `https://${serviceName}-api.up.railway.app`;
    }
  }

  return '';
}

const API_BASE_URL = (configuredBaseUrl || inferFallbackBaseUrl()).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
