/* ============================================
   AUDIT READINESS ADVISORS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollReveal();
    initFAQAccordion();
    initSmoothScroll();
    initNavScroll();
});

/* --- Mobile Navigation --- */
function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        if (links.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu on link click
    links.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* --- FAQ Accordion --- */
function initFAQAccordion() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            items.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* --- Nav background on scroll --- */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(7, 15, 30, 0.98)';
        } else {
            nav.style.background = 'rgba(11, 29, 58, 0.95)';
        }
    });
}

/* --- Language Toggle --- */
function switchLanguage(targetLang) {
    const currentPath = window.location.pathname;
    let newPath;

    if (targetLang === 'es') {
        // Switch to Spanish
        if (currentPath.includes('/es/')) return; // Already on Spanish
        if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
            newPath = currentPath.replace(/\/?(?:index\.html)?$/, '') + '/es/index.html';
        } else {
            // Map English paths to Spanish paths
            const pathMap = {
                '/about.html': '/es/nosotros.html',
                '/contact.html': '/es/contacto.html',
                '/faq.html': '/es/preguntas-frecuentes.html',
                '/assessment.html': '/es/evaluacion.html',
                '/services/audit-readiness.html': '/es/servicios/preparacion-auditoria.html',
                '/services/financial-diagnostics.html': '/es/servicios/diagnostico-financiero.html',
                '/services/gaap-ifrs-advisory.html': '/es/servicios/asesoria-gaap-ifrs-niif.html',
                '/services/internal-controls.html': '/es/servicios/controles-internos.html'
            };
            // Find matching path
            for (const [en, es] of Object.entries(pathMap)) {
                if (currentPath.endsWith(en)) {
                    newPath = currentPath.replace(en, es);
                    break;
                }
            }
            if (!newPath) newPath = currentPath.replace(/\/([^/]+)$/, '/es/$1');
        }
    } else {
        // Switch to English
        if (!currentPath.includes('/es/')) return; // Already on English
        if (currentPath.endsWith('/es/') || currentPath.endsWith('/es/index.html')) {
            newPath = currentPath.replace(/\/es\/?(?:index\.html)?$/, '/index.html');
        } else {
            const pathMap = {
                '/es/nosotros.html': '/about.html',
                '/es/contacto.html': '/contact.html',
                '/es/preguntas-frecuentes.html': '/faq.html',
                '/es/evaluacion.html': '/assessment.html',
                '/es/servicios/preparacion-auditoria.html': '/services/audit-readiness.html',
                '/es/servicios/diagnostico-financiero.html': '/services/financial-diagnostics.html',
                '/es/servicios/asesoria-gaap-ifrs-niif.html': '/services/gaap-ifrs-advisory.html',
                '/es/servicios/controles-internos.html': '/services/internal-controls.html'
            };
            for (const [es, en] of Object.entries(pathMap)) {
                if (currentPath.endsWith(es)) {
                    newPath = currentPath.replace(es, en);
                    break;
                }
            }
            if (!newPath) newPath = currentPath.replace('/es/', '/');
        }
    }

    if (newPath) {
        window.location.href = newPath;
    }
}
