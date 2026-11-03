#!/usr/bin/env node
// Claude Code PostToolUse hook: after a .ts/.tsx edit, run the TypeScript compiler.
// Exit code 2 sends the errors back to Claude so it fixes them before moving on.
import { execSync } from "node:child_process";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    const payload = JSON.parse(input || "{}");
    filePath = payload?.tool_input?.file_path ?? payload?.tool_input?.path ?? "";
  } catch {
    process.exit(0);
  }
  if (!/\.(ts|tsx)$/.test(filePath)) process.exit(0);

  try {
    execSync("npx tsc --noEmit --pretty false", { stdio: "pipe", cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd() });
    process.exit(0);
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim().split("\n").slice(0, 40).join("\n");
    process.stderr.write(`TypeScript errors after editing ${filePath}:\n${out}\n`);
    process.exit(2);
  }
});
