# Audit Readiness Advisors

Professional audit readiness advisory firm website — Big Four grade audit preparation, mock audits, GAAP/IFRS/NIIF technical accounting advisory, and internal controls consulting.

## 🚀 Quick Start

This is a static HTML/CSS/JS website. No build step required.

1. Clone the repository
2. Open `index.html` in your browser
3. Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

### GitHub Pages Deployment

```bash
git add .
git commit -m "Initial website"
git push origin main
```

Then enable GitHub Pages in your repository settings (Settings → Pages → Source: main branch).

## 📁 Site Structure

```
/
├── index.html                          Homepage (EN)
├── about.html                          About Page (EN)
├── contact.html                        Contact / Book a Meeting (EN)
├── faq.html                            FAQ (EN) — 14 questions, Schema.org FAQPage
├── services/
│   ├── audit-readiness.html            Audit Readiness Reviews & Mock Audits
│   ├── financial-diagnostics.html      Financial Statement Diagnostics
│   ├── gaap-ifrs-advisory.html         GAAP, IFRS & NIIF Advisory
│   └── internal-controls.html          Internal Controls & Financial Reporting
├── es/                                 Spanish mirror (Colombian/LatAm)
│   ├── index.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── preguntas-frecuentes.html
│   └── servicios/
│       ├── preparacion-auditoria.html
│       ├── diagnostico-financiero.html
│       ├── asesoria-gaap-ifrs-niif.html
│       └── controles-internos.html
├── css/style.css                       Design system
├── js/main.js                          Interactions & language toggle
├── sitemap.xml                         XML sitemap (16 pages)
└── robots.txt                          Crawler rules
```

## 🎨 Design

- **Palette**: Deep navy (#0B1D3A) + gold (#C9A84C) + white
- **Typography**: Playfair Display (headings) + Inter (body) via Google Fonts
- **Animations**: Scroll-reveal, hover transitions, gradient effects
- **Responsive**: Mobile-first with breakpoints at 480px, 768px, 1024px

## 🔍 SEO Features

- Title tags & meta descriptions on every page
- Schema.org structured data (Organization, Service, FAQPage)
- `hreflang` tags for EN/ES cross-linking
- Open Graph & Twitter Card meta tags
- XML sitemap with language alternates
- FAQ section structured for Google featured snippets
- Semantic HTML5 with proper heading hierarchy

## 🌐 Bilingual

Full English/Spanish support with language toggle button in the navigation. Spanish content is localized for Colombian/LatAm audiences with NIIF-specific terminology.

## 📧 Lead Generation

- Contact form with role selection and service interest
- Calendly integration placeholder
- CTAs on every page driving to consultation booking
- Email capture through the contact form

## 🔧 Customization

- **Domain**: Replace `auditreadinessadvisors.com` in all canonical URLs, sitemap, and robots.txt
- **Calendly**: Replace the Calendly placeholder link in `contact.html` and `es/contacto.html`
- **Form backend**: Connect the contact form to your preferred form handler (Formspree, Netlify Forms, etc.)
- **Analytics**: Add Google Analytics or similar tracking code to each page's `<head>`
