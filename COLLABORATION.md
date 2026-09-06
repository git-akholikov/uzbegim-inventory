# Shared AI collaboration rules

This repository is the shared source of truth for ChatGPT/Codex, Claude, Gemini, and human contributors.

## Before starting any task

1. Read `START-HERE.md`, `README.md`, `PROJECT_STATE.md`, `CURRENT_WORK.md`, and `TASKS.md`.
2. Read the full GitHub issue and its comments.
3. Check for an existing pull request or branch for that issue.
4. Continue existing work instead of starting a competing implementation.
5. Do not remove working features unless the issue explicitly requests it.

## Working method

1. Use one GitHub issue for one clear task.
2. Use one branch and one pull request for that issue.
3. Preferred branch name: `ai/ISSUE-NUMBER-short-description`.
4. Keep changes small and focused.
5. Preserve responsive phone and desktop behavior.
6. Test the standalone `index.html` by opening it directly.
7. Keep `CURRENT_WORK.md` current while working; do not wait until the end.
8. Check completed items in `TASKS.md`.
9. Describe changed files and tests in the pull request.

## Continuous checkpoints — mandatory

An assistant may stop without warning because of a message, token, time, or usage limit. Therefore, never rely on a final handoff message.

1. At the start, fill in `CURRENT_WORK.md` and commit it to the task branch.
2. Work in small, testable steps.
3. After every meaningful completed step—or at least every 10 minutes—update `CURRENT_WORK.md`, commit, and push.
4. Before starting a large edit, record the intended next step in `CURRENT_WORK.md` and push it first.
5. Never keep more than one meaningful uncommitted change at a time.
6. Use commit messages beginning with `checkpoint:` for unfinished work.
7. After reconnecting, read the remote branch and `CURRENT_WORK.md`; do not trust chat history as the source of truth.
8. Keep the **Exact next action** field concrete enough that a new assistant can act without asking what happened.

The next assistant must be able to recover using only the GitHub issue, branch history, pull request, and `CURRENT_WORK.md`.

## Checkpoint contents

Every checkpoint in `CURRENT_WORK.md` must state:

- The issue, branch, pull request, assistant, and time
- The requested outcome
- Work already completed and pushed
- Work currently in progress
- One exact next action
- Files changed
- Verification completed
- Errors, risks, or decisions needed

## Final handoff when stopping normally

Before stopping:

1. Save all working changes.
2. Commit and push the branch if possible.
3. Update `CURRENT_WORK.md` and, when a lasting product decision changed, `PROJECT_STATE.md`.
4. In the issue or pull request, write:
   - What was completed
   - What remains
   - Which files changed
   - What was tested
   - Any errors or open decisions
5. Add the label `ai-handoff` if the repository has that label.

The next assistant must read the handoff, inspect the actual diff, and continue the same branch or pull request.

## Safety

- Never commit secrets or credentials.
- Do not merge directly to `main` without human review.
- Do not force-push shared branches.
- Do not overwrite another assistant's unmerged work.
- Do not claim a test passed unless it was actually run.
- Do not allow two assistants to write to the same branch at the same time.
