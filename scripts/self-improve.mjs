import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const allowedFiles = [
  "README.md",
  "ROADMAP.md",
  "CHANGELOG.md",
  "docs/agent-policy.md",
  "docs/ideas.md",
  "docs/implementation-notes.md"
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readRepositorySnapshot() {
  const snapshot = {};

  for (const file of allowedFiles) {
    if (await fileExists(file)) {
      snapshot[file] = await fs.readFile(file, "utf8");
    }
  }

  return snapshot;
}

function buildPrompt(snapshot) {
  return `
You are a conservative repository self-improvement agent.

Your job:
- Improve repository documentation or planning content.
- Make only small, useful, safe improvements.
- Do not modify workflow files.
- Do not mention secrets or API keys.
- Do not invent completed features.
- Prefer improving clarity, TODOs, examples, roadmap, changelog, or implementation notes.

Allowed files:
${allowedFiles.map(file => `- ${file}`).join("\n")}

Current repository snapshot:
${JSON.stringify(snapshot, null, 2)}

Return ONLY valid JSON in this exact format:

{
  "changes": [
    {
      "path": "README.md",
      "content": "full replacement content"
    }
  ],
  "summary": "Short summary of what was improved"
}

Rules:
- Use full replacement content for each changed file.
- Change at most 2 files per run.
- If no improvement is useful, return:
{
  "changes": [],
  "summary": "No useful improvement found"
}
`;
}

function validateChange(change) {
  if (!change || typeof change !== "object") return false;
  if (!allowedFiles.includes(change.path)) return false;
  if (typeof change.content !== "string") return false;
  if (change.content.trim().length < 20) return false;
  return true;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const snapshot = await readRepositorySnapshot();

  const response = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "You are a safe and conservative GitHub repository self-improvement agent."
      },
      {
        role: "user",
        content: buildPrompt(snapshot)
      }
    ]
  });

  const raw = response.choices?.[0]?.message?.content;

  if (!raw) {
    console.log("LLM returned empty response.");
    return;
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error("Invalid JSON returned by LLM:");
    console.error(raw);
    throw error;
  }

  const changes = Array.isArray(parsed.changes) ? parsed.changes : [];

  if (changes.length === 0) {
    console.log(parsed.summary || "No useful improvement found.");
    return;
  }

  let applied = 0;

  for (const change of changes.slice(0, 2)) {
    if (!validateChange(change)) {
      console.log(`Skipping invalid change: ${JSON.stringify(change)}`);
      continue;
    }

    const targetPath = path.resolve(change.path);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, change.content.trim() + "\n", "utf8");
    applied++;
    console.log(`Updated ${change.path}`);
  }

  console.log(`Applied ${applied} change(s).`);
  console.log(`Summary: ${parsed.summary || "No summary provided."}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
