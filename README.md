# Echonomix PWA — Deployment Notes

> Drop-in static site. No build step. Upload the contents of this folder to the document root of your host (e.g. the `public` folder on most hosts) and it works.

## What's in this package

| Path | Purpose |
|---|---|
| `index.html` | Full single-page PWA — inline CSS + JS, no build required |
| `manifest.json` | PWA manifest — installable on iOS / Android / desktop |
| `sw.js` | Service worker (v1.4.0) — offline caching with smart strategies per asset type |
| `robots.txt` | Allows all 2026 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Amazonbot, Applebot-Extended, Google-Extended, Bytespider, CCBot, etc.) plus Google/Bing/DuckDuckGo |
| `sitemap.xml` | Sitemap with image:image entries and section anchors |
| `llms.txt` | Modern AI-crawler guidance file (2026 best practice) |
| `llms-full.txt` | Comprehensive content dump for AI training and retrieval |
| `og-image.png` | 1200×630 social share card |
| `logo.png` | Master ECHO/NOMIX badge logo |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png` | PWA icons |
| `favicon.ico`, `favicon-16.png`, `favicon-32.png` | Browser favicons |
| `board/board-prototype.jpg` | Board game prototype photo (used in promo strip + sitemap) |
| `story/step-1.jpg` … `step-6.jpg` | Origin story step photo placeholders (replace with your real photos) |

## Deployment

1. Upload **all files** preserving the folder structure to your domain root at `https://blockchain.echonomix.com/`.
2. Make sure the server returns the correct MIME types:
   - `.json` → `application/json`
   - `.txt` → `text/plain; charset=utf-8`
   - `.xml` → `application/xml`
   - `.webmanifest` or `.json` for `manifest.json` → `application/manifest+json` (or just `application/json`)
3. Confirm `https://blockchain.echonomix.com/sw.js` is served from the **root**, not a subdirectory. Service workers can only control URLs at or below their own location.
4. Confirm HTTPS is on. Service workers won't register on plain HTTP.

## Replacing placeholders with real photos

Six story photos in `/story/` are placeholders saying "Photo coming soon." When you have the real ones:

1. Save them as JPEG with these filenames:
   - `step-1.jpg` — Noel + Antminer (Christmas)
   - `step-2.jpg` — Noel + Bitmain box
   - `step-3.jpg` — Antminer hardware
   - `step-4.jpg` — eBay listings (vertical)
   - `step-5.jpg` — eBay seller dashboard ($16,600 / 10 sold)
   - `step-6.jpg` — Coinbase price chart
2. Recommended sizes:
   - Steps 1–3 (data-fit="cover", landscape): 1600×1100 or larger
   - Steps 4–6 (data-fit="contain", portrait): 1600×2000 or larger
3. Upload them to `/story/` overwriting the placeholders. No code changes needed — the HTML already references the right filenames.

## Updating staking APYs

Edit the `COINBASE_STAKING` constant in `index.html` (search for `COINBASE_STAKING = {`):

```js
var COINBASE_STAKING = {
  'ethereum':  { apy: 3.20, lockup: 'Variable',  link: 'https://www.coinbase.com/earn/staking/ethereum' },
  'solana':    { apy: 5.10, lockup: '~3 days',   link: 'https://www.coinbase.com/earn/staking/solana' },
  'cardano':   { apy: 3.50, lockup: 'None',      link: 'https://www.coinbase.com/earn/staking/cardano' },
  'cosmos':    { apy: 12.00,lockup: '21 days',   link: 'https://www.coinbase.com/earn/staking/cosmos' },
  'tezos':     { apy: 5.40, lockup: '~4 days',   link: 'https://www.coinbase.com/earn/staking/tezos' },
  'polkadot':  { apy: 9.50, lockup: '28 days',   link: 'https://www.coinbase.com/earn/staking/polkadot' },
  'algorand':  { apy: 4.30, lockup: 'None',      link: 'https://www.coinbase.com/earn/staking/algorand' }
};
```

After updating, also update the same numbers in `llms-full.txt` (the staking APY table) so AI crawlers see the latest rates.

## Bumping the service worker after edits

Whenever you change `index.html` or any cached asset, edit `sw.js` and bump the version:

```js
const VERSION = 'echonomix-v1.4.1'; // was v1.4.0
```

This forces every existing visitor's browser to discard the old cache and pick up the new files on next page load.

## SEO + AI search hooks already wired in

- **JSON-LD entity graph**: Organization + LocalBusiness + Person (Noel Segui) + WebSite + WebPage + BreadcrumbList + Product (Smart-Board, PreOrder) + FAQPage (12 Q&As) + 3 VideoObject + SpeakableSpecification
- **Voice/AI extraction targets**: `.speakable-summary`, `h1.hero-h`, `.faq-q`, `.faq-a`
- **Visible FAQ section** at `#faq` with 12 questions answered in conversational, AI-citable language
- **TL;DR-style hero facts** list with 4 quick bullets
- **robots.txt allowlist** covers GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, CCBot, Bytespider, cohere-ai, YouBot, MistralAI-User, Diffbot, Meta-ExternalAgent
- **llms.txt + llms-full.txt** at root for modern AI-crawler guidance
- **Sitemap** with image:image entries and section-anchor URLs
- **Geo meta tags** (US-PA, Scranton, lat/lng) for local voice queries (~76% of voice queries are local)
- **Mobile-first viewport**, 100% server-rendered HTML with no client-side hydration of critical content

## Testing

- Lighthouse: should score 95+ across all four pillars (performance / accessibility / best practices / SEO).
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test: https://search.google.com/test/rich-results — should detect Organization, Person, Product, FAQPage, VideoObject, BreadcrumbList, WebSite, WebPage with SpeakableSpecification.
- Schema.org Validator: https://validator.schema.org/

## Contact

Notify list and inquiries: `noel@solarmason.com`

— Echonomix Inc., Scranton PA
