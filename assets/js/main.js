/* =========================
   Patrick Bain Web Services
   main.js
   ========================= */

(function () {
  // Mobile nav toggle
  const toggle = document.querySelector("[data-nav-toggle]");
  const navList = document.querySelector("[data-nav-list]");

  if (toggle && navList) {
    toggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click (mobile)
    navList.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      navList.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  // Active nav highlighting based on current path
  const path = window.location.pathname.replace(/\/+$/, "");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach((link) => {
    try {
      const href = link.getAttribute("href");
      if (!href) return;

      // Normalize relative href to a path-like string
      const testUrl = new URL(href, window.location.href);
      const testPath = testUrl.pathname.replace(/\/+$/, "");

      if (testPath === path) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    } catch {
      // Ignore bad URLs
    }
  });

  // Contact form handling (Formspree)
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = document.querySelector("[data-form-status]");
    const submitBtn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      if (status) {
        status.className = "form-status";
        status.textContent = "";
      }

      try {
        const formData = new FormData(form);

        // Basic honeypot spam check
        const botField = formData.get("company_website");
        if (botField && String(botField).trim().length > 0) {
          throw new Error("Spam detected.");
        }

        const res = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Form submission failed.");
        }

        form.reset();

        if (status) {
          status.classList.add("success");
          status.textContent = "Message sent. I will get back to you as soon as possible.";
        }

        if (submitBtn) {
          submitBtn.textContent = "Sent";
        }
      } catch (err) {
        if (status) {
          status.classList.add("error");
          status.textContent = "Something went wrong. Please email contact@patrickbainweb.com.";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      }
    });
  }
})();
