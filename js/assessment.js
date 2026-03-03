/* ============================================
   AUDIT READINESS ASSESSMENT — Logic
   10 questions, one-per-screen, conversion-optimized
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('assessment')) return;
    initAssessment();
});

function initAssessment() {
    const TOTAL_QUESTIONS = 10;
    const MAX_SCORE = 50; // 10 questions × 5 max
    const answers = {};
    let currentStep = 0; // 0 = intro

    // Section mapping (which questions belong to which section)
    const sections = [
        {
            name: 'Financial Statement Integrity',
            questions: [1, 2],
            maxScore: 10,
            recommendations: {
                critical: 'Your financial statements may contain material misstatements that auditors will flag. A Financial Statement Diagnostic is strongly recommended.',
                weak: 'Your financial statements may contain material misstatements that auditors will flag. A Financial Statement Diagnostic is recommended.',
                moderate: 'Your financial close process has room for improvement. Targeted remediation could prevent audit delays and costly adjustments.',
                strong: 'Your financial statement processes appear solid. Minor fine-tuning may still be beneficial.'
            }
        },
        {
            name: 'Accounting Standards',
            questions: [3, 4],
            maxScore: 10,
            recommendations: {
                critical: 'Significant gaps in technical accounting compliance create major audit risk. Technical accounting advisory is urgently recommended.',
                weak: 'Gaps in technical accounting compliance create audit risk. Technical accounting advisory is recommended.',
                moderate: 'Some standards adoption gaps exist. A focused review of recent updates would reduce your audit risk.',
                strong: 'Your standards compliance appears robust. Keep your documentation current.'
            }
        },
        {
            name: 'Internal Controls',
            questions: [5, 6],
            maxScore: 10,
            recommendations: {
                critical: 'Your control environment has material weaknesses that auditors will likely identify. Internal controls remediation is urgent.',
                weak: 'Your control environment has gaps that auditors will likely identify. Internal controls strengthening is recommended.',
                moderate: 'Your controls framework needs targeted strengthening. Addressing key gaps now will reduce audit friction.',
                strong: 'Your internal controls environment appears well-designed and documented.'
            }
        },
        {
            name: 'Audit Preparedness',
            questions: [7, 8],
            maxScore: 10,
            recommendations: {
                critical: 'You are not prepared for an external audit. A mock audit would identify and resolve critical issues before auditors arrive.',
                weak: 'Significant audit preparation gaps remain. A mock audit or readiness review would be highly beneficial.',
                moderate: 'You have some preparation but gaps remain. An Audit Readiness Review would close these gaps efficiently.',
                strong: 'You appear well-prepared for an external audit engagement.'
            }
        },
        {
            name: 'Organizational Readiness',
            questions: [9, 10],
            maxScore: 10,
            recommendations: {
                critical: 'Your team lacks the structure and capacity to support an audit efficiently. Organizational preparation is needed before engaging auditors.',
                weak: 'Organizational gaps could significantly slow down audit execution and increase costs.',
                moderate: 'Some organizational gaps could slow audit execution. Pre-audit planning would help.',
                strong: 'Your organization appears well-structured to support an audit.'
            }
        }
    ];

    // Start button
    document.getElementById('start-assessment').addEventListener('click', () => {
        goToStep(1);
    });

    // Option selection — auto-advance after a short delay
    document.querySelectorAll('.assessment__option').forEach(btn => {
        btn.addEventListener('click', function () {
            const optionsContainer = this.closest('.assessment__options');
            const qNum = parseInt(optionsContainer.dataset.question);
            const value = parseInt(this.dataset.value);

            // Deselect siblings and select this one
            optionsContainer.querySelectorAll('.assessment__option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            answers[qNum] = value;

            // Auto-advance after a brief delay so user sees their selection
            setTimeout(() => {
                if (currentStep < TOTAL_QUESTIONS) {
                    goToStep(currentStep + 1);
                } else {
                    showGate();
                }
            }, 400);
        });
    });

    // Keyboard navigation (1-5 keys)
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

    // Gate form submission
    document.getElementById('gate-form').addEventListener('submit', function (e) {
        e.preventDefault();
        submitAndShowResults();
    });

    function goToStep(stepNum) {
        // Hide everything
        hideAll();
        currentStep = stepNum;

        // Show progress
        const progressWrap = document.getElementById('assessment-progress');
        progressWrap.style.display = '';

        // Calculate progress based on answered questions
        const answeredCount = Object.keys(answers).length;
        const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-section').textContent = `Question ${stepNum} of ${TOTAL_QUESTIONS}`;
        document.getElementById('progress-percent').textContent = pct + '%';

        // Show the step
        const step = document.getElementById('step-' + stepNum);
        if (step) {
            step.style.display = '';
            // Trigger animation
            requestAnimationFrame(() => {
                step.classList.add('assessment__fade-in');
            });

            // Restore previous answer
            const optionsContainer = step.querySelector('.assessment__options');
            const qNum = parseInt(optionsContainer.dataset.question);
            if (answers[qNum] !== undefined) {
                optionsContainer.querySelectorAll('.assessment__option').forEach(o => {
                    if (parseInt(o.dataset.value) === answers[qNum]) {
                        o.classList.add('selected');
                    }
                });
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showGate() {
        hideAll();
        currentStep = TOTAL_QUESTIONS + 1;
        document.getElementById('assessment-progress').style.display = 'none';

        // Populate hidden fields
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
            // POST to Formspree or similar
            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch(() => { });
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
                name: 'Audit Ready',
                color: '#22c55e',
                colorLight: 'rgba(34, 197, 94, 0.1)',
                icon: '✓',
                description: 'Your organization shows strong audit readiness. Minor refinements may be needed, but you are well-positioned to engage external auditors with confidence.',
                cta: {
                    text: 'Even audit-ready companies benefit from an independent review. Schedule a consultation to confirm your readiness and identify any blind spots.',
                    buttonText: 'Book a Consultation',
                    buttonLink: 'contact.html'
                }
            };
        } else if (total >= 30) {
            tier = {
                name: 'Approaching Ready',
                color: '#eab308',
                colorLight: 'rgba(234, 179, 8, 0.1)',
                icon: '◐',
                description: 'You have a solid foundation but there are gaps that could lead to audit delays, adjustments, or qualified opinions. A targeted readiness review would eliminate these risks.',
                cta: {
                    text: 'You\'re close, but the gaps we identified could cost you. Let us help you close them before your auditors find them.',
                    buttonText: 'Schedule an Audit Readiness Review',
                    buttonLink: 'contact.html'
                }
            };
        } else if (total >= 20) {
            tier = {
                name: 'Significant Gaps',
                color: '#f97316',
                colorLight: 'rgba(249, 115, 22, 0.1)',
                icon: '⚠',
                description: 'Your organization has material gaps in audit preparedness. Without intervention, you face a high risk of audit surprises, extended timelines, and costly remediation during the audit itself.',
                cta: {
                    text: 'The risks in your current state are real. A structured readiness engagement will save you time, money, and credibility.',
                    buttonText: 'Request a Risk Diagnostic',
                    buttonLink: 'contact.html'
                }
            };
        } else {
            tier = {
                name: 'Not Ready',
                color: '#ef4444',
                colorLight: 'rgba(239, 68, 68, 0.1)',
                icon: '✕',
                description: 'Your organization is not prepared for an external audit. Proceeding without a structured readiness engagement would be high-risk. We strongly recommend a comprehensive mock audit and remediation plan.',
                cta: {
                    text: 'Proceeding to audit in your current state would be high-risk. We strongly recommend a comprehensive mock audit.',
                    buttonText: 'Book an Urgent Consultation',
                    buttonLink: 'contact.html'
                }
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

        // --- Animated score ring ---
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

        // --- Tier badge ---
        document.getElementById('results-tier').innerHTML = `
            <span class="results__tier-badge" style="background:${scores.tier.colorLight}; color:${scores.tier.color}; border: 1px solid ${scores.tier.color};">
                <span class="results__tier-icon">${scores.tier.icon}</span> ${scores.tier.name}
            </span>`;
        document.getElementById('results-tier-desc').textContent = scores.tier.description;

        // --- Section breakdown ---
        const ratingColors = { strong: '#22c55e', moderate: '#eab308', weak: '#f97316', critical: '#ef4444' };
        document.getElementById('results-breakdown').innerHTML = '<h3>Detailed Breakdown</h3>' +
            scores.sectionScores.map(sec => {
                const pct = (sec.score / sec.maxScore) * 100;
                const color = ratingColors[sec.rating];
                const label = sec.rating.charAt(0).toUpperCase() + sec.rating.slice(1);
                return `
                <div class="results__section-item">
                    <div class="results__section-header">
                        <span class="results__section-name">${sec.name}</span>
                        <span class="results__section-score" style="color:${color}">${sec.score}/${sec.maxScore}</span>
                    </div>
                    <div class="results__section-bar">
                        <div class="results__section-fill" style="width:${pct}%; background:${color};"></div>
                    </div>
                    <div class="results__section-meta">
                        <span class="results__section-rating" style="color:${color}">${label}</span>
                        <p class="results__section-rec">${sec.recommendation}</p>
                    </div>
                </div>`;
            }).join('');

        // --- Radar chart ---
        renderRadarChart(scores);

        // --- Tier-specific CTA ---
        document.getElementById('results-cta').innerHTML = `
            <div class="results__cta-box" style="border-color:${scores.tier.color};">
                <h3>What's Next?</h3>
                <p>${scores.tier.cta.text}</p>
                <a href="${scores.tier.cta.buttonLink}" class="btn btn--primary btn--lg">${scores.tier.cta.buttonText} <span class="btn__arrow">→</span></a>
            </div>`;

        // --- LinkedIn share ---
        const shareLink = document.getElementById('share-linkedin');
        if (shareLink) {
            shareLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://auditreadinessadvisors.com/assessment.html')}`;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderRadarChart(scores) {
        const ctx = document.getElementById('radar-chart');
        if (!ctx) return;
        if (typeof Chart === 'undefined') {
            setTimeout(() => renderRadarChart(scores), 200);
            return;
        }

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: scores.sectionScores.map(s => s.name),
                datasets: [{
                    label: 'Your Score',
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
                        beginAtZero: true,
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2,
                            color: '#5A6374',
                            backdropColor: 'transparent',
                            font: { size: 11, family: "'Inter', sans-serif" }
                        },
                        grid: { color: 'rgba(11, 29, 58, 0.06)' },
                        angleLines: { color: 'rgba(11, 29, 58, 0.06)' },
                        pointLabels: {
                            color: '#0B1D3A',
                            font: { size: 12, family: "'Inter', sans-serif", weight: '600' },
                            padding: 18
                        }
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
