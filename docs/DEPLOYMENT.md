# Deployment

## Baseline

The current project can run anywhere Node.js 18+ is available:

```bash
node server.js
```

## Production target

Use:

- managed web/API service;
- managed PostgreSQL;
- object storage;
- background worker;
- queue;
- scheduler;
- secret manager;
- logs/error tracking.

## Before production

- add authentication;
- replace JSON writes;
- set secure headers;
- add CSRF/auth protections;
- validate all API input;
- implement migrations;
- add backups;
- add health and readiness checks;
- add CI/CD;
- verify platform terms and media-retention rules.
