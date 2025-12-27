// Patrick Bain Web Services - Core JS

(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when clicking a link (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Active nav highlighting (fallback when aria-current not hardcoded)
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-nav-link]').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === path) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Formspree AJAX submit (optional progressive enhancement)
  const form = document.querySelector('[data-formspree]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      // If no Formspree action set, let normal submit happen
      const action = form.getAttribute('action');
      if (!action || !action.includes('formspree.io')) return;

      e.preventDefault();

      const status = document.querySelector('[data-form-status]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (res.ok) {
          if (status) {
            status.className = 'notice success';
            status.textContent = 'Message sent. I will get back to you soon.';
          }
          form.reset();
        } else {
          const data = await res.json().catch(() => null);
          const msg = data && data.errors && data.errors[0] && data.errors[0].message
            ? data.errors[0].message
            : 'Something went wrong. Please email me directly.';
          if (status) {
            status.className = 'notice error';
            status.textContent = msg;
          }
        }
      } catch {
        if (status) {
          status.className = 'notice error';
          status.textContent = 'Network error. Please email me directly.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }
})();
