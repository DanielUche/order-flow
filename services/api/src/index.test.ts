import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { handler } from './index';

const ddbMock = mockClient(DynamoDBDocumentClient as any);
const ebMock = mockClient(EventBridgeClient as any);

beforeEach(() => {
  ddbMock.reset();
  ebMock.reset();
});

test('GET /orders returns empty array', async () => {
  ddbMock.on(ScanCommand).resolves({ Items: [] });
  const res = await handler({
    rawPath: '/orders',
    requestContext: { http: { method: 'GET' } } as any,
  } as any);
  expect((res as any).statusCode).toBe(200);
  expect(JSON.parse((res as any).body)).toEqual([]);
});

test('POST /orders creates and emits event', async () => {
  ddbMock.on(PutCommand).resolves({});
  ebMock.on(PutEventsCommand).resolves({});
  const res = await handler({
    rawPath: '/orders',
    requestContext: { http: { method: 'POST' } } as any,
    body: JSON.stringify({ customerName: 'Ada', amount: 42 }),
  } as any);
  expect((res as any).statusCode).toBe(200);
  const order = JSON.parse((res as unknown as { body: string }).body);
  expect(order.customerName).toBe('Ada');
});
