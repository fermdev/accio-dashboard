const STOP_WORDS = new Set([
  'apa',
  'apakah',
  'adalah',
  'yang',
  'dan',
  'di',
  'ke',
  'dari',
  'untuk',
  'dengan',
  'ini',
  'itu',
  'ada',
  'tidak',
  'bisa',
  'mau',
  'saya',
  'aku',
  'kamu',
  'kau',
  'dia',
  'kita',
  'mereka',
  'the',
  'is',
  'are',
  'was',
  'do',
  'you',
  'know',
  'about',
  'tell',
  'me',
  'what',
  'who',
  'how',
  'tau',
  'tahu',
  'cari',
  'info',
  'informasi',
  'kreator',
  'creator',
  'pool',
  'access',
  'protocol',
  'accio',
]);

/** "Sugar Lea" / sugar-lea → sugarlea */
export function normalizeName(str) {
  return String(str)
    .toLowerCase()
    .replace(/[\s\-_'.]/g, '');
}

export function extractQueryTerms(text) {
  const lower = text.toLowerCase().trim();
  const words = lower
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  const terms = new Set(words);

  // Catch glued names in questions: "sugarlea" from "tau sugarlea?"
  const alnum = lower.replace(/[^a-z0-9]/gi, '');
  for (const w of words) {
    if (w.length >= 4) terms.add(w);
  }
  if (alnum.length >= 4 && alnum.length <= 32) {
    terms.add(alnum);
  }

  return [...terms];
}

export function namesMatch(queryText, candidateName) {
  const qNorm = normalizeName(queryText);
  const cNorm = normalizeName(candidateName);
  if (!cNorm || cNorm.length < 3) return false;

  if (qNorm.includes(cNorm) || cNorm.includes(qNorm)) return true;

  const terms = extractQueryTerms(queryText);
  return terms.some((t) => {
    const tn = normalizeName(t);
    if (tn.length < 3) return false;
    return cNorm.includes(tn) || tn.includes(cNorm);
  });
}
