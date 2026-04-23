// Blog feature image generator.
// Renders a Payxem-branded SVG with a realistic mobile phone mockup on the right
// showing the actual product (portfolio page or digital business card), then
// converts to 1200x630 JPG (OG standard). Uses the Payxem CSS palette so the
// preview looks like a real in-app screenshot.
// Run: `node scripts/gen-feature-images.mjs`

import sharp from 'sharp';
import { resolve } from 'node:path';

// ── Canvas ────────────────────────────────────────────────────────────
const W = 1200;
const H = 630;

// ── Payxem brand palette (matches frontend/admin.html + dashboard.html) ──
const NAVY = '#1A3060';
const NAVY_DARK = '#0F1D3D';
const TEAL = '#2BC4C0';
const TEAL_LIGHT = '#E0F7F7';
const WHITE = '#FFFFFF';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const BG = '#F3F4F6';
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';

// ── Phone frame (iPhone-ish, matches hero section styling) ───────────
function phoneFrame(screenContent, { x = 0, y = 0, scale = 1 } = {}) {
  const pw = 320;
  const ph = 560;
  return `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <!-- Phone shadow -->
    <rect x="-4" y="6" width="${pw}" height="${ph}" rx="44"
          fill="rgba(0,0,0,0.25)" filter="url(#shadow)"/>
    <!-- Phone body (navy bezel) -->
    <rect x="0" y="0" width="${pw}" height="${ph}" rx="44"
          fill="#111827" stroke="#1F2937" stroke-width="2"/>
    <!-- Inner bezel -->
    <rect x="6" y="6" width="${pw - 12}" height="${ph - 12}" rx="38" fill="#000"/>
    <!-- Screen -->
    <rect x="12" y="12" width="${pw - 24}" height="${ph - 24}" rx="32" fill="${BG}"/>
    <!-- Dynamic island -->
    <rect x="${pw / 2 - 48}" y="22" width="96" height="22" rx="11" fill="#000"/>

    <!-- Screen content clipped to inner radius -->
    <clipPath id="screen-clip">
      <rect x="12" y="12" width="${pw - 24}" height="${ph - 24}" rx="32"/>
    </clipPath>
    <g clip-path="url(#screen-clip)">
      ${screenContent(pw, ph)}
    </g>
  </g>`;
}

