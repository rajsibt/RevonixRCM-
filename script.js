/* ═══════════════════════════════════════════════
   REVONIX RCM — script.js
   Full functionality: routing, validation, animations,
   search, counters, FAQ, tabs, toast, mobile menu, etc.
   ═══════════════════════════════════════════════ */

'use strict';

/* ── DATA ── */
const SPECIALTIES = [
  'Acupuncture','Allergy & Immunology','Ambulatory Surgery','Anesthesiology',
  'Behavioral Health','Cardiology','Chiropractor','Critical Care',
  'Dental','Endocrinology','ENT','Family Practice',
  'Gastroenterology','General Surgery','Hospice','Hospitalist',
  'Infectious Disease','Internal Medicine','Interventional Radiology','Neonatology',
  'Nephrology','Neurosurgery','Nursing Home','OB/GYN',
  'Oncology','Optometry','Orthopedics','Ophthalmology',
  'Pain Management','Pathology','Pediatric','Physical Therapy',
  'Podiatry','Preventive Care','Primary Care','Prostheses',
  'Pulmonology','Rheumatology','Sleep Studies','Thoracic Surgery',
  'Urgent Care','Urology','Wound Care','NEMT Billing'
];

/* ═══════════════════════════════════════════════
   DOM READY
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initSpecialtiesGrid();
  populateSpecialtySelects();
  initNavigation();
  initMobileMenu();
  initForms();
  initTabs();
  initCardExpand();
  initFAQ();
  initScrollReveal();
  initScrollBehaviors();
  initCounters();
  initBackToTop();
  initSpecialtySearch();
  initQuoteScrollButton();
});

/* ═══════════════════════════════════════════════
   1. SPECIALTIES GRID
   ═══════════════════════════════════════════════ */
function initSpecialtiesGrid() {
  const grid = document.getElementById('specialties-grid');
  if (!grid) return;
  grid.innerHTML = SPECIALTIES.map(name => `
    <div class="spec-chip" data-name="${name.toLowerCase()}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12l3 3 5-5"/>
      </svg>
      ${name}
    </div>
  `).join('');
}

/* ── Specialty search/filter ── */
function initSpecialtySearch() {
  const input  = document.getElementById('spec-search');
  const clear  = document.getElementById('spec-search-clear');
  const noRes  = document.getElementById('spec-no-results');
  if (!input) return;

  function filterSpecialties(query) {
    const q = query.toLowerCase().trim();
    const chips = document.querySelectorAll('.spec-chip');
    let visible = 0;
    chips.forEach(chip => {
      const match = chip.dataset.name.includes(q);
      chip.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    noRes.classList.toggle('visible', visible === 0 && q.length > 0);
    clear.classList.toggle('visible', q.length > 0);
  }

  input.addEventListener('input', () => filterSpecialties(input.value));
  clear.addEventListener('click', () => {
    input.value = '';
    filterSpecialties('');
    input.focus();
  });
}

/* ═══════════════════════════════════════════════
   2. POPULATE SPECIALTY SELECTS IN FORMS
   ═══════════════════════════════════════════════ */
function populateSpecialtySelects() {
  document.querySelectorAll('select[name="specialty"]').forEach(sel => {
    SPECIALTIES.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
  });
}

/* ═══════════════════════════════════════════════
   3. NAVIGATION / PAGE ROUTING
   ═══════════════════════════════════════════════ */
function initNavigation() {
  // Delegate all data-page clicks
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-page]');
    if (!trigger) return;
    e.preventDefault();
    const page = trigger.dataset.page;
    if (page) navigateTo(page);
  });
}

function navigateTo(pageId) {
  // Pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('active');

  // Nav links
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const activeLink = document.getElementById('nav-' + pageId);
  if (activeLink) activeLink.classList.add('active');

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  closeMobileMenu();

  // Re-init scroll reveal for the new page
  setTimeout(() => {
    initScrollReveal();
    // Trigger counters if navigating to home
    if (pageId === 'home') initCounters();
  }, 50);
}

