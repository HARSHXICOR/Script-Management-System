const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:8080/api");

const TOKEN_KEY = "rsm_jwt_token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    message: string,
    public path?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorCode = "SERVER_ERROR";
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      errorCode = body.error ?? errorCode;
      message = body.message ?? message;
    } catch {
      /* ignore parse errors */
    }

    if (res.status === 401) {
      setStoredToken(null);
      // Optional: trigger custom event so auth state syncs
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw new ApiError(res.status, errorCode, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getStoredToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function resolveUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const base = API_BASE.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullPath = `${base}${cleanPath}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
  const url = new URL(fullPath, origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = resolveUrl(path, params);
  const res = await fetch(url, {
    headers: buildHeaders(),
  });
  return handleResponse<T>(res);
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const url = resolveUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const url = resolveUrl(path);
  const res = await fetch(url, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function del(path: string): Promise<void> {
  const url = resolveUrl(path);
  const res = await fetch(url, {
    method: "DELETE",
    headers: buildHeaders(),
  });
  return handleResponse<void>(res);
}
