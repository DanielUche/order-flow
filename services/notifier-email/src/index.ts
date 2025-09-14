import type { SNSEvent } from 'aws-lambda';

export const handler = async (event: SNSEvent) => {
  for (const rec of event.Records) {
    console.log('Notify:', rec.Sns.Subject, rec.Sns.Message);
  }
};
