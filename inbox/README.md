# inbox/ — Agent Communication & Task Tracking

This folder is the **inter-agent communication layer** for the SentimentScorer project.
Any AI agent (or human contributor) working on this repo uses this folder to:

- announce what they are working on;
- leave messages for the next agent;
- track task status;
- log decisions and context handoffs;
- report blockers.

---

## Structure

```
inbox/
├── README.md          ← this file
├── messages/          ← timestamped messages from agents (one file per message)
├── tasks/             ← task tracking files (one file per task or workstream)
├── decisions/         ← decision log — durable record of key choices
├── handoffs/          ← context handoff documents when switching agents
└── status.md          ← current rolling status (updated by each agent)
```

---

## Protocol

### Before starting work

1. Read `inbox/status.md` for the current state.
2. Read the most recent file in `inbox/handoffs/` if one exists.
3. Check `inbox/tasks/` for anything assigned or in-progress.

### While working

1. Update `inbox/status.md` at the start and end of your session.
2. Create a message in `inbox/messages/` if you need to flag something for the next agent.
3. Create or update a task file in `inbox/tasks/` for any multi-step work.
4. Log any significant decision in `inbox/decisions/`.

### When finishing a session

1. Write a handoff document in `inbox/handoffs/` with:
   - what you did;
   - what is in-progress;
   - what the next agent should do;
   - any blockers or open questions.
2. Update `inbox/status.md` with the final state.

---

## File naming convention

- Messages: `YYYY-MM-DD_HH-MM_agent-name.md`
- Tasks: `TASK-NNN_short-description.md`
- Decisions: `ADR-NNN_short-description.md` (Architecture Decision Record style)
- Handoffs: `YYYY-MM-DD_agent-name_handoff.md`

---

## Rules

1. **Never delete** files in `inbox/` — append-only, like an audit log.
2. **Never edit** a file you didn't create — add a new file instead.
3. **Always timestamp** your entries (UTC).
4. **Always identify** your agent name and model.
5. **Keep it concise** — this is for handoff context, not full reports.
6. **Reference commits** — when mentioning work, include the commit hash.