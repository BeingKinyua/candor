/**
 * @file client.ts
 * @description Future-ready API client abstraction for the Vantage Campaign Operations frontend.
 *
 * Provides a unified HTTP client interface configured to route through the upcoming
 * NestJS API layer (`/api/v1/*`), with automatic bearer token header attachment,
 * standardized error handling, and type-safe response parsing.
 *
 * Current state: Operates in mock-supported mode with zero external network leaks,
 * ready to switch over to full NestJS backend once deployed.
 */

export interface ApiClientConfig {
  baseUrl?: string;
  getAuthToken?: () => string | null;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ApiClient {
  private baseUrl: string;
  private getAuthToken?: () => string | null;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api/v1';
    this.getAuthToken = config.getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.getAuthToken ? this.getAuthToken() : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      return {
        data,
        status: response.status,
      };
    } catch (err) {
      // In development / prototype phase, fallback or rethrow cleanly
      console.warn(`[ApiClient] Request to ${url} failed:`, err);
      throw err;
    }
  }

  public get<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
