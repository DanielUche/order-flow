// Log helper
export function log(...args: unknown[]) {
  console.log('[orderflow]', ...args);
}

export type Correlation = { reqId?: string; traceId?: string; source?: string };

export const getCorrelation = (evt: any): Correlation => {
  // works for API GW v2, SQS, SNS, generic
  const reqId = evt?.requestContext?.requestId || evt?.Records?.[0]?.messageId;
  return { reqId, source: evt?.requestContext?.domainName ? 'http' : 'async' };
};

export const slog = (fields: Record<string, unknown>, msg?: string) => {
  const entry = { ts: new Date().toISOString(), lvl: 'info', ...fields };
  console.log(JSON.stringify(msg ? { ...entry, msg } : entry));
};

// Cold start wrapper
let isColdStart = true;
export function withColdStart<T extends (...args: unknown[]) => Promise<any>>(
  handler: T,
): T {
  return (async (...args: Parameters<T>) => {
    if (isColdStart) {
      log('COLD_START');
      isColdStart = false;
    }
    return handler(...args);
  }) as T;
}
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

export const ddb = new DynamoDBClient({});
export const eb = new EventBridgeClient({});

export const env = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback;
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};

export const __resetColdForTests = () => {
  isColdStart = true;
};