// ── Portfolio mini-UI (My Portfolio Web page inside phone) ───────────
function portfolioScreen(pw, ph) {
  return `
    <!-- Top bar -->
    <rect x="12" y="52" width="${pw - 24}" height="48" fill="${WHITE}"/>
    <circle cx="38" cy="76" r="4" fill="${NAVY}"/>
    <circle cx="54" cy="76" r="4" fill="${NAVY}"/>
    <circle cx="70" cy="76" r="4" fill="${NAVY}"/>
    <rect x="${pw - 56}" y="68" width="32" height="16" rx="4" fill="${TEAL}" fill-opacity="0.18"/>
    <text x="${pw - 40}" y="79" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="9" font-weight="700" fill="${TEAL}">HIRE</text>

    <!-- Profile block -->
    <circle cx="${pw / 2}" cy="148" r="36" fill="${NAVY}"/>
    <text x="${pw / 2}" y="157" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="28" font-weight="800" fill="${WHITE}">A</text>
    <text x="${pw / 2}" y="208" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" font-weight="800" fill="${TEXT}">Ayesha Khan</text>
    <text x="${pw / 2}" y="228" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" font-weight="500" fill="${MUTED}">Brand Identity Designer</text>

    <!-- Services chips -->
    <g>
      <rect x="${pw / 2 - 110}" y="250" width="68" height="24" rx="12" fill="${TEAL_LIGHT}"/>
      <text x="${pw / 2 - 76}" y="266" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${NAVY}">Branding</text>
      <rect x="${pw / 2 - 35}" y="250" width="60" height="24" rx="12" fill="${TEAL_LIGHT}"/>
      <text x="${pw / 2 - 5}" y="266" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${NAVY}">Logo</text>
      <rect x="${pw / 2 + 32}" y="250" width="72" height="24" rx="12" fill="${TEAL_LIGHT}"/>
      <text x="${pw / 2 + 68}" y="266" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${NAVY}">Web UI</text>
    </g>

    <!-- Work grid label -->
    <text x="32" y="306" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${MUTED}" letter-spacing="1">FEATURED WORK</text>

    <!-- Work grid cards -->
    <g>
      <rect x="28" y="318" width="124" height="90" rx="10" fill="${WHITE}" stroke="${BORDER}"/>
      <rect x="36" y="326" width="108" height="48" rx="6" fill="${NAVY}"/>
      <circle cx="54" cy="350" r="7" fill="${TEAL}"/>
      <rect x="68" y="346" width="60" height="3" rx="1.5" fill="${WHITE}" fill-opacity="0.7"/>
      <rect x="68" y="354" width="40" height="3" rx="1.5" fill="${WHITE}" fill-opacity="0.5"/>
      <rect x="36" y="382" width="70" height="6" rx="2" fill="${TEXT}"/>
      <rect x="36" y="394" width="54" height="4" rx="2" fill="${MUTED}"/>

      <rect x="${pw - 152}" y="318" width="124" height="90" rx="10" fill="${WHITE}" stroke="${BORDER}"/>
      <rect x="${pw - 144}" y="326" width="108" height="48" rx="6" fill="${TEAL}"/>
      <circle cx="${pw - 126}" cy="350" r="7" fill="${WHITE}"/>
      <rect x="${pw - 112}" y="346" width="60" height="3" rx="1.5" fill="${WHITE}" fill-opacity="0.9"/>
      <rect x="${pw - 112}" y="354" width="40" height="3" rx="1.5" fill="${WHITE}" fill-opacity="0.7"/>
      <rect x="${pw - 144}" y="382" width="70" height="6" rx="2" fill="${TEXT}"/>
      <rect x="${pw - 144}" y="394" width="54" height="4" rx="2" fill="${MUTED}"/>
    </g>

    <!-- Second row -->
    <g>
      <rect x="28" y="418" width="124" height="90" rx="10" fill="${WHITE}" stroke="${BORDER}"/>
      <rect x="36" y="426" width="108" height="48" rx="6" fill="#6366F1"/>
      <rect x="36" y="482" width="70" height="6" rx="2" fill="${TEXT}"/>
      <rect x="36" y="494" width="54" height="4" rx="2" fill="${MUTED}"/>

      <rect x="${pw - 152}" y="418" width="124" height="90" rx="10" fill="${WHITE}" stroke="${BORDER}"/>
      <rect x="${pw - 144}" y="426" width="108" height="48" rx="6" fill="${WARNING}"/>
      <rect x="${pw - 144}" y="482" width="70" height="6" rx="2" fill="${TEXT}"/>
      <rect x="${pw - 144}" y="494" width="54" height="4" rx="2" fill="${MUTED}"/>
    </g>

    <!-- Hire Me CTA -->
    <rect x="28" y="520" width="${pw - 56}" height="32" rx="16" fill="${NAVY}"/>
    <text x="${pw / 2}" y="540" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="${WHITE}">Hire Me</text>
  `;
}

// ── Business Card mini-UI (pxem.link page inside phone) ───────────────
function cardScreen(pw, ph) {
  return `
    <!-- Hero gradient header -->
    <defs>
      <linearGradient id="cardHero" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${NAVY}"/>
        <stop offset="100%" stop-color="${TEAL}"/>
      </linearGradient>
    </defs>
    <rect x="12" y="12" width="${pw - 24}" height="180" fill="url(#cardHero)"/>

    <!-- top bar label -->
    <text x="${pw / 2}" y="66" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${WHITE}" fill-opacity="0.8" letter-spacing="1.5">PXEM.LINK/@AYESHA</text>

    <!-- Avatar -->
    <circle cx="${pw / 2}" cy="130" r="40" fill="${WHITE}"/>
    <circle cx="${pw / 2}" cy="130" r="36" fill="${NAVY}"/>
    <text x="${pw / 2}" y="140" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="30" font-weight="800" fill="${WHITE}">A</text>

    <!-- Name + headline (sits just below header) -->
    <text x="${pw / 2}" y="210" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" font-weight="800" fill="${TEXT}">Ayesha Khan</text>
    <text x="${pw / 2}" y="230" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="500" fill="${MUTED}">Brand Designer &amp; Consultant</text>

    <!-- Verified chip -->
    <g transform="translate(${pw / 2 - 34}, 242)">
      <rect width="68" height="20" rx="10" fill="${SUCCESS}" fill-opacity="0.15"/>
      <circle cx="14" cy="10" r="5" fill="${SUCCESS}"/>
      <path d="M 11 10 L 13.5 12.5 L 17 9" stroke="${WHITE}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="40" y="14" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" font-weight="700" fill="${SUCCESS}">Verified</text>
    </g>

    <!-- Link buttons stack -->
    <g transform="translate(28, 280)">
      ${linkButton({ y: 0, label: 'View Portfolio', filled: true })}
      ${linkButton({ y: 48, label: 'Hire &amp; Pay', filled: true, color: SUCCESS })}
      ${linkButton({ y: 96, label: 'Email', filled: false })}
      ${linkButton({ y: 144, label: 'WhatsApp', filled: false })}
      ${linkButton({ y: 192, label: 'LinkedIn', filled: false })}
    </g>

    <!-- QR + powered by footer -->
    <g transform="translate(${pw / 2 - 20}, 530)">
      <rect width="40" height="40" rx="4" fill="${WHITE}" stroke="${BORDER}"/>
      <g transform="translate(4, 4)">
        <rect x="0" y="0" width="9" height="9" fill="${TEXT}"/>
        <rect x="23" y="0" width="9" height="9" fill="${TEXT}"/>
        <rect x="0" y="23" width="9" height="9" fill="${TEXT}"/>
        <rect x="14" y="4" width="3" height="3" fill="${TEXT}"/>
        <rect x="18" y="10" width="3" height="3" fill="${TEXT}"/>
        <rect x="10" y="16" width="3" height="3" fill="${TEXT}"/>
        <rect x="22" y="22" width="3" height="3" fill="${TEXT}"/>
        <rect x="16" y="26" width="3" height="3" fill="${TEXT}"/>
      </g>
    </g>
  `;
}

