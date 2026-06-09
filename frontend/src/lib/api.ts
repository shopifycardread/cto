/* ── API Client for Clad Backend ──────────────────────────── */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("clad_token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(
      errorBody || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json();
}

/* ── Auth API ─────────────────────────────────────────────── */

export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    request<{ id: string; email: string; full_name?: string }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  login: (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    return request<{ access_token: string; token_type: string }>(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );
  },
};

/* ── Wardrobe API ─────────────────────────────────────────── */

export const wardrobeApi = {
  list: () =>
    request<{ message?: string; items?: unknown[] }>("/api/wardrobe/"),

  create: (data: FormData) =>
    request<{ message?: string; item?: unknown }>("/api/wardrobe/", {
      method: "POST",
      body: data,
    }),

  delete: (id: string) =>
    request<void>(`/api/wardrobe/${id}`, { method: "DELETE" }),
};

/* ── Outfits API ──────────────────────────────────────────── */

export const outfitsApi = {
  getDaily: () =>
    request<{ message?: string; outfits?: unknown[] }>(
      "/api/outfits/daily"
    ),

  save: (id: string) =>
    request<{ message?: string }>(`/api/outfits/${id}/save`, {
      method: "POST",
    }),

  skip: (id: string) =>
    request<{ message?: string }>(`/api/outfits/${id}/skip`, {
      method: "POST",
    }),
};

/* ── Profile API ──────────────────────────────────────────── */

export const profileApi = {
  get: () => request<{ message?: string; profile?: unknown }>("/api/profile/"),

  update: (data: Record<string, unknown>) =>
    request<{ message?: string; profile?: unknown }>("/api/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/* ── Shop / Recommendations API ──────────────────────────── */

export const shopApi = {
  getRecommendations: () =>
    request<{ message?: string; recommendations?: unknown[] }>(
      "/api/shop/recommendations"
    ),

  trackClick: (id: string) =>
    request<{ message?: string }>(`/api/shop/recommendations/${id}/click`, {
      method: "POST",
    }),
};

/* ── Weather API ──────────────────────────────────────────── */

export const weatherApi = {
  getCurrent: (location?: string) => {
    const params = location ? `?location=${encodeURIComponent(location)}` : "";
    return request<{ temperature?: number; condition?: string; location?: string }>(
      `/api/weather/current${params}`
    );
  },
};

/* ── Auth Token Helpers ───────────────────────────────────── */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("clad_token");
}

export function setToken(token: string): void {
  localStorage.setItem("clad_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("clad_token");
  localStorage.removeItem("clad_user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUser(): { email: string; full_name?: string } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("clad_user");
  return stored ? JSON.parse(stored) : null;
}

export function setUser(user: { email: string; full_name?: string }): void {
  localStorage.setItem("clad_user", JSON.stringify(user));
}