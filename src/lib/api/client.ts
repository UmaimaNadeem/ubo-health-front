const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const ACCESS_TOKEN_KEY = "np_access_token";
const REFRESH_TOKEN_KEY = "np_refresh_token";
const GUEST_TOKEN_KEY = "np_guest_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getGuestToken() {
  return localStorage.getItem(GUEST_TOKEN_KEY);
}

export function setGuestToken(token: string) {
  localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function clearGuestToken() {
  localStorage.removeItem(GUEST_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach bearer/guest identity headers (default true)
};

async function rawRequest(path: string, opts: RequestOptions): Promise<Response> {
  const isFormData = opts.body instanceof FormData;
  const headers: Record<string, string> = {};
  if (opts.body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  if (opts.auth !== false) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      const guestToken = getGuestToken();
      if (guestToken) headers["X-Guest-Token"] = guestToken;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: isFormData ? (opts.body as FormData) : opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const newGuestToken = response.headers.get("X-Guest-Token");
  if (newGuestToken) setGuestToken(newGuestToken);

  return response;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const response = await rawRequest("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    auth: false,
  });
  if (!response.ok) {
    clearTokens();
    return false;
  }
  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return true;
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  let response = await rawRequest(path, opts);

  if (response.status === 401 && opts.auth !== false && getAccessToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) response = await rawRequest(path, opts);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let details: unknown;
    try {
      const data = await response.json();
      message = data.error ?? message;
      details = data;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body }),
  postForm: <T>(path: string, body: FormData) => apiRequest<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
