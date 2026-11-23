import * as fs from "node:fs";
import * as path from "node:path";

// The roast: one line about the gadget used every day — the banking app.
const roastLine =
  "My banking app texts me a code to prove I'm me, then locks me out for typing it too slowly.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

type ValidationResult = { ok: true } | { ok: false; reason: string };

function validateRoast(text: string): ValidationResult {
  const chars = [...text];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    return { ok: false, reason: `length ${chars.length} outside ${MIN_CHARS}-${MAX_CHARS}` };
  }
  if (/[\r\n]/.test(text)) {
    return { ok: false, reason: "must be exactly one line" };
  }
  try {
    const encoded = new TextEncoder().encode(text);
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
    if (decoded !== text) return { ok: false, reason: "not valid UTF-8" };
  } catch {
    return { ok: false, reason: "not valid UTF-8" };
  }
  return { ok: true };
}

function resolveTarget(): string {
  const outDir = "/output";
  if (fs.existsSync(outDir) && fs.statSync(outDir).isDirectory()) {
    return path.join(outDir, "entry.txt");
  }
  return path.resolve("entry.txt");
}

function emit(): void {
  const verdict = validateRoast(roastLine);
  if (!verdict.ok) {
    console.error(`invalid roast: ${verdict.reason}`);
    process.exit(1);
  }
  const target = resolveTarget();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${roastLine}\n`, { encoding: "utf8" });
  console.log(`roast written (${[...roastLine].length} chars) -> ${target}`);
}

emit();
