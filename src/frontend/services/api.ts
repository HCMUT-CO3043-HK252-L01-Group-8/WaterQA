const DEFAULT_BASE_URL = process.env.BASE_URL?.trim() || 'http://localhost:3000';

export const BASE_URL =
  String((globalThis as any)?.process?.env?.EXPO_PUBLIC_API_BASE_URL || '').trim() ||
  DEFAULT_BASE_URL;

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
  const [temp, humi, leakage] = await Promise.all([
    getLatestValue('temp', options),
    getLatestValue('humi', options),
    getLatestValue('leakage-signal', options),
  ]);

  return {
    temp,
    humi,
    leakage,
    fetchedAt: new Date().toISOString(),
  };
}