/* ═══════════════════════════════════════════════
   4. MOBILE MENU
   ═══════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-overlay');
  const navLinks  = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  overlay?.addEventListener('click', closeMobileMenu);

  // Close on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function openMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-overlay');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.classList.add('open');
  hamburger?.setAttribute('aria-expanded', 'true');
  overlay?.classList.add('active');
  navLinks?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobile-overlay');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  overlay?.classList.remove('active');
  navLinks?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════
   5. SCROLL BEHAVIORS (nav shadow, back-to-top)
   ═══════════════════════════════════════════════ */
function initScrollBehaviors() {
  const nav = document.getElementById('main-nav');
  const btt = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 10);
    btt?.classList.toggle('visible', y > 400);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════
   6. BACK TO TOP
   ═══════════════════════════════════════════════ */
function initBackToTop() {
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════
   7. SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.page.active .reveal-up, .page.active .reveal-left, .page.active .reveal-right'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════
   8. STAT COUNTERS
   ═══════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal || '0');
  const duration = 1800;
  const start    = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current  = easeOut(progress) * target;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════
   9. TABS (Services page)
   ═══════════════════════════════════════════════ */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const container = btn.closest('.services-tabs-section');
      if (!container) return;

      // Update buttons
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = container.querySelector(`#tab-${tabId}`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger reveals inside the new panel
        panel.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
          el.classList.remove('visible');
        });
        setTimeout(() => initScrollReveal(), 50);
      }
    });
  });
}

/* ═══════════════════════════════════════════════
   10. CARD EXPAND TOGGLE
   ═══════════════════════════════════════════════ */
function initCardExpand() {
  document.addEventListener('click', e => {
    const toggle = e.target.closest('.card-expand-toggle');
    if (!toggle) return;

    const cardId = toggle.dataset.card;
    const content = document.getElementById('card-' + cardId);
    if (!content) return;

    const isOpen = content.classList.contains('open');
    content.classList.toggle('open', !isOpen);
    toggle.classList.toggle('open', !isOpen);
    toggle.firstChild.textContent = isOpen ? 'Learn more ' : 'Show less ';
  });
}

/* ═══════════════════════════════════════════════
   11. FAQ ACCORDION
   ═══════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item   = toggle.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = toggle.classList.contains('open');

      // Close all others in same list
      const list = toggle.closest('.faq-list');
      list?.querySelectorAll('.faq-toggle').forEach(t => {
        if (t !== toggle) {
          t.classList.remove('open');
          t.closest('.faq-item')?.querySelector('.faq-answer')?.classList.remove('open');
        }
      });

      toggle.classList.toggle('open', !isOpen);
      answer?.classList.toggle('open', !isOpen);
    });
  });
}

/* ═══════════════════════════════════════════════
   12. FORM VALIDATION & SUBMISSION
   ═══════════════════════════════════════════════ */
const VALIDATORS = {
  firstName: (v) => v.trim().length < 2 ? 'Please enter your first name.' : '',
  lastName:  (v) => v.trim().length < 2 ? 'Please enter your last name.' : '',
  clinic:    (v) => v.trim().length < 3 ? 'Please enter your clinic or practice name.' : '',
  specialty: (v) => !v ? 'Please select your specialty.' : '',
  email:     (v) => {
    if (!v.trim()) return 'Please enter your work email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
    return '';
  },
  phone: (v) => {
    if (!v.trim()) return 'Please enter your phone number.';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10) return 'Please enter a valid phone number (10+ digits).';
    return '';
  },
};

function initForms() {
  document.querySelectorAll('.rcm-form').forEach(form => {
    // Live validation on blur
    form.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('has-error')) validateField(field);
        // Phone formatting
        if (field.name === 'phone') formatPhone(field);
      });
    });

    // Submit
    form.addEventListener('submit', handleFormSubmit);
  });
}

function validateField(field) {
  const validator = VALIDATORS[field.name];
  if (!validator) return true;
  const error = validator(field.value);
  showFieldError(field, error);
  return !error;
}

function showFieldError(field, message) {
  const group = field.closest('.form-group');
  const errEl = group?.querySelector('.field-error');
  if (!errEl) return;
  errEl.textContent = message;
  field.classList.toggle('has-error', !!message);
  field.classList.toggle('has-success', !message && field.value.trim().length > 0);
}

