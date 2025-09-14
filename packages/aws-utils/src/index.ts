import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

export const ddb = new DynamoDBClient({});
export const eb = new EventBridgeClient({});

export const env = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback;
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};
