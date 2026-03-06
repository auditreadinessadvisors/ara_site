---FILE: docs/architecture.md---
# Project Architecture

## Overview
- High-performance static site focused on audit readiness and technical accounting advisory.
- Built with a mobile-first, responsive design system using CSS variables and semantic HTML5.
- Multi-language support (English and Spanish) implemented via static page mirrors and a path-mapping logic in JavaScript.
- Dynamic lead generation engine through a 10-question Audit Readiness Assessment using Vanilla JS and Chart.js.
- SEO-optimized with JSON-LD structured data, canonical tags, and hreflang attributes for cross-border discoverability.
- Security-hardened with a comprehensive Content Security Policy (CSP) and security headers.
- Performance-driven architecture using critical CSS, font preloading, and aggressive static asset caching.
- Zero-dependency core (excluding Chart.js for the assessment) to minimize bundle size and maximize speed.

## Repo Map
- `index.html` - Homepage and primary English landing page.
- `about.html`, `contact.html`, `faq.html` - Core service and information pages (EN).
- `services/` - Detailed service pages for specific advisory areas (EN).
- `es/` - Spanish language mirror of the entire site structure.
- `css/style.css` - Global design system, including layout, typography, and UI components.
- `js/main.js` - Global interactions, navigation, and language switching logic.
- `js/assessment.js` - Logic for the English Audit Readiness Assessment (scoring, UI steps, radar chart).
- `js/assessment-es.js` - Logic for the Spanish version of the assessment.
- `_headers` - Security headers and CSP configuration (Cloudflare/Netlify compatible).
- `site.webmanifest` - PWA manifest for mobile installation and branding.
- `sitemap.xml` - XML sitemap for search engine indexing.

## Core Files and Responsibilities
- `index.html`: Entry point for English users; contains primary SEO metadata and JSON-LD Organization schema.
- `js/main.js`: Bootstraps mobile navigation, scroll-reveal animations (IntersectionObserver), and handle language toggling between EN/ES versions.
- `js/assessment.js`: State management for the 10-step assessment; calculates scores across 5 dimensions and renders the radar chart results.
- `js/data.js`: Unknown (How to confirm: Search for this file in the root or `js/` directory; currently the assessment logic is hardcoded into the JS files).
- `js/components.js`: Unknown (How to confirm: Verify if a component-based rendering system exists or if pages are purely static HTML).

## Data and Rendering Flow
Content is primarily delivered through static HTML files for maximum SEO crawlablity.
- **Static Pages**: Hand-coded HTML ensures immediate paint and indexability.
- **Assessment Flow**: User input flows from DOM elements to a state object in `assessment.js`, which then calculates section-specific scores.
- **Results Rendering**: Dynamic results (radar chart and tier-based recommendations) are injected into the DOM after the lead capture gate using Vanilla JS templates and `Chart.js`.
- **Data-Driven Architecture**: Unknown (How to confirm: Check for a centralized data store or component registry if the project scales beyond static HTML).

## Component System
- **Current State**: The project uses a "CSS Component" pattern where UI elements (cards, nav, buttons) are defined in `style.css` and applied via semantic classes in HTML.
- **JavaScript Components**: Unknown (How to confirm: Check for `components.js` or a module-based component system for dynamic UI generation).

## Animation System
- **Current Approach**: Uses standard CSS transitions and a Vanilla JS `IntersectionObserver` (in `main.js`) to trigger `.reveal` animations as elements enter the viewport.
- **GSAP**: Unknown (How to confirm: Search for `gsap` in the codebase or check if it’s loaded via CDN in `index.html`; currently not detected).

## SEO and Metadata System
- **Metatags**: Comprehensive `og:`, `twitter:`, and standard meta tags on every page.
- **Canonicalization**: `link rel="canonical"` points to the absolute URL to prevent duplicate content issues.
- **Hreflang**: Full cross-linking between EN and ES versions (`alternate hreflang`) informs search engines of the relationship between language versions.
- **JSON-LD**: `Organization` schema on homepages; `Service` schema on service pages; `Quiz` (Schema.org) schema on the assessment page; and `FAQPage` schema on the FAQ.
- **Search Hygiene**: `sitemap.xml` for discovery; `robots.txt` for crawler guidance.

## Security and Performance
- **CSP**: Implemented in `_headers`. Restricts script execution to 'self' and whitelisted CDNs (cdnjs, unpkg).
- **Fonts**: Currently uses Google Fonts (`Inter` and `Playfair Display`). Note: The project goal may be self-hosted fonts; check for a `fonts/` directory.
- **Performance**: High Lighthouse scores via 0ms blocking time; critical CSS in `<head>`; deferred non-critical JS (`defer` attribute).
- **Caching**: 1-year immutable caching for `/js/`, `/css/`, and `/images/` defined in `_headers`.

## Common Change Recipes
1. **Adding a new homepage section**: Add semantic HTML to `index.html`, apply `.reveal` class for animation, and define any unique styles in `style.css` variables.
2. **Adding a new service or offer**: Create a new `.html` file in `services/`, update `main.js` `pathMap` for language switching, and add the link to the navigation in `index.html`.
3. **Updating JSON LD schema safely**: Modify the `<script type="application/ld+json">` block in the relevant `.html` file; validate using the Schema Markup Validator.
4. **Adding a new icon via Lucide**: Unknown (How to confirm: Check for Lucide inclusion; current icons use Emojis or static SVGs in `/images/`).
5. **Adding or updating a GSAP animation**: Unknown (How to confirm: Confirm if GSAP is a desired dependency before adding imports).

## Do Not Break
- **CSP Boundaries**: Do not add inline scripts or load from external domains not whitelisted in `_headers`.
- **Language Map**: Ensure all new pages are added to the `pathMap` in `js/main.js` to keep the EN/ES toggle functional.
- **Hreflang Sync**: If a page is added to EN, a corresponding ES page must be created with matching `hreflang` tags.
- **Module Boundaries**: Maintain clean separation between global interactions (`main.js`) and localized logic (`assessment.js`).

---
### Inputs Used:
- Full repository file tree analysis.
- Detailed review of: `index.html`, `js/main.js`, `js/assessment.js`, `js/assessment-es.js`, `README.md`, `_headers`, `site.webmanifest`, `sitemap.xml`, and the `es/` directory structure.
