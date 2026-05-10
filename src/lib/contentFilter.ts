/**
 * Content filter for user-submitted gratitude entries.
 *
 * Strategy: lightweight client-side-feasible checks that catch obvious abuse.
 * Not a replacement for server-side AI moderation (add OpenAI Moderation API
 * or similar in production), but prevents prompt injection and obvious spam.
 */

export const MAX_ENTRY_LENGTH = 500;
const MIN_ENTRY_LENGTH = 1;

/** Patterns that indicate prompt injection attempts */
const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+(now|a)\s+/i,
  /system\s*:\s*/i,
  /\bact\s+as\b/i,
  /\brole\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
];

/** Patterns for obviously inappropriate content */
const BLOCKED_PATTERNS: readonly RegExp[] = [
  /\b(kill|murder|suicide|self-harm)\b/i,
  /\b(bomb|explosive|weapon)\b/i,
  /\b(child\s*(porn|abuse|exploit))\b/i,
];

export interface FilterResult {
  passed: boolean;
  reason?: string;
}

export function filterEntry(entry: string): FilterResult {
  const trimmed = entry.trim();

  if (trimmed.length < MIN_ENTRY_LENGTH) {
    return { passed: false, reason: "Entry is empty" };
  }

  if (trimmed.length > MAX_ENTRY_LENGTH) {
    return { passed: false, reason: "Entry exceeds maximum length" };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { passed: false, reason: "Entry contains disallowed content" };
    }
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { passed: false, reason: "Entry contains inappropriate content" };
    }
  }

  return { passed: true };
}

export function filterEntries(entries: string[]): FilterResult {
  for (let i = 0; i < entries.length; i++) {
    const result = filterEntry(entries[i]);
    if (!result.passed) {
      return { passed: false, reason: `Entry ${i + 1}: ${result.reason}` };
    }
  }
  return { passed: true };
}
