const GREETING_ONLY_RE =
  /^(gm+|gn+|good\s+(morning|evening|night|afternoon)|hello|hi|hey|halo|hai|hei|yo|sup|wassup|selamat\s+(pagi|siang|sore|malam)|pagi|siang|sore|malam)[\s!.,?👋🙏✨]*$/iu;

/** Short salutations — no Access data dump, no long intro */
export function isCasualGreeting(text) {
  const raw = text?.trim();
  if (!raw || raw.length > 48) return false;

  const normalized = raw
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, '')
    .trim();

  if (GREETING_ONLY_RE.test(normalized)) return true;

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    const w = words.join(' ').toLowerCase();
    if (/^(gm|gn|hi|hey|halo|hai|yo|hello)$/.test(w)) return true;
    if (/^good\s+(morning|night|evening)$/.test(w)) return true;
  }

  return false;
}

export function getCasualGreetingReply(text) {
  const t = text.trim().toLowerCase();

  // If Indonesian greetings
  if (/selamat|pagi|siang|sore|malam|^halo|^hai/.test(t)) {
    return 'Halo! Ada yang bisa dibantu hari ini?';
  }

  // If gm/gn
  if (/^gn|good\s*night/.test(t)) {
    return 'gn! How can I help you?';
  }

  if (/^gm|good\s*morning/.test(t)) {
    return 'gm! How can I help you?';
  }

  // Default English
  return 'Hey! How can I help you today?';
}
