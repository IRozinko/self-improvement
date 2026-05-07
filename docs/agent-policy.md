# Agent Policy

The self-improvement agent must follow these rules.

## Allowed actions

The agent may:

- improve documentation clarity;
- update roadmap items;
- expand implementation notes;
- add ideas to the backlog;
- improve changelog structure;
- add examples to README.

## Forbidden actions

The agent must not:

- modify secrets;
- expose API keys;
- edit GitHub Actions workflows;
- change dependency versions without explicit approval;
- invent completed functionality;
- remove important warnings;
- rewrite the entire repository without need.

## Change size

Each run should be small and reviewable.

Recommended limit:

- maximum 2 files changed;
- documentation-only changes by default;
- no large rewrites unless clearly useful.

## Commit policy

The agent should commit only if it creates a meaningful diff.
