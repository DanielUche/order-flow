import type { EventBridgeEvent } from 'aws-lambda';
import { eb } from '@orderflow/aws-utils';
import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

export const handler = async (event: any) => {
  // Amazon MQ messages delivered here
  const order = JSON.parse(event.body ?? '{}');
  console.log('[MQ-Ingestor] Received MQ message', order);
  await eb.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: process.env.EVENT_BUS,
          Source: 'orderflow.mq',
          DetailType: 'OrderCreated',
          Detail: JSON.stringify(order),
        },
      ],
    }),
  );
};
