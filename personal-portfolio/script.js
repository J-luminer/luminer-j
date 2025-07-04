document.addEventListener("DOMContentLoaded", () => {
  // 🎯 Badge random
  const badges = document.querySelectorAll('.badge');
  const used = new Set();
  badges.forEach(badge => {
    let r;
    do { r = Math.floor(Math.random() * 50) + 1; } while (used.has(r));
    used.add(r);
    badge.classList.add(`badge-${r}`);
  });

  // 📝 Typing Effect
  const texts = ["Joel Brian", "a Civil Engineering Student", "from Indonesia"];
  let i = 0, j = 0, isDeleting = false;
  const typingText = document.getElementById("typing-text");

  function typeEffect() {
    if (!typingText) return;
    const current = texts[i];
    typingText.textContent = isDeleting ? current.substring(0, j--) : current.substring(0, j++);
    if (!isDeleting && j > current.length) isDeleting = true;
    else if (isDeleting && j < 0) {
      isDeleting = false;
      i = (i + 1) % texts.length;
    }
    setTimeout(typeEffect, isDeleting ? 50 : 120);
  }

  if (typingText) typeEffect();

  // 📱 Hamburger Menu
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // 💻 Nonaktif scroll di desktop pada index/contact
  const noScrollPages = ["index.html", "/", "projects.html"];
  const currentPath = window.location.pathname;
  const shouldDisableScroll = noScrollPages.some(page => currentPath.endsWith(page));
  if (window.innerWidth >= 1024 && shouldDisableScroll) {
    document.body.classList.add("desktop-no-scroll");
  }

  // 📬 Form Submit + reCAPTCHA
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const recaptcha = grecaptcha.getResponse();
      if (!recaptcha) {
        status.innerText = "Please complete the reCAPTCHA before submitting.";
        return;
      }

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.innerText = "Thanks for your submission!";
          form.reset();
          grecaptcha.reset();
        } else {
          const result = await response.json();
          status.innerText = result.errors
            ? result.errors.map(e => e.message).join(", ")
            : "Oops! There was a problem submitting your form.";
        }
      } catch {
        status.innerText = "Oops! There was a problem submitting your form.";
      }
    });
  }
});
