# Start here

This repository is designed so ChatGPT/Codex, Claude, or Gemini can continue the same task without access to another assistant's conversation.

## If no task is active

1. Read `README.md` and `PROJECT_STATE.md`.
2. Create a GitHub issue from the AI task template.
3. Create one branch for that issue.
4. Fill in `CURRENT_WORK.md` before changing application code.
5. Commit and push the initial checkpoint.

## If another assistant stopped unexpectedly

1. Read `COLLABORATION.md` and your assistant-specific instruction file.
2. Read `CURRENT_WORK.md`.
3. Open the issue, pull request, and remote branch named there.
4. Inspect the latest commits and actual file diff.
5. Continue from **Exact next action** in `CURRENT_WORK.md`.
6. Do not redo completed work unless verification shows it is incorrect.
7. After the next meaningful step, update `CURRENT_WORK.md`, commit, and push.

## Source-of-truth order

When information conflicts, use this order:

1. The user's latest instruction in the active GitHub issue
2. The actual code and remote branch history
3. `CURRENT_WORK.md`
4. `PROJECT_STATE.md`
5. `TASKS.md`
6. Previous chat messages

Chat history is helpful context, but it is never the only record of unfinished work.
