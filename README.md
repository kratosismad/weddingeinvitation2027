# Marc Gio & Christelene — E-Invitation

Open `index.html` in any browser to preview. No build step needed.

## Where to edit
| What | File |
|---|---|
| Wording, sections, names, entourage, timeline rows | `index.html` |
| Colors and fonts (burgundy `#6b0f24`, paper `#f5f5f5`) | top of `css/style.css` (`:root`) |
| Wedding date/time (countdown), RSVP link, map links (QR codes) | `js/config.js` |
| Photos | replace files in `assets/photos/` (or edit the `<img>` tags in the Gallery section) |

## Common edits
- **Change a QR destination:** paste a new link into `js/config.js`. The QR code redraws itself.
  Tip: in Google Maps, open the place > Share > Copy link for the exact pin.
- **Add a section:** copy any `<section>` in `index.html`; use `class="section dark"` (burgundy) or `class="section light"` (#F5F5F5). Add a link in the top nav if wanted.
- **Add a timeline row / photo:** copy an existing `<li>` or `<img>` line.
- **Embed the RSVP form on the page:** in the RSVP section, add an `<iframe>` using the form's "Embed HTML" from Google Forms.

## Put it online (free)
Drag this whole folder onto Vercel, Netlify, or Cloudflare Pages. It is a static site.
