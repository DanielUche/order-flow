import { OrderSchema, OrdersListSchema } from '@orderflow/contracts';
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
  expect(OrdersListSchema.parse(JSON.parse((res as any).body))).toEqual([]);
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
  const order = OrderSchema.parse(JSON.parse((res as any).body));
  expect(order.customerName).toBe('Ada');
});
test('POST /orders returns 400 on invalid input', async () => {
  ddbMock.on(PutCommand).resolves({});
  ebMock.on(PutEventsCommand).resolves({});
  const res = await handler({
    rawPath: '/orders',
    requestContext: { http: { method: 'POST' } } as any,
    body: JSON.stringify({}), // Invalid input: missing required fields
  } as any);
  expect((res as any).statusCode).toBe(400);
});

test('POST /orders returns 400 on invalid input', async () => {
  ddbMock.on(PutCommand).resolves({});
  ebMock.on(PutEventsCommand).resolves({});
  const res = await handler({
    rawPath: '/orders',
    requestContext: { http: { method: 'POST' } } as any,
    body: JSON.stringify({}), // Invalid input: missing required fields
  } as any);
  expect((res as any).statusCode).toBe(400);
});

test('POST /orders returns required fields in response', async () => {
  const res = await handler({
    rawPath: '/orders',
    requestContext: { http: { method: 'POST' } } as any,
    body: JSON.stringify({ customerName: 'Ada', amount: 42 }),
  } as any);
  const order = JSON.parse((res as any).body);
  expect(order).toHaveProperty('id');
  expect(order).toHaveProperty('createdAt');
  expect(order).toHaveProperty('status');
});

