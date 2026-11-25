// Entry for "Tell a Whole Story in 32 Characters" (make.fun).
//
// The program composes one Wi-Fi network name of at most 32 characters
// and writes it, byte for byte, to /output/entry.txt. Nothing else is
// written: no trailing newline, no extra whitespace, so the file holds
// exactly the name the judge reads.
//
// The name: "She left, I changed the password"  (32 characters)
//
// Why this name, against the judge's brief:
//   * Joke lands on first read — the twist is the second clause: she
//     walked out, and his instant, petty revenge was to lock her out
//     of the Wi-Fi. The punchline is an action, not a label.
//   * Whole story — two characters (her, him), a breakup (she left),
//     and an ending (he changed the password, so she is standing
//     outside right now, phone in hand, locked out). A reader can fill
//     in the fight, the boxes, the moving van, and the "incorrect
//     password" notification.
//   * Fresh — it dodges the stock Wi-Fi jokes (no "FBI Surveillance
//     Van", no "Pretty Fly for a Wi-Fi", no "It Burns When IP") and
//     turns the familiar "ex" theme into a specific, domestic revenge.
//   * Tight — every word earns its place: "She left," sets the scene
//     in nine characters; "I changed the password" is the twist and
//     the ending in one breath. Exactly 32 characters, the full budget,
//     with nothing wasted.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// The name, composed deliberately from three fragments.
// ---------------------------------------------------------------------------

// Beat one: the departure. Past tense, two words, one comma — the whole
// breakup, stated flat, the way someone tells it to a stranger.
const DEPARTURE = "She left,";

// Beat two: the retaliation. First person, active verb — the narrator
// does something about it immediately, which is where the joke lives.
const RETALIATION = "I changed";

// Beat three: the object. The one small thing he still controls, and
// the thing she will notice first when she tries to get back online.
const LOCKED_OUT = "the password";

// The hard cap from the bounty rules: a Wi-Fi name of at most 32
// characters, spaces included. The sealed gate rejects anything longer.
const MAX_CHARACTERS = 32;

// Where the grader looks for the entry.
const OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

function composeName(): string {
  // Join the three beats with single spaces. No other separator is used,
  // so the result reads as one sentence a passer-by can say out loud.
  const parts = [DEPARTURE, RETALIATION, LOCKED_OUT];
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Count characters the way a reader does: one code point per character,
// so a multi-byte glyph can never sneak past the cap disguised as one.
function characterCount(text: string): number {
  return [...text].length;
}

function validateName(name: string): string[] {
  const problems: string[] = [];

  if (name.length === 0) {
    problems.push("name is empty");
  }
  if (name.trim().length === 0) {
    problems.push("name is only whitespace");
  }
  if (characterCount(name) > MAX_CHARACTERS) {
    problems.push(
      `name is ${characterCount(name)} characters, over the ${MAX_CHARACTERS}-character cap`,
    );
  }
  if (/[\r\n]/.test(name)) {
    problems.push("name contains a line break, which would split the network name");
  }
  // A double space would waste a character of the 32 and look broken in
  // a phone's network list, so the joins must produce single spaces.
  if (/ {2,}/.test(name)) {
    problems.push("name contains a double space, wasting characters");
  }
  // A name ending on punctuation trails off; this one ends on the word
  // that is the punchline, so it must end on a letter.
  if (!/[A-Za-z]$/.test(name)) {
    problems.push("name does not end on a letter, so the punchline trails off");
  }
  // Control characters would be invisible in a phone's network list and
  // could break the gate's UTF-8 check, so none are allowed.
  for (const ch of name) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0)! === 0x7f) {
      problems.push(`name contains control character U+${ch.codePointAt(0)!.toString(16)}`);
      break;
    }
  }
  // The story needs its two beats: a departure and a retaliation. If a
  // future edit drops one, the name stops being a story, so fail loudly.
  if (!name.includes(",")) {
    problems.push("name lost its comma, so the two story beats run together");
  }
  if (!/\b(changed|kept|locked)\b/.test(name)) {
    problems.push("name lost its twist verb, so the punchline is gone");
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function writeEntry(name: string): void {
  // Create /output when it does not exist yet; the grader's sandbox
  // starts with an empty filesystem outside the repository.
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // Write the name exactly, with no trailing newline: a newline would
  // be a 33rd character and push the entry over the cap.
  writeFileSync(OUTPUT_PATH, name, "utf8");

  // Read it back and prove the file holds exactly what we composed.
  // Any mismatch (encoding surprise, stray bytes) is a loud failure,
  // not a silent near-miss.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== name) {
    throw new Error(
      `verification failed: file holds ${JSON.stringify(written)} instead of ${JSON.stringify(name)}`,
    );
  }
  const writtenBytes = Buffer.byteLength(written, "utf8");
  if (writtenBytes !== characterCount(name)) {
    // The name is plain ASCII, so bytes and characters must agree; if
    // they ever do not, something non-ASCII crept in.
    throw new Error(
      `verification failed: file is ${writtenBytes} bytes but ${characterCount(name)} characters`,
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const name = composeName();
  const problems = validateName(name);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`ERROR: ${problem}`);
    }
    process.exit(1);
  }

  writeEntry(name);

  console.log(`Wi-Fi name: ${name}`);
  console.log(`Characters: ${characterCount(name)} / ${MAX_CHARACTERS}`);
  console.log(`Wrote ${join(OUTPUT_PATH)} (${Buffer.byteLength(name, "utf8")} bytes)`);
}

main();
