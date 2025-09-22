# OrderFlow

A minimal full-stack proving ground for AWS serverless + React micro-frontends, with tests and CI/CD.

---

## System Overview

**Frontend:**
- **web-shell:** Host application that dynamically loads micro-frontends using module federation.
- **mf-orders:** Micro-frontend for managing and viewing orders.
- **mf-analytics:** Micro-frontend for analytics and reporting.

**Backend:**
- **@orderflow/api:** Serverless API built with AWS Lambda, handling business logic and integration with AWS services.
- **mq-ingestor:** Lambda function for ingesting messages from AWS MQ and forwarding events.
- **athena-report:** Lambda function for querying Athena and providing analytics KPIs.
- **notifier-email:** Lambda function for sending notification emails based on events.
- **processor:** Lambda function for processing order events and orchestrating backend workflows.
- **Infrastructure:** Terraform scripts provision AWS resources (Lambda, SQS, SNS, DynamoDB, EventBridge, S3, Athena, Glue, etc.).

**Shared Packages:**
- **@orderflow/contracts:** Shared Zod schemas for API and frontend validation.
- **@orderflow/types:** Shared TypeScript types.
- **@orderflow/ui:** Shared UI components for consistent design.

---

## Getting Started

```bash
# 0) Node 20 + pnpm installed
corepack enable

# 1) Install
pnpm install

# 2) Run frontends locally (in separate terminals)
pnpm --filter web-shell dev
pnpm --filter mf-orders dev
pnpm --filter mf-analytics dev

# 3) Unit tests (backend)
pnpm --filter @orderflow/api test

# 4) Build all
pnpm -w build
```

---

## Project Structure

```
apps/
  web-shell/        # Host shell for micro-frontends
  mf-orders/        # Orders micro-frontend
  mf-analytics/     # Analytics micro-frontend
packages/
  contracts/        # Shared Zod schemas
  types/            # Shared TypeScript types
  ui/               # Shared UI components
services/
  api/              # AWS Lambda API
  mq-ingestor/      # MQ event ingestion Lambda
  athena-report/    # Athena analytics Lambda
  notifier-email/   # Email notification Lambda
  processor/        # Order event processor Lambda
infra/              # Terraform scripts for AWS resources
```

---

## Development Tips

- Make sure all micro-frontends and the shell are running for full integration.
- Use shared contracts/types for type-safe communication.
- Update Terraform scripts for new AWS resources as needed.
- Use `pnpm` workspace commands for efficient multi-package management.

---

## Troubleshooting

- **Module federation 404s:** Ensure all remotes are running in dev mode and host URLs match remote entry points.
- **AWS resource errors:** Check Terraform output and AWS console for resource status.
- **Type errors:** Sync shared types/contracts across packages.

---

## License

MIT

---

## Authors

DanielUche @DanielUche

---