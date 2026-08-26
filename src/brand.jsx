import { ACCENT } from './content.js';

// Brand name occurrences get the accent colour. Matching is word-aware in both
// scripts: `\b` is ASCII-only so it can't guard Arabic, hence the explicit
// Arabic-letter lookarounds — without them "وجود" would also match inside
// "وجودك" / "وجودنا", colouring half a word.
const AR_LETTER = 'ء-ي';
const BRAND = new RegExp(
  `(\\bWojod\\b|(?<![${AR_LETTER}])وجود(?![${AR_LETTER}]))`,
  'g'
);

export function Brand({ text }) {
  if (!text) return null;
  const parts = String(text).split(BRAND);
  return parts.map((part, i) =>
    BRAND.test(part) && (part === 'Wojod' || part === 'وجود')
      ? <span key={i} style={{ color: ACCENT }}>{part}</span>
      : part
  );
}
