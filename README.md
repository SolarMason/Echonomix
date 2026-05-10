# Echonomix PWA — Deployment Notes

> Drop-in static site. No build step. Upload the contents of this folder to your domain's document root and it works. Brand identity unified around Coinbase blue (#0052FF) with electric cyan (#00E5FF) as the supporting accent.

## What's in this package

| Path | Purpose |
|---|---|
| `index.html` | Full single-page PWA — inline CSS+JS, Coinbase-blue theme, 8 OG image variants |
| `manifest.json` | PWA manifest — installable on iOS/Android/desktop |
| `sw.js` | Service worker v1.5.0 — caches swipepages CDN images stale-while-revalidate |
| `robots.txt` | Allows every 2026 AI crawler + Google/Bing/DuckDuckGo |
| `sitemap.xml` | Sitemap with 9 image entries (full origin-story photo set + product shots) |
| `llms.txt` + `llms-full.txt` | AI-crawler guidance files (2026 best practice) |
| `og-image.png` | Primary 1200×630 cream business-card share card |
| `logo.png` | Master ECHO/NOMIX badge logo |
| `icon-*.png`, `apple-touch-icon.png`, `favicon.*` | PWA + browser icons |
| `board/board-prototype.jpg` | Board game prototype photo (product shot) |
| `story/step-*.jpg` | Local fallback copies of the 6 origin-story photos |

## Social share image variants (rich link previews)

The page declares **8 `og:image` variants** so social platforms have a full gallery to pull from:

1. **og-image.png** — Primary business card (Facebook/LinkedIn default)
2. **board/board-prototype.jpg** — Patent-pending Smart-Board prototype (product hero)
3. **img_9849-500.jpg** — Step 1: Mining in the Scranton loft
4. **img_9848-500.jpg** — Step 2: Bitmain ASIC miner setup
5. **img_9852-500.jpg** — Step 3: Working miner with LEDs
6. **img_9386-500.png** — Step 4: eBay listings ($1,300–$3,400 per unit)
7. **img_9389-500.png** — Step 5: eBay seller dashboard ($16,600 / 10 sold)
8. **img_9690-500.png** — Step 6: Coinbase Bitcoin price chart

The same 8 images also appear in the JSON-LD Product schema's `image` array and in the sitemap's `image:image` entries — so Google Rich Results, Pinterest Rich Pins, and AI search image previews all have the full gallery.

Twitter / X gets a richer card with custom data labels:
- **Status**: Patent Pending · Pre-Launch
- **Founder**: Noel Segui · Scranton, PA

## Origin story photos

The 6 origin-story photos are **hot-linked directly from your swipepages CDN**:

| Step | URL |
|---|---|
| 1 | `https://echonomixcom.swipepages.media/2020/12/img_9849-500.jpg` |
| 2 | `https://echonomixcom.swipepages.media/2020/12/img_9848-500.jpg` |
| 3 | `https://echonomixcom.swipepages.media/2020/12/img_9852-500.jpg` |
| 4 | `https://echonomixcom.swipepages.media/2020/12/img_9386-500.png` |
| 5 | `https://echonomixcom.swipepages.media/2020/12/img_9389-500.png` |
| 6 | `https://echonomixcom.swipepages.media/2020/12/img_9690-500.png` |

The service worker caches them stale-while-revalidate, so repeat visits and PWA installed mode get instant image loading.

Each `<img>` also has a `data-local-src` attribute pointing to `story/step-N.{jpg,png}` — if you ever want to host these images locally instead, upload them to `/story/` at those paths and swap one line of JS.

## Brand colors

| Token | Hex | Use |
|---|---|---|
| `--brand` / `--gold` | `#0052FF` | Primary CTAs, links, accents |
| `--gold-deep` | `#0038C8` | Hover/active states |
| `--cyan` | `#00E5FF` | Supporting accent for "live" indicators |
| `--cream` | `#F5F7FB` | Body text |
| `--bg` | `#060814` | Page background (rich navy-black) |

The token name `--gold` was preserved across the codebase — its value is now Coinbase blue.

## Deployment

1. Upload all files preserving folder structure to `https://blockchain.echonomix.com/`.
2. Server MIME types:
   - `.json` → `application/json` (or `application/manifest+json` for manifest.json)
   - `.txt` → `text/plain; charset=utf-8`
   - `.xml` → `application/xml`
3. Confirm `sw.js` is served from the root (service workers can only control their own path).
4. HTTPS required for service worker registration.

## Verifying social previews

After deploy, test rich previews:
- **Facebook**: https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fblockchain.echonomix.com%2F (click "Scrape Again" to refresh)
- **Twitter / X**: https://cards-dev.twitter.com/validator (or post a draft tweet with the URL)
- **LinkedIn**: https://www.linkedin.com/post-inspector/?url=https%3A%2F%2Fblockchain.echonomix.com%2F
- **Pinterest**: https://developers.pinterest.com/tools/url-debugger/

Each platform picks 1 image by default (usually the first `og:image`, which is the cream business card). On Facebook share, users see a thumbnail picker with all 8 variants.

## Updating staking APYs

Edit the `COINBASE_STAKING` constant in `index.html`. Also update the same table in `llms-full.txt`.

## Bumping the service worker after edits

Edit `sw.js` and bump the version:

```js
const VERSION = 'echonomix-v1.5.1'; // was v1.5.0
```

## SEO + AI search hooks

- **JSON-LD entity graph**: Organization + LocalBusiness + Person + WebSite + WebPage + BreadcrumbList + Product (PreOrder, 8 images) + FAQPage (12 Q&As) + 3 VideoObject + SpeakableSpecification
- **Voice/AI extraction targets**: `.speakable-summary`, `h1.hero-h`, `.faq-q`, `.faq-a`
- **Visible FAQ section** at `#faq` with 12 conversational Q&As
- **TL;DR-style hero facts** list with 4 quick bullets
- **robots.txt allowlist**: 25 crawlers (GPTBot, ClaudeBot, PerplexityBot, Amazonbot, Applebot-Extended, Google-Extended, etc.)
- **llms.txt + llms-full.txt** at root
- **Sitemap** with 9 image entries
- **Geo meta tags** (US-PA, Scranton, lat/lng) for local voice queries
- **Mobile-first viewport**, 100% server-rendered HTML

## Testing

- Lighthouse: should score 95+ across all pillars.
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

## Contact

`noel@solarmason.com`

— Echonomix Inc., Scranton PA
