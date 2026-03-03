/* ============================================
   EVALUACIÓN DE PREPARACIÓN — Lógica (Español)
   10 preguntas, una por pantalla, optimizada para conversión
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('assessment')) return;
    initAssessment();
});

function initAssessment() {
    const TOTAL_QUESTIONS = 10;
    const MAX_SCORE = 50;
    const answers = {};
    let currentStep = 0;

    const sections = [
        {
            name: 'Integridad de Estados Financieros',
            questions: [1, 2],
            maxScore: 10,
            recommendations: {
                critical: 'Tus estados financieros pueden contener errores materiales que los auditores señalarán. Se recomienda urgentemente un Diagnóstico de Estados Financieros.',
                weak: 'Tus estados financieros pueden contener errores materiales. Un Diagnóstico de Estados Financieros es recomendable.',
                moderate: 'Tu proceso de cierre financiero tiene espacio para mejorar. La remediación dirigida podría prevenir retrasos en la auditoría.',
                strong: 'Tus procesos de estados financieros parecen sólidos. Un ajuste fino menor podría ser beneficioso.'
            }
        },
        {
            name: 'Normas Contables',
            questions: [3, 4],
            maxScore: 10,
            recommendations: {
                critical: 'Brechas significativas en cumplimiento técnico contable crean riesgo de auditoría importante. Se recomienda urgentemente asesoría técnica contable.',
                weak: 'Brechas en cumplimiento técnico contable crean riesgo de auditoría. Se recomienda asesoría técnica contable.',
                moderate: 'Existen algunas brechas en adopción de estándares. Una revisión enfocada de actualizaciones recientes reduciría tu riesgo.',
                strong: 'Tu cumplimiento de normas parece robusto. Mantén tu documentación actualizada.'
            }
        },
        {
            name: 'Controles Internos',
            questions: [5, 6],
            maxScore: 10,
            recommendations: {
                critical: 'Tu ambiente de control tiene debilidades materiales que los auditores probablemente identificarán. La remediación de controles internos es urgente.',
                weak: 'Tu ambiente de control tiene brechas que los auditores probablemente identificarán. Se recomienda fortalecer los controles internos.',
                moderate: 'Tu marco de controles necesita fortalecimiento dirigido. Abordar brechas clave ahora reducirá la fricción de auditoría.',
                strong: 'Tu ambiente de controles internos parece bien diseñado y documentado.'
            }
        },
        {
            name: 'Preparación para Auditoría',
            questions: [7, 8],
            maxScore: 10,
            recommendations: {
                critical: 'No estás preparado para una auditoría externa. Una auditoría simulada identificaría y resolvería problemas críticos antes de que lleguen los auditores.',
                weak: 'Quedan brechas significativas de preparación para auditoría. Una auditoría simulada o revisión de preparación sería muy beneficiosa.',
                moderate: 'Tienes algo de preparación pero quedan brechas. Una Revisión de Preparación para Auditoría las cerraría eficientemente.',
                strong: 'Pareces bien preparado para un engagement de auditoría externa.'
            }
        },
        {
            name: 'Preparación Organizacional',
            questions: [9, 10],
            maxScore: 10,
            recommendations: {
                critical: 'Tu equipo carece de la estructura y capacidad para apoyar una auditoría eficientemente. Se necesita preparación organizacional antes de contratar auditores.',
                weak: 'Las brechas organizacionales podrían desacelerar significativamente la ejecución de la auditoría y aumentar costos.',
                moderate: 'Algunas brechas organizacionales podrían desacelerar la ejecución de la auditoría. La planificación previa ayudaría.',
                strong: 'Tu organización parece bien estructurada para apoyar una auditoría.'
            }
        }
    ];

    document.getElementById('start-assessment').addEventListener('click', () => goToStep(1));

    document.querySelectorAll('.assessment__option').forEach(btn => {
        btn.addEventListener('click', function () {
            const optionsContainer = this.closest('.assessment__options');
            const qNum = parseInt(optionsContainer.dataset.question);
            const value = parseInt(this.dataset.value);

            optionsContainer.querySelectorAll('.assessment__option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            answers[qNum] = value;

            setTimeout(() => {
                if (currentStep < TOTAL_QUESTIONS) goToStep(currentStep + 1);
                else showGate();
            }, 400);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (currentStep < 1 || currentStep > TOTAL_QUESTIONS) return;
        const key = parseInt(e.key);
        if (key >= 1 && key <= 5) {
            const step = document.getElementById('step-' + currentStep);
            if (!step || step.style.display === 'none') return;
            const option = step.querySelector(`.assessment__option[data-value="${key}"]`);
            if (option) option.click();
        }
    });

    document.getElementById('gate-form').addEventListener('submit', function (e) {
        e.preventDefault();
        submitAndShowResults();
    });

    function goToStep(stepNum) {
        hideAll();
        currentStep = stepNum;

        const progressWrap = document.getElementById('assessment-progress');
        progressWrap.style.display = '';

        const answeredCount = Object.keys(answers).length;
        const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-section').textContent = `Pregunta ${stepNum} de ${TOTAL_QUESTIONS}`;
        document.getElementById('progress-percent').textContent = pct + '%';

        const step = document.getElementById('step-' + stepNum);
        if (step) {
            step.style.display = '';
            requestAnimationFrame(() => step.classList.add('assessment__fade-in'));

            const optionsContainer = step.querySelector('.assessment__options');
            const qNum = parseInt(optionsContainer.dataset.question);
            if (answers[qNum] !== undefined) {
                optionsContainer.querySelectorAll('.assessment__option').forEach(o => {
                    if (parseInt(o.dataset.value) === answers[qNum]) o.classList.add('selected');
                });
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showGate() {
        hideAll();
        currentStep = TOTAL_QUESTIONS + 1;
        document.getElementById('assessment-progress').style.display = 'none';

        const scores = calculateScores();
        document.getElementById('gate-score').value = scores.total;
        document.getElementById('gate-tier').value = scores.tier.name;
        document.getElementById('gate-section-scores').value = JSON.stringify(scores.sectionScores);
        document.getElementById('gate-answers').value = JSON.stringify(answers);

        const gate = document.getElementById('assessment-gate');
        gate.style.display = '';
        requestAnimationFrame(() => gate.classList.add('assessment__fade-in'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function submitAndShowResults() {
        const formData = new FormData(document.getElementById('gate-form'));
        const formAction = document.getElementById('gate-form').getAttribute('action');
        if (formAction && formAction !== '#') {
            fetch(formAction, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } }).catch(() => { });
        }
        showResults();
    }

    function calculateScores() {
        let total = 0;
        const sectionScores = sections.map(sec => {
            const score = sec.questions.reduce((sum, q) => sum + (answers[q] || 1), 0);
            total += score;
            let rating;
            if (score >= 8) rating = 'strong';
            else if (score >= 6) rating = 'moderate';
            else if (score >= 4) rating = 'weak';
            else rating = 'critical';
            return { name: sec.name, score, maxScore: sec.maxScore, rating, recommendation: sec.recommendations[rating] };
        });

        let tier;
        if (total >= 40) {
            tier = {
                name: 'Listo para Auditoría', color: '#22c55e', colorLight: 'rgba(34,197,94,0.1)', icon: '✓',
                description: 'Tu organización muestra una fuerte preparación para auditoría. Pueden necesitarse ajustes menores, pero estás bien posicionado para comprometer auditores externos con confianza.',
                cta: { text: 'Incluso las empresas listas para auditoría se benefician de una revisión independiente. Agenda una consulta para confirmar tu preparación.', buttonText: 'Agendar una Consulta', buttonLink: 'contacto.html' }
            };
        } else if (total >= 30) {
            tier = {
                name: 'Casi Listo', color: '#eab308', colorLight: 'rgba(234,179,8,0.1)', icon: '◐',
                description: 'Tienes una base sólida pero hay brechas que podrían llevar a retrasos en la auditoría, ajustes o opiniones calificadas. Una revisión de preparación dirigida eliminaría estos riesgos.',
                cta: { text: 'Estás cerca, pero las brechas que identificamos podrían costarte. Déjanos ayudarte a cerrarlas antes de que tus auditores las encuentren.', buttonText: 'Agendar Revisión de Preparación', buttonLink: 'contacto.html' }
            };
        } else if (total >= 20) {
            tier = {
                name: 'Brechas Significativas', color: '#f97316', colorLight: 'rgba(249,115,22,0.1)', icon: '⚠',
                description: 'Tu organización tiene brechas materiales en preparación para auditoría. Sin intervención, enfrentas alto riesgo de sorpresas en la auditoría, cronogramas extendidos y remediación costosa durante la auditoría misma.',
                cta: { text: 'Los riesgos en tu estado actual son reales. Un engagement de preparación estructurado te ahorrará tiempo, dinero y credibilidad.', buttonText: 'Solicitar Diagnóstico de Riesgo', buttonLink: 'contacto.html' }
            };
        } else {
            tier = {
                name: 'No Preparado', color: '#ef4444', colorLight: 'rgba(239,68,68,0.1)', icon: '✕',
                description: 'Tu organización no está preparada para una auditoría externa. Proceder sin un engagement de preparación estructurado sería de alto riesgo. Recomendamos fuertemente una auditoría simulada comprehensiva.',
                cta: { text: 'Proceder a auditoría en tu estado actual sería alto riesgo. Recomendamos fuertemente una auditoría simulada comprehensiva.', buttonText: 'Agendar Consulta Urgente', buttonLink: 'contacto.html' }
            };
        }
        return { total, maxScore: MAX_SCORE, sectionScores, tier };
    }

    function showResults() {
        hideAll();
        currentStep = TOTAL_QUESTIONS + 2;
        document.getElementById('assessment-progress').style.display = 'none';

        const results = document.getElementById('assessment-results');
        results.style.display = '';
        requestAnimationFrame(() => results.classList.add('assessment__fade-in'));

        const scores = calculateScores();
        const scoreRing = document.getElementById('score-ring');
        const scoreNumber = document.getElementById('score-number');
        const circumference = 2 * Math.PI * 88;
        scoreRing.style.stroke = scores.tier.color;

        let currentScore = 0;
        const duration = 1500;
        const startTime = performance.now();
        function animateScore(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            currentScore = Math.round(eased * scores.total);
            scoreNumber.textContent = currentScore;
            const offset = circumference - (eased * scores.total / scores.maxScore) * circumference;
            scoreRing.setAttribute('stroke-dashoffset', offset);
            if (progress < 1) requestAnimationFrame(animateScore);
        }
        requestAnimationFrame(animateScore);

        document.getElementById('results-tier').innerHTML = `<span class="results__tier-badge" style="background:${scores.tier.colorLight}; color:${scores.tier.color}; border: 1px solid ${scores.tier.color};"><span class="results__tier-icon">${scores.tier.icon}</span> ${scores.tier.name}</span>`;
        document.getElementById('results-tier-desc').textContent = scores.tier.description;

        const ratingColors = { strong: '#22c55e', moderate: '#eab308', weak: '#f97316', critical: '#ef4444' };
        const ratingLabels = { strong: 'Fuerte', moderate: 'Moderado', weak: 'Débil', critical: 'Crítico' };
        document.getElementById('results-breakdown').innerHTML = '<h3>Desglose Detallado</h3>' +
            scores.sectionScores.map(sec => {
                const pct = (sec.score / sec.maxScore) * 100;
                const color = ratingColors[sec.rating];
                return `<div class="results__section-item"><div class="results__section-header"><span class="results__section-name">${sec.name}</span><span class="results__section-score" style="color:${color}">${sec.score}/${sec.maxScore}</span></div><div class="results__section-bar"><div class="results__section-fill" style="width:${pct}%; background:${color};"></div></div><div class="results__section-meta"><span class="results__section-rating" style="color:${color}">${ratingLabels[sec.rating]}</span><p class="results__section-rec">${sec.recommendation}</p></div></div>`;
            }).join('');

        renderRadarChart(scores);

        document.getElementById('results-cta').innerHTML = `<div class="results__cta-box" style="border-color:${scores.tier.color};"><h3>¿Qué Sigue?</h3><p>${scores.tier.cta.text}</p><a href="${scores.tier.cta.buttonLink}" class="btn btn--primary btn--lg">${scores.tier.cta.buttonText} <span class="btn__arrow">→</span></a></div>`;

        const shareLink = document.getElementById('share-linkedin');
        if (shareLink) shareLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://auditreadinessadvisors.com/es/evaluacion.html')}`;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderRadarChart(scores) {
        const ctx = document.getElementById('radar-chart');
        if (!ctx) return;
        if (typeof Chart === 'undefined') { setTimeout(() => renderRadarChart(scores), 200); return; }

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: scores.sectionScores.map(s => s.name),
                datasets: [{
                    label: 'Tu Puntaje',
                    data: scores.sectionScores.map(s => s.score),
                    fill: true,
                    backgroundColor: 'rgba(201, 168, 76, 0.15)',
                    borderColor: '#C9A84C',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#C9A84C',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true, min: 0, max: 10,
                        ticks: { stepSize: 2, color: '#5A6374', backdropColor: 'transparent', font: { size: 11, family: "'Inter', sans-serif" } },
                        grid: { color: 'rgba(11, 29, 58, 0.06)' },
                        angleLines: { color: 'rgba(11, 29, 58, 0.06)' },
                        pointLabels: { color: '#0B1D3A', font: { size: 11, family: "'Inter', sans-serif", weight: '600' }, padding: 18 }
                    }
                },
                plugins: { legend: { display: false } },
                animation: { duration: 1200, easing: 'easeOutQuart' }
            }
        });
    }

    function hideAll() {
        ['assessment-intro', 'assessment-gate', 'assessment-results'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.classList.remove('assessment__fade-in'); }
        });
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            const step = document.getElementById('step-' + i);
            if (step) { step.style.display = 'none'; step.classList.remove('assessment__fade-in'); }
        }
    }
}
