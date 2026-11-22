/*
 * Portfolio interactions
 * - Mobile navigation
 * - Active section link
 * - Contact email copy
 * External libraries are not required.
 */

(function () {
    'use strict';

    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    const copyButtons = document.querySelectorAll('[data-copy-text]');
    const copyFeedback = document.querySelector('.copy-feedback');
    const yearElement = document.getElementById('current-year');
    let feedbackTimer;

    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    function setNavigationOpen(isOpen) {
        if (!navToggle || !siteNav) {
            return;
        }

        siteNav.classList.toggle('is-open', isOpen);
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            setNavigationOpen(!siteNav.classList.contains('is-open'));
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                setNavigationOpen(false);
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setNavigationOpen(false);
            }
        });

        document.addEventListener('click', function (event) {
            if (
                siteNav.classList.contains('is-open') &&
                !siteNav.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                setNavigationOpen(false);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 700) {
                setNavigationOpen(false);
            }
        });
    }

    if ('IntersectionObserver' in window && navLinks.length) {
        const sections = document.querySelectorAll('#work, #about, #contact');
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                const visibleEntry = entries
                    .filter(function (entry) { return entry.isIntersecting; })
                    .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];

                if (!visibleEntry) {
                    return;
                }

                const activeHref = '#' + visibleEntry.target.id;

                navLinks.forEach(function (link) {
                    const active = link.getAttribute('href') === activeHref;
                    link.classList.toggle('is-active', active);

                    if (active) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            },
            {
                rootMargin: '-12% 0px -52% 0px',
                threshold: [0, 0.1, 0.3]
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    async function copyEmail(email) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
            return;
        }

        // Fallback for locally opened HTML files (file://).
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = email;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const didCopy = document.execCommand('copy');
        temporaryInput.remove();

        if (!didCopy) {
            throw new Error('Copy is not available in this environment.');
        }
    }


if (copyButtons.length && copyFeedback) {
    copyButtons.forEach(function (button) {
        button.addEventListener('click', async function () {
            const text = button.dataset.copyText;
            const label = button.dataset.copyLabel;

            copyButtons.forEach(function (item) {
                item.classList.remove('is-copied');
            });

            try {
                await copyEmail(text);

                copyFeedback.textContent = `${label}가 복사되었습니다.`;
                button.classList.add('is-copied');
            } catch (error) {
                copyFeedback.textContent = '복사에 실패했습니다.';
            }

            window.clearTimeout(feedbackTimer);

            feedbackTimer = window.setTimeout(function () {
                copyFeedback.textContent = '';

                copyButtons.forEach(function (item) {
                    item.classList.remove('is-copied');
                });
            }, 2200);
        });
    });
}


    /* =========================================
       경력 기간 자동 계산
       ========================================= */

    // 근무 기간 설정
    const career = {
        current: {
            start: new Date(2025, 1, 17),
            end: new Date()
        },
        intern: {
            start: new Date(2020, 6, 1),
            end: new Date(2020, 7, 26)
        }
    };

    // 두 날짜 사이의 근무 개월 수 계산
    function calculateMonths(start, end, roundPartial = false) {
        let months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        let anniversary = new Date(
            start.getFullYear(),
            start.getMonth() + months,
            start.getDate()
        );

        if (anniversary > end) {
            months--;
            anniversary = new Date(
                start.getFullYear(),
                start.getMonth() + months,
                start.getDate()
            );
        }

        // 단기 인턴은 남은 일수가 반 달 이상이면 올림
        if (roundPartial) {
            const nextAnniversary = new Date(
                start.getFullYear(),
                start.getMonth() + months + 1,
                start.getDate()
            );

            const progress =
                (end - anniversary) /
                (nextAnniversary - anniversary);

            if (progress >= 0.5) {
                months++;
            }
        }

        return Math.max(0, months);
    }

    // 개월 수를 "N년 N개월" 형식으로 변환
    function formatExperience(totalMonths) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        if (years === 0) {
            return `${months}개월`;
        }

        if (months === 0) {
            return `${years}년`;
        }

        return `${years}년 ${months}개월`;
    }

    // 근무 기간 계산
    const currentMonths = calculateMonths(
        career.current.start,
        career.current.end
    );

    const internMonths = calculateMonths(
        career.intern.start,
        career.intern.end,
        true
    );

    const totalMonths = currentMonths + internMonths;

    // HTML 화면에 표시
    const experienceElements = {
        summary: document.getElementById('summary-experience'),
        current: document.getElementById('experience-current'),
        intern: document.getElementById('experience-intern'),
        total: document.getElementById('experience-total')
    };

    if (experienceElements.summary) {
        experienceElements.summary.textContent =
            formatExperience(currentMonths);
    }

    if (experienceElements.current) {
        experienceElements.current.textContent =
            formatExperience(currentMonths);
    }

    if (experienceElements.intern) {
        experienceElements.intern.textContent =
            formatExperience(internMonths);
    }

    if (experienceElements.total) {
        experienceElements.total.textContent =
            formatExperience(totalMonths);
    }

})();