function linkButton({ y, label, filled = false, color = NAVY }) {
  if (filled) {
    return `
      <g transform="translate(0, ${y})">
        <rect width="264" height="36" rx="18" fill="${color}"/>
        <text x="132" y="23" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="${WHITE}">${label}</text>
      </g>`;
  }
  return `
    <g transform="translate(0, ${y})">
      <rect width="264" height="36" rx="18" fill="${WHITE}" stroke="${BORDER}" stroke-width="1.5"/>
      <text x="132" y="23" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="${TEXT}">${label}</text>
    </g>`;
}

// ── Title + hero composition (everything on the left of the phone) ────
function wrapTitle(title, max = 18) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function buildSvg({ title, tag, screen }) {
  const lines = wrapTitle(title, 16);
  const lineHeight = 58;
  const titleStartY = 240;
  const tspans = lines
    .map((l, i) => `<tspan x="70" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DARK}"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="22%" r="65%">
      <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.32"/>
      <stop offset="55%" stop-color="${TEAL}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="14"/>
    </filter>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${TEAL}" fill-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Payxem wordmark -->
  <g transform="translate(70, 70)">
    <circle cx="0" cy="0" r="16" fill="${TEAL}"/>
    <text x="28" y="6" font-family="-apple-system, sans-serif" font-size="26" font-weight="800" fill="${WHITE}">Payxem</text>
  </g>

  <!-- Category tag -->
  <g transform="translate(70, 120)">
    <rect x="0" y="0" width="${26 + tag.length * 8.8}" height="30" rx="15" fill="${TEAL}" fill-opacity="0.18" stroke="${TEAL}" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="14" y="20" font-family="-apple-system, sans-serif" font-size="12" font-weight="800" fill="${TEAL}" letter-spacing="1.5">${escapeXml(tag.toUpperCase())}</text>
  </g>

  <!-- Title -->
  <text font-family="-apple-system, Segoe UI, sans-serif" font-size="48" font-weight="800" fill="${WHITE}" y="${titleStartY}">
    ${tspans}
  </text>

  <!-- Phone mockup with product screen -->
  ${phoneFrame(screen, { x: 800, y: 45, scale: 0.96 })}

  <!-- Accent bar -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${TEAL}"/>

  <!-- Footer -->
  <text x="70" y="${H - 36}" font-family="-apple-system, sans-serif" font-size="17" font-weight="600" fill="${WHITE}" fill-opacity="0.7">payxem.com</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const CARDS = [
  {
    title: 'Create a Free Portfolio Website',
    tag: 'Portfolio',
    screen: portfolioScreen,
    outName: 'How to Create a Free Portfolio Website with Payxem.jpg',
  },
  {
    title: 'Create a Free Digital Business Card',
    tag: 'Business Card',
    screen: cardScreen,
    outName: 'How to Create a Free Digital Business Card with Payxem.jpg',
  },
];

const outDir = resolve(process.cwd(), 'src/images');

for (const card of CARDS) {
  const svg = buildSvg(card);
  const out = resolve(outDir, card.outName);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(out);
  console.log(`wrote ${card.outName}`);
}
