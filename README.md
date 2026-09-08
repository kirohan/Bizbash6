# BizBash 6.0 — Official Event Website

A premium detective-themed one-page website concept for **BizBash 6.0**, the signature fresher event of **KUET Career Club**.

> **Tagline:** Every Clue Leads to Strategy.

## Highlights

- Responsive static site with dedicated desktop and mobile layouts
- Detective / investigation-board visual language matching the event campaign
- Live registration deadline countdown
- Official event timeline and rules
- First round and final round guideline sections
- Direct registration CTA and official QR
- Downloadable official rulebook
- User-provided local MP3 soundtrack with a user-controlled play/pause control in the header
- Transparent KUET Career Club logo treatment
- No framework or build step — ready for GitHub Pages

## Run locally

Open `index.html` directly, or run a tiny local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on GitHub Pages

This repo includes a Pages workflow at `.github/workflows/pages.yml`.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. The site will deploy automatically on push to `main`.

## Event information

The website content is based on the official BizBash 6.0 rulebook, including event dates, eligibility, registration fee, round guidelines, payment information, and contact details.

## Credit

**Design & Development Credit: [Bad Time Studio](https://www.facebook.com/BadTimeStudio)**

Event organized by **KUET Career Club**.


## Current committee references

- **President:** Abdur Raheem
- **HR / Contact:** Md. Muhit Islam Munshi Tasbi


## Brand assets

- KCC logo is used with transparency.
- The browser favicon is generated from the KCC emblem.
- Soundtrack file: `assets/bizbash-soundtrack.mp3`.


### Soundtrack autoplay
The bundled soundtrack is configured to request playback automatically on every visit and refresh. Modern browsers can still block audible autoplay; when that happens, the site starts it on the visitor’s first interaction anywhere on the page.


### Soundtrack autoplay note
The page requests audible autoplay immediately. Chrome, Edge, Safari, and mobile browsers may block audible audio on a user's first visit by policy. If that happens, the first click/tap/key interaction anywhere on the page unlocks and starts the soundtrack automatically; the visitor does not need to press the soundtrack button.


V6 updates:
- Removed the visible gradient glow from the evidence-board background in the hero section.
- Aligned the footer slogan with the KUET Career Club logo for a cleaner desktop footer.
