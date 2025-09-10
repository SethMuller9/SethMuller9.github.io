
# New Pathways – Advanced Performance Optimizations

This build includes:
- Critical CSS inlined for first paint
- CSS preloads for faster style discovery
- Defer for JS, lazy/async image decoding (from previous build)
- Sample caching configs: .htaccess and nginx.example.conf

## Optional: Self‑Host Fonts (Recommended)
1) Download WOFF2 files for your fonts (Playfair Display; Helvetica Neue substitute: Inter or Helvetica Now).
   - Place them in: `assets/fonts/`
2) Add this to the **top** of your main CSS (e.g., css/style.css):

@font-face {
  font-family: "Playfair Display";
  src: url("../assets/fonts/PlayfairDisplay.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Helvetica Neue Local";
  src: url("../assets/fonts/Inter-Variable.woff2") format("woff2");
  font-weight: 300 800;
  font-style: normal;
  font-display: swap;
}

:root {
  --heading-font: "Playfair Display", Georgia, serif;
  --body-font: "Helvetica Neue Local", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
body { font-family: var(--body-font); }
h1,h2,h3 { font-family: var(--heading-font); }

3) Remove the external <link> tags for Google Fonts and cdnfonts, then ensure your CSS applies the new families.

## Optional: Add explicit width/height to images
For each <img>, specify its intrinsic size to avoid layout shift, e.g.:
<img src="/images/hero.jpg" width="1920" height="1080" alt="...">
If you don't know sizes, you can run an image-dimension script or export consistent sizes (e.g., 1200x800 for cards).

## Notes
- Preloads are added for all stylesheets found in <head>.
- Keep the CSS small; consider minifying css/style.css and css/overrides.css.
