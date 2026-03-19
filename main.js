/* Ebumnandini Lounge - interaction script */

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove("nav--open");
    navToggle.classList.remove("nav-toggle--open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    nav.classList.add("nav--open");
    navToggle.classList.add("nav-toggle--open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("nav--open");
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("nav--open")) {
      return;
    }

    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeNav();
    }
  });
}

const sectionHeaders = document.querySelectorAll(".section-header");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sectionHeaders.forEach((el) => observer.observe(el));
} else {
  sectionHeaders.forEach((el) => el.classList.add("is-visible"));
}

const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("form-status");
const eventDateInput = contactForm?.querySelector('input[name="date"]');

if (eventDateInput) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  eventDateInput.min = localDate;
}

if (contactForm && formStatus) {
  const setStatus = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = `form-status is-${type}`;
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      setStatus("Please complete all required fields before sending your enquiry.", "error");
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const date = String(formData.get("date")).trim();
    const message = String(formData.get("message")).trim();
    const subject = encodeURIComponent(`Event enquiry from ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Event date: ${date}`,
        "",
        "Event details:",
        message,
      ].join("\n")
    );

    setStatus("Opening your email app with the enquiry details.", "success");
    window.location.href = `mailto:hello@ebumnandini.co.za?subject=${subject}&body=${body}`;
  });
}
