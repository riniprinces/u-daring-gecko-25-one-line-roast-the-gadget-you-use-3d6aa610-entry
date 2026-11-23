// One-Line Roast: The Gadget You Use Every Day
// ------------------------------------------------
// This program emits one original roast line for the bounty.
// It writes the line to /output/entry.txt when the grader runs it,
// and to ./entry.txt when /output is not present (local runs).
// Node 22+ runs this TypeScript file directly, no build step needed.
//
// The roast targets a daily app — the banking app — with one concrete
// detail everyone recognises: the two-factor code that expires while
// you are still typing it in. One person's specific gripe, one line.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_FILE = "entry.txt";
const MAX_CHARS = 200;

// The single roast line. Keep it one line, plain ASCII, no trailing spaces.
const LINE =
  "My banking app texts me a code to prove I'm me, then locks me out for typing it too slowly.";

// Count visible characters (code points), so the 200-char gate matches
// what the sealed scorer sees for this plain-ASCII line.
function charCount(text: string): number {
  return [...text].length;
}

function problems(text: string): string[] {
  const found: string[] = [];
  if (charCount(text) < 1) found.push("empty entry");
  if (charCount(text) > MAX_CHARS) {
    found.push(`too long: ${charCount(text)} characters (max ${MAX_CHARS})`);
  }
  if (text.trim() === "") found.push("only whitespace");
  if (/[\r\n]/.test(text)) found.push("must be a single line");
  return found;
}

function pickOutputPath(): string {
  const graderDir = "/output";
  if (existsSync(graderDir)) return resolve(graderDir, ENTRY_FILE);
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, ENTRY_FILE);
}

const issues = problems(LINE);
if (issues.length > 0) {
  console.error(`Invalid entry: ${issues.join("; ")}`);
  process.exit(1);
}

const outPath = pickOutputPath();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE + "\n", { encoding: "utf8" });
console.log(`entry.txt written (${charCount(LINE)} chars) -> ${outPath}`);
console.log(LINE);
