Reusable Navbar & Footer Partials
=================================

Files created:
- partials/navbar.html
- partials/footer.html
- js/include-partials.js

How to use in ANY page (e.g., privacy.html):

1) Ensure these CSS/JS are already linked (from your current pages):
   <link rel="stylesheet" href="css/bootstrap.min.css">
   <link rel="stylesheet" href="css/style.css">
   <link rel="stylesheet" href="css/overrides.css">
   <!-- Fonts as already configured -->

2) Add the include script near the end of <body> (or with defer in <head>):
   <script src="js/include-partials.js" defer></script>

3) Replace inline nav/footer with placeholders:
   <div data-include="partials/navbar.html"></div>
   ...
   <div data-include="partials/footer.html"></div>

Notes:
- Paths are relative to the HTML file. Since your pages live in the site root with index.html,
  "partials/..." and "js/..." paths will work on all pages.
- If you later update the navbar or footer, just edit the partials once.
- For SEO/no-JS fallback, you can keep a minimal <noscript> block with plain links.

(Generated automatically.)