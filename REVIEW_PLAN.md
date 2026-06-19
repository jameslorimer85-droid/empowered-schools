# Site Review & Audit Plan — Empowered Schools

**Date:** 2026-06-19  
**Stack:** Static HTML5 / CSS3 (5 pages: index, about, services, workshops, contact)

---

## CRITICAL — Fix Immediately

### 1. Broken / Incomplete Text
- **contact.html:452** — Sentence cuts off mid-word:
  > "Tell me a little about your school and where you're ."
  Fix: add the missing words (e.g. "where you're starting from")
- **workshops.html:345** — Sentence missing words before comma:
  > "…planning, feedback, assessment design, parent communication, . These are the tasks…"
  Fix: complete the list item before the period

### 2. Contact Form Uses `mailto:` — Not Reliable
- **contact.html:509–525** — `handleSubmit()` builds a `mailto:` URL and fires `window.location.href`. Many browsers/devices won't open a mail client, so users see "Message sent" but nothing actually sends.
- **Recommendation:** Replace with a proper backend form service (Formspree, Netlify Forms, Basin, etc.)

---

## HIGH PRIORITY — Fix Soon

### 3. No Visible Focus States (Keyboard Accessibility)
- **shared.css** — Interactive elements (nav links, buttons) have `:hover` styles but no `:focus` or `:focus-visible` states.
- Keyboard-only users can't see where they are on the page.
- **Fix:** Add `:focus-visible` outlines to all `a`, `button`, `input`, `select`, `textarea` elements.

### 4. WCAG Colour Contrast Failures
- **index.html:64** — `.hero-a-eyebrow` uses `rgba(255,255,255,0.45)` — likely fails WCAG AA (4.5:1 ratio)
- **index.html:93** — `.hero-a-link` uses `rgba(255,255,255,0.6)` — borderline
- **workshops.html:408** — `.pull-cite` uses `rgba(255,255,255,0.45)`
- **shared.css:382** — `.footer-nav-links a` at `opacity: 0.65`
- **Fix:** Increase opacity to ≥ 0.75 and verify all text with a WCAG contrast checker.

### 5. External Audit Link Missing `target="_blank"`
- **contact.html:437** — `<a href="https://audit.empoweredschools.com.au">` navigates away from the contact page (and the partially-filled form).
- **Fix:** Add `target="_blank" rel="noopener noreferrer"` and an aria-label indicating it opens in a new tab.

### 6. Duplicate JavaScript on Every Page
- **All HTML files** — `toggleMobileNav()` and the scroll listener are copy-pasted into every page's `<script>` block.
- **Fix:** Extract to a single `shared.js` file and link it with `<script src="shared.js" defer></script>`.

---

## MEDIUM PRIORITY — Should Fix

### 7. Plain Email Address Exposed to Bots
- **10+ locations across all pages** — `james@empoweredschools.com.au` appears in `mailto:` links and as visible text, making it trivially harvestable by spam bots.
- **Fix:** Either route contact through the form service (issue #2) or use email obfuscation (CSS/JS reversal technique).

### 8. Inline `onclick` Handlers
- **All HTML files** — e.g. `<button onclick="toggleMobileNav()">`. Inline handlers violate Content Security Policy best practices and make testing harder.
- **Fix:** Once shared.js exists (issue #6), attach via `addEventListener`.

### 9. Excessive Inline Styles
- **services.html:447, 452, 457, 486** and **contact.html:592** — Inline `style=""` attributes for layout and colour.
- **Fix:** Move to named CSS classes in `shared.css`.

### 10. Form Shows "Message Sent" Regardless of Outcome
- **contact.html:402–408** — Success state appears after `handleSubmit()` fires, even if the mailto link fails to open. The fallback "Or email directly:" link further confuses the user about whether the form worked.
- **Fix:** Implement a real submission endpoint; only show success/failure based on actual API response.

### 11. No Client-Side Form Validation Feedback
- **contact.html** — Relies solely on HTML5 `required` attributes. No custom error messages, no field-level feedback, no loading state.
- **Fix:** Add JavaScript validation with visible inline error messages per field.

---

## LOW PRIORITY — Nice to Have

### 12. No Custom 404 Page
- No `404.html` exists. Broken links show default hosting error page.
- **Fix:** Create a branded `404.html` with navigation back to the site.

### 13. No Favicon
- **All HTML files** — No `<link rel="icon">` tag.
- **Fix:** Add `<link rel="icon" href="/favicon.ico">` (or SVG equivalent) to all pages.

### 14. Hardcoded Email in 10+ Places
- If the email address ever changes, every page must be updated manually.
- **Fix:** Define it once in `shared.js` as a constant and render it dynamically, or use a server-side template.

### 15. AI-Generated Placeholder Images Still in `/uploads`
- `Gemini_Generated_Image_eww0ugeww0ugeww0.png` and `Gemini_Generated_Image_pxo77hpxo77hpxo7.png` appear to be test assets.
- **Fix:** Replace with final production images or remove if unused.

### 16. Missing `<meta name="theme-color">`
- **All HTML files** — Browser chrome colour not set for mobile browsers.
- **Fix:** Add `<meta name="theme-color" content="#1C6278">` to `<head>`.

### 17. Hamburger Button Aria Label
- **All HTML files** — `aria-label="Open menu"` could be more descriptive.
- **Fix:** Change to `aria-label="Open navigation menu"`.

### 18. Verify `robots.txt` and `sitemap.xml`
- Both files exist but content wasn't audited in depth.
- **Fix:** Confirm `sitemap.xml` lists all 5 pages with correct `<loc>` and `<lastmod>` values; confirm `robots.txt` permits crawling.

### 19. No CSRF Protection on Forms
- Low risk now (static site / mailto), but important if a real backend is added.
- **Fix:** When integrating a form service, ensure CSRF tokens or equivalent are in place.

### 20. No Security Headers
- No evidence of `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` headers.
- **Fix:** Configure these at the hosting/CDN level (Netlify, Cloudflare, Vercel all support header rules).

---

## Summary

| Priority | Count | Key Themes |
|----------|-------|------------|
| Critical | 2 | Broken text, broken form |
| High | 4 | Accessibility, contrast, duplicate JS, link UX |
| Medium | 5 | Email exposure, inline handlers, form UX |
| Low | 9 | Favicon, 404 page, meta tags, cleanup |

**Total findings: 20**
