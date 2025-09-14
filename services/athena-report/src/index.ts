import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from '@aws-sdk/client-athena';

const client = new AthenaClient({});
const DB = process.env.ATHENA_DB!;
const WG = process.env.ATHENA_WORKGROUP!;
const OUT = process.env.S3_OUTPUT!;

export const handler = async (
  _evt: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const query = `SELECT date(from_iso8601_timestamp(detail.createdAt)) as day, count(1) AS cnt
                    FROM ${DB}.orderflow_events
                    WHERE from_iso8601_timestamp(detail.createdAt) >= from_iso8601_timestamp('${since}')
                    GROUP BY 1 ORDER BY 1 DESC`; // table name depends on crawler; adjust to actual name

  const start = await client.send(
    new StartQueryExecutionCommand({
      QueryString: query,
      QueryExecutionContext: { Database: DB },
      WorkGroup: WG,
      ResultConfiguration: { OutputLocation: OUT },
    }),
  );

  const id = start.QueryExecutionId!;
  // Simple poll. For prod, add backoff/timeouts.
  while (true) {
    const { QueryExecution } = await client.send(
      new GetQueryExecutionCommand({ QueryExecutionId: id }),
    );
    const state = QueryExecution?.Status?.State;
    if (state === 'SUCCEEDED') break;
    if (state === 'FAILED' || state === 'CANCELLED')
      return json(500, { error: state });
    await new Promise((r) => setTimeout(r, 1000));
  }

  const res = await client.send(
    new GetQueryResultsCommand({ QueryExecutionId: id }),
  );
  // rows[0] is header; sum counts to a single KPI
  const rows = res.ResultSet?.Rows ?? [];
  let total = 0;
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i].Data?.[1]?.VarCharValue;
    if (c) total += parseInt(c, 10);
  }
  return json(200, { count: total });
};

const json = (statusCode: number, data: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(data),
});
