import type { SQSHandler, SQSRecord } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const BUCKET = process.env.LAKE_BUCKET!;
const PREFIX = process.env.LAKE_PREFIX ?? 'events/';

export const handler: SQSHandler = async (event) => {
  const lines: string[] = [];
  for (const r of event.Records) {
    const body = parseRecord(r);
    if (!body) continue;
    // EventBridge → SQS envelope has message body as the full event
    lines.push(JSON.stringify(body));
  }
  if (!lines.length) return;

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const key = `${PREFIX}year=${y}/month=${m}/day=${d}/${now.getTime()}.jsonl`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: lines.join('\n'),
      ContentType: 'application/x-ndjson',
    }),
  );
};

function parseRecord(r: SQSRecord) {
  try {
    return JSON.parse(r.body);
  } catch {
    return null;
  }
}
