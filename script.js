// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation toggle
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Scroll-reveal animation + skill meter fill
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("visible");
      const meter = entry.target.querySelector(".meter");
      if (meter) {
        meter.style.setProperty("--level", `${meter.dataset.level || 80}%`);
        meter.classList.add("filled");
      }
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Photos: if a picture file is missing from the images folder, hide it
// so the built-in artwork or placeholder shows instead. As soon as you
// add the file (e.g. images/my-photo.jpg), it appears automatically.
document.querySelectorAll(".project-photo, .profile-photo").forEach((img) => {
  const markMissing = () => {
    img.style.display = "none";
    const frame = img.closest(".profile-frame");
    if (frame) frame.classList.add("no-photo");
  };
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
  } else {
    img.addEventListener("error", markMissing);
  }
});
