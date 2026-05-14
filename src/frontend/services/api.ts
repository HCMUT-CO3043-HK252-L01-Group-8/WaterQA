import Constants from 'expo-constants';
import { ADAFRUIT_FEEDS } from '../config/feeds';

const API_PORT = '3000';
const LOCAL_BASE_URL = `http://localhost:${API_PORT}`;

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

function getExpoDevServerBaseUrl(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (typeof hostUri !== 'string' || hostUri.length === 0) {
    return null;
  }

  const host = hostUri.split(':')[0];
  return host ? `http://${host}:${API_PORT}` : null;
}

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const BASE_URL = normalizeBaseUrl(
  configuredBaseUrl || getExpoDevServerBaseUrl() || LOCAL_BASE_URL,
);

type ApiSuccess<TPayload> = {
  success: true;
  payload: TPayload;
  timestamp?: string;
};

type ApiFailure = {
  success: false;
  error?: string;
  timestamp?: string;
};

type ApiResponse<TPayload> = ApiSuccess<TPayload> | ApiFailure;

export type TelemetryPayload = {
  data: unknown[];
  count: number;
};

export type TelemetryEnvelope = ApiResponse<TelemetryPayload>;

export type LatestTelemetryValue = {
  feedKey: string;
  value: string | null;
  createdAt?: string;
  raw?: unknown;
};

export type TelemetrySnapshot = {
  temp: LatestTelemetryValue;
  humi: LatestTelemetryValue;
  leakage: LatestTelemetryValue;
  fetchedAt: string;
};

class ApiError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function getJson<T>(
  url: string,
  options?: RequestInit,
): Promise<{ status: number; body: T }> {
  const res = await fetch(url, options);
  let body: T;
  try {
    body = (await res.json()) as T;
  } catch {
    throw new ApiError('Invalid JSON response from server', res.status);
  }

  if (!res.ok) {
    const msg =
      (body as any)?.error ||
      `HTTP Error: ${res.status} while calling ${new URL(url).pathname}`;
    throw new ApiError(String(msg), res.status);
  }

  return { status: res.status, body };
}

function ensureTelemetryPayload(env: TelemetryEnvelope): TelemetryPayload {
  if (!env || (env as any).success !== true) {
    const msg = (env as any)?.error || 'Request failed';
    throw new ApiError(String(msg));
  }
  const payload = (env as any).payload;
  const data = payload?.data;
  const count = payload?.count;
  if (!Array.isArray(data) || typeof count !== 'number') {
    throw new ApiError('Unexpected telemetry response shape');
  }
  return { data, count };
}

function extractLatestValue(feedKey: string, items: unknown[]): LatestTelemetryValue {
  const first = items[0] as any | undefined;
  const value =
    first && typeof first === 'object' && first !== null && 'value' in first
      ? String(first.value)
      : null;
  const createdAt =
    first && typeof first === 'object' && first !== null && 'created_at' in first
      ? String(first.created_at)
      : undefined;
  return { feedKey, value, createdAt, raw: first };
}

export async function getTelemetry(
  feedKey: string,
  rowLimit: number = 1,
  options?: { signal?: AbortSignal },
): Promise<{ payload: TelemetryPayload; timestamp?: string }> {
  const url = `${BASE_URL}/data/telemetry?feedKey=${encodeURIComponent(
    feedKey,
  )}&rowLimit=${encodeURIComponent(String(rowLimit))}`;

  const { body } = await getJson<TelemetryEnvelope>(url, {
    method: 'GET',
    signal: options?.signal,
  });

  const payload = ensureTelemetryPayload(body);
  return { payload, timestamp: (body as any).timestamp };
}

export async function getLatestValue(
  feedKey: string,
  options?: { signal?: AbortSignal },
): Promise<LatestTelemetryValue> {
  const { payload } = await getTelemetry(feedKey, 1, options);
  return extractLatestValue(feedKey, payload.data);
}

export async function getLatestTelemetrySnapshot(options?: {
  signal?: AbortSignal;
}): Promise<TelemetrySnapshot> {
  const [temp, humi, light] = await Promise.all([
    getLatestValue(ADAFRUIT_FEEDS.TEMP_FEED, options),
    getLatestValue(ADAFRUIT_FEEDS.HUMIDITY_FEED, options),
    getLatestValue(ADAFRUIT_FEEDS.LIGHT_FEED, options),
  ]);

  return {
    temp,
    humi,
    leakage: light, // Use 'leakage' field for light data (for backward compatibility)
    fetchedAt: new Date().toISOString(),
  };
}

// Authentication functions
export async function logout(options?: { signal?: AbortSignal }): Promise<void> {
  const url = `${BASE_URL}/auth/logout`;
  await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
    signal: options?.signal,
  });
}

// Email/Password login
export async function login(email: string, password: string, options?: { signal?: AbortSignal }): Promise<{ success: boolean; user?: any; error?: string }> {
  const url = `${BASE_URL}/auth/login`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }), // đổi từ { id: email } sang đúng chuẩn
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Đăng ký tài khoản mới
export async function signup(
  name: string,
  email: string,
  phone_number: string,
  password: string,
  options?: { signal?: AbortSignal }
): Promise<{ success: boolean; user?: any; error?: string }> {
  const url = `${BASE_URL}/accounts/signup`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, phone_number, password }),
      signal: options?.signal,
    });
    const body = await res.json();
    
    // Nếu response không thành công, đảm bảo trả về success: false
    if (!res.ok && !body.success) {
      return {
        success: false,
        error: body.error || `Registration failed with status ${res.status}`
      };
    }
    
    return body;
  } catch (error) {
    console.error('Signup request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Google OAuth login
export async function loginWithGoogle(name: string, email: string, picture: string, options?: { signal?: AbortSignal }): Promise<{ success: boolean; user?: any; error?: string }> {
  const url = `${BASE_URL}/auth/google`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, picture }),
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Gửi mã OTP về email để đặt lại mật khẩu
export async function forgotPassword(email: string, options?: { signal?: AbortSignal }): Promise<{ success: boolean; message?: string; error?: string }> {
  const url = `${BASE_URL}/auth/forgot-password`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email }),
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Xác thực OTP (bước trung gian)
export async function verifyOTP(email: string, otp: string, options?: { signal?: AbortSignal }): Promise<{ success: boolean; message?: string; error?: string }> {
  const url = `${BASE_URL}/auth/verify-otp`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Xác thực OTP và đặt mật khẩu mới
export async function resetPassword(email: string, otp: string, new_password: string, options?: { signal?: AbortSignal }): Promise<{ success: boolean; message?: string; error?: string }> {
  const url = `${BASE_URL}/auth/reset-password`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, otp, new_password }),
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Lấy thông tin tài khoản hiện tại
export async function getMe(options?: { signal?: AbortSignal }): Promise<{ success: boolean; payload?: { user_id: number; name: string; email: string; phone_number: string; email_notifications: number }; error?: string }> {
  const url = `${BASE_URL}/accounts/me`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}

// Cập nhật trạng thái nhận thông báo email
export async function updateEmailNotifications(enabled: boolean, options?: { signal?: AbortSignal }): Promise<{ success: boolean; message?: string; error?: string }> {
  const url = `${BASE_URL}/accounts/me/email-notifications`;
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email_notifications: enabled }),
    signal: options?.signal,
  });
  const body = await res.json();
  return body;
}
