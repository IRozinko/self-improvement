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

You can manually trigger the self-improvement agent using the GitHub web interface or GitHub CLI.

### Using GitHub Web Interface:

1. Go to the repository's GitHub page.
2. Navigate to the "Actions" tab.
3. Select the "Self Improvement Agent" workflow.
4. Click "Run workflow" to start it immediately.

### Using GitHub CLI:

```bash
gh workflow run "Self Improvement Agent"
```

This command starts the workflow immediately from your terminal.

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

Changes should be small, focused, and easily reviewable.

**Note:** To keep reviews manageable, the agent should modify no more than 2 files per run.

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

---

## Example improvement request

Here is an example prompt the agent might use internally to request an improvement from the LLM:

```
Please suggest a small, safe improvement to the README.md file that enhances clarity or adds a useful example. The change should be concise and easily reviewable.
```

This helps keep the improvements focused and aligned with the repository's goals.

---

## Example manual improvement

To help reviewers understand the agent's changes, here is an example of a small, safe improvement the agent might make:

- Add a brief example usage section to the README.md to illustrate how to trigger the agent manually.
- Clarify the "Improvement policy" section by adding a note about the maximum number of files changed per run.

These types of improvements keep the documentation clear and helpful without introducing risk.

---

## Troubleshooting

If the agent does not appear to make changes:

- Ensure the `OPENAI_API_KEY` secret is set correctly.
- Check the workflow run logs for errors.
- Verify that the files to be improved are in the allowlist.

If you encounter issues, please open an issue in this repository.

---

## Additional usage example

### Triggering the agent manually via GitHub CLI

To manually trigger the self-improvement agent from your terminal, run:

```bash
# Trigger the workflow named "Self Improvement Agent"
gh workflow run "Self Improvement Agent"
```

This command will start the workflow immediately, allowing you to test or prompt improvements on demand.

### Example of a small README.md improvement request

When requesting improvements, keep prompts focused and safe, for example:

```
Please add a concise example usage section to the README.md that explains how to manually trigger the self-improvement agent using the GitHub CLI.
```

This ensures the agent suggests practical, reviewable changes that enhance user understanding.

---

## Summary of key points

- The agent focuses exclusively on documentation and planning files to maintain safety.
- Changes are small and reviewable, with a maximum of 2 files modified per run.
- Manual triggering is supported via GitHub web interface and CLI.
- Future enhancements aim to improve automation safety, transparency, and usability.

---

## Minor clarifications added

- Added a note in the "Improvement policy" section about the maximum number of files changed per run to emphasize reviewability.
- Added a brief "Summary of key points" section at the end to highlight the main safety and usage principles.