function formatPhone(input) {
  let digits = input.value.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7) {
    digits = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  } else if (digits.length >= 4) {
    digits = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  } else if (digits.length >= 1) {
    digits = `(${digits}`;
  }
  input.value = digits;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const formId  = form.dataset.form;
  const btn     = form.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');

  // Validate all required fields
  const fieldsToValidate = ['firstName','lastName','clinic','specialty','email','phone'];
  let isValid = true;
  fieldsToValidate.forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field && !validateField(field)) isValid = false;
  });

  if (!isValid) {
    // Shake the button
    btn.style.animation = 'shake .4s ease';
    setTimeout(() => btn.style.animation = '', 400);
    // Scroll to first error
    const firstError = form.querySelector('.has-error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fix the errors above.', 'error');
    return;
  }

  // Show loading state
  btn.disabled = true;
  btnText.hidden = true;
  spinner.hidden = false;

  // --- REAL API CALL TO FORMSPREE ---
  const formData = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/mvzvbajj", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      showToast("Oops! There was a problem submitting your form.", "error");
      btn.disabled = false;
      btnText.hidden = false;
      spinner.hidden = true;
      return;
    }
  } catch (error) {
    showToast("Network error. Please try again.", "error");
    btn.disabled = false;
    btnText.hidden = false;
    spinner.hidden = true;
    return;
  }
  // --- END API CALL ---

  // Show success state
  btn.disabled = false;
  btnText.hidden = false;
  spinner.hidden = true;

  const panel   = document.getElementById(`${formId}-form-panel`) || form.closest('.form-panel');
  const success = document.getElementById(`${formId}-success`);

  if (panel && success) {
    form.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => {
      form.hidden   = true;
      success.hidden = false;
      success.style.animation = 'fadeSlideIn .4s ease forwards';
    }, 280);
  }

  showToast('Request received! We\'ll be in touch within 24 hours.', 'success');
}

  // Collect form data for console (in production, send to backend)
  const data = collectFormData(form);
  console.log('Form submitted:', formId, data);

  showToast('Request received! We\'ll be in touch within 24 hours.', 'success');
}

function collectFormData(form) {
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = value; });
  return data;
}

function simulateApiCall(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ═══════════════════════════════════════════════
   13. TOAST NOTIFICATIONS
   ═══════════════════════════════════════════════ */
function showToast(message, type = 'success', duration = 4500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1ab5b5" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e05555" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span>${message}</span>
    <span class="toast-close" role="button" aria-label="Close notification">✕</span>
  `;

  container.appendChild(toast);

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  // Auto dismiss
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._timer = timer;
}

function dismissToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.add('fadeout');
  setTimeout(() => toast.remove(), 320);
}

/* ═══════════════════════════════════════════════
   14. QUOTE PAGE SCROLL TO FORM
   ═══════════════════════════════════════════════ */
function initQuoteScrollButton() {
  document.getElementById('scroll-to-quote-form')?.addEventListener('click', () => {
    document.querySelector('#page-quote .form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ═══════════════════════════════════════════════
   15. CSS KEYFRAME: SHAKE (injected)
   ═══════════════════════════════════════════════ */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-6px); }
      40%    { transform: translateX(6px); }
      60%    { transform: translateX(-4px); }
      80%    { transform: translateX(4px); }
    }
    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════
   16. ACCESSIBILITY: keyboard nav for spec chips
   ═══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const target = document.activeElement;
    if (target?.dataset?.page) {
      e.preventDefault();
      navigateTo(target.dataset.page);
    }
  }
});

/* ═══════════════════════════════════════════════
   17. SMOOTH HOVER PARALLAX ON HERO
   ═══════════════════════════════════════════════ */
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const bg   = document.querySelector('.hero-bg');
  if (!hero || !bg) return;
  hero.addEventListener('mousemove', e => {
    const rect  = hero.getBoundingClientRect();
    const cx    = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy    = (e.clientY - rect.top)  / rect.height - 0.5;
    bg.style.transform = `scale(1.06) translate(${cx * 12}px, ${cy * 8}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    bg.style.transform = '';
  });
})();
