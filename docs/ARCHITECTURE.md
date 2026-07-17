# Architecture Direction

## Components

1. Web review application
2. API/service layer
3. Managed PostgreSQL
4. Object storage
5. Background workers
6. Durable queue and scheduler
7. Replaceable model-provider layer
8. Central logs and error tracking

## Principles

- GitHub is the source of truth.
- Secrets live outside Git.
- Long jobs do not run inside page requests.
- Jobs are idempotent.
- Retries are bounded.
- Media retention is intentional.
- Every classification remains auditable.
