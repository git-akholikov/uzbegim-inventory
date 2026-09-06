# GitHub setup and AI handoff

## Publish the project

1. Install GitHub Desktop from https://desktop.github.com/ and sign in.
2. Choose **File > Add Local Repository**.
3. Select this `warehouse-inventory-github` folder.
4. In the lower-left corner, enter the summary `Initial warehouse prototype` and click **Commit to main**.
5. Click **Publish repository**.
6. Name it `uzbegim-inventory`, keep **Keep this code private** selected, and click **Publish Repository**.

## Give the assistants one source of truth

Every assistant must begin by reading:

- `START-HERE.md`
- `README.md`
- `PROJECT_STATE.md`
- `CURRENT_WORK.md`
- `TASKS.md`
- `COLLABORATION.md`
- Its own instruction file: `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`

Use one GitHub Issue for each task. Ask the assistant to work on a branch and follow the continuous-checkpoint rules in `COLLABORATION.md`. It must update `CURRENT_WORK.md`, commit, and push after every meaningful step—not only before stopping.

## Start or continue work

Copy this prompt into the assistant you want to use:

> Open the `uzbegim-inventory` GitHub repository and continue Issue #NUMBER. First read START-HERE.md, README.md, PROJECT_STATE.md, CURRENT_WORK.md, TASKS.md, COLLABORATION.md, and your assistant-specific instruction file. Inspect the remote branch and pull request before changing anything. Follow the mandatory continuous-checkpoint rules: after every meaningful step, update CURRENT_WORK.md, commit, and push. Never wait until the conversation ends to save progress. Continue from the latest pushed checkpoint, test the result, and leave the repository recoverable at all times.

The assistant must have permission to commit and push to the repository. Read-only access is not sufficient for automatic checkpoint saving.

## When an assistant reaches its limit

If it can still answer, send the handoff request below. If it has already stopped, do not depend on that chat: the next assistant should recover from the last pushed checkpoint in `CURRENT_WORK.md` and the branch history.

> Stop coding and create a handoff now. Push all completed work, update CURRENT_WORK.md, and add an Issue comment describing what changed, what was tested, what remains, and the exact next step. Do not leave uncommitted work.

Then open another assistant and use the **Start or continue work** prompt with the same Issue number.

## Automatic switching

GitHub alone cannot detect that a ChatGPT, Claude, or Gemini consumer subscription reached its message limit. Automatic fallback requires API keys, API billing, a GitHub Actions workflow or external orchestrator, and logic that detects retryable API errors. Start with manual handoffs; add API automation only after this workflow is reliable.

The recovery files are already included. No API keys are required for manual switching.
