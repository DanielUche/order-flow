import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddb, eb } from '@orderflow/aws-utils';
import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { v4 as uuid } from 'uuid';
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { Order } from '@orderflow/types';

const doc = DynamoDBDocumentClient.from(ddb);
const TABLE = process.env.TABLE_ORDERS!;
const BUS = process.env.EVENT_BUS!;

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const path = event.rawPath;
  if (event.requestContext.http.method === 'GET' && path === '/orders') {
    const res = await doc.send(
      new ScanCommand({ TableName: TABLE, Limit: 50 }),
    );
    return json(200, res.Items ?? []);
  }

  if (event.requestContext.http.method === 'POST' && path === '/orders') {
    const body = JSON.parse(event.body ?? '{}');
    const order: Order = {
      id: uuid(),
      customerName: String(body.customerName ?? 'Anonymous'),
      amount: Number(body.amount ?? 0),
      createdAt: new Date().toISOString(),
      status: 'CREATED',
    };
    await doc.send(new PutCommand({ TableName: TABLE, Item: order }));
    await eb.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: BUS,
            Source: 'orderflow.api',
            DetailType: 'OrderCreated',
            Detail: JSON.stringify(order),
          },
        ],
      }),
    );
    return json(200, order);
  }

  return json(404, { message: 'Not found' });
};

const json = (statusCode: number, data: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(data),
});
