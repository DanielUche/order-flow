# OrderFlow


A minimal full-stack proving ground for AWS serverless + React micro-frontends, with tests and CI/CD.


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