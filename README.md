# Self-Improvement Repository

This repository demonstrates a GitHub automation agent that periodically improves repository content using a large language model (LLM).

## Goal

The goal is to create a safe, reviewable, automated self-improvement loop for repository documentation and planning files.

The agent runs every 2 hours and can improve:

- README content;
- roadmap;
- changelog;
- documentation notes;
- idea backlog;
- implementation notes.

## How it works

The automation is implemented with GitHub Actions.

Every scheduled run:

1. checks out the repository;
2. installs Node.js dependencies;
3. runs the self-improvement script;
4. asks an LLM for a small repository improvement;
5. applies only allowlisted file changes;
6. commits changes if a real diff exists.

## Safety principles

The agent is intentionally conservative.

It does not edit:

- GitHub Actions workflows;
- secret files;
- environment files;
- application runtime code by default.

This keeps the automation predictable and safe for a test assignment.

## Required configuration

Add the following GitHub Actions secret:

```text
OPENAI_API_KEY
```

Optional:

```text
OPENAI_MODEL
```

If `OPENAI_MODEL` is not set, the script uses its default model.

## Manual run

To manually trigger the agent:

```text
Actions → Self Improvement Agent → Run workflow
```

## Schedule

The workflow runs every 2 hours:

```cron
0 */2 * * *
```

## Improvement policy

The agent may update only allowlisted documentation and planning files:

- `README.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `docs/agent-policy.md`
- `docs/ideas.md`
- `docs/implementation-notes.md`

## Future improvements

Possible next steps:

- create pull requests instead of direct commits;
- add automated tests before committing;
- add issue creation for larger improvements;
- support multiple LLM providers;
- add file-level scoring;
- add cost limits.

## Contribution

Contributions and suggestions are welcome. Please open issues or pull requests to improve the agent or documentation.
