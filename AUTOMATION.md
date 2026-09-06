# Automatic assistant switching

## What GitHub can do by itself

GitHub can store the code, issues, branches, pull requests, tests, and handoff notes. This lets a different assistant continue reliably after reading the repository state.

GitHub does not automatically transfer a live ChatGPT, Claude, or Gemini consumer-app conversation when that app reaches its plan limit.

## Continuous recovery — enabled by repository instructions

1. The current assistant updates `CURRENT_WORK.md`, commits, and pushes after every meaningful step.
2. If it stops unexpectedly, the latest remote checkpoint remains available.
3. Open the same repository and issue in another assistant.
4. Ask it to read `START-HERE.md` and continue from `CURRENT_WORK.md`.

This method uses existing subscriptions and is easy to audit. It protects all pushed checkpoints but cannot recover edits that were never committed and pushed.

## True automatic fallback — optional later

Automatic fallback requires paid API access and a GitHub Actions workflow or another orchestrator. It should:

1. Receive a task from a GitHub issue.
2. Try the selected provider.
3. Retry temporary errors with a delay.
4. On a confirmed provider quota or rate-limit error, read the already-pushed checkpoint.
5. Start the next provider with the issue, branch, diff, and `CURRENT_WORK.md`.
6. Stop after a fixed number of attempts and request human review.

Expected GitHub repository secrets:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

Never place these values in repository files. API usage is billed separately from consumer ChatGPT, Claude, and Gemini subscriptions.

Do not enable automatic write access until the manual issue/branch/pull-request workflow is working reliably.

Automatic startup and continuous state saving are separate features. The repository now handles continuous state saving. Automatic startup still requires an API workflow.
