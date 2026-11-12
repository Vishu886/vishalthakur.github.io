const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Scroll reveal
const revealObs = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add("visible");
      revealObs.unobserve(en.target);
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// Active nav indicator
const links = [...document.querySelectorAll("[data-nav]")];
const targets = links
  .map((a) => document.getElementById(a.dataset.nav))
  .filter(Boolean);
const navObs = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle("active", a.dataset.nav === en.target.id));
    }
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
targets.forEach((t) => navObs.observe(t));

// Missing photos -> hide <img> so the placeholder shows through
document.querySelectorAll("img").forEach((img) => {
  const hide = () => (img.style.display = "none");
  if (img.complete && img.naturalWidth === 0) hide();
  else img.addEventListener("error", hide);
});

// Hero image parallax (subtle)
const heroImg = document.querySelector(".hero-frame");
if (heroImg && !reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const y = Math.min(window.scrollY, 800);
      heroImg.style.transform = `translateY(${y * 0.06}px)`;
    },
    { passive: true }
  );
}

// Soft drifting particles in the hero
const canvas = document.getElementById("particles");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  let w, h, dots, raf;
  const init = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.round((w * h) / 22000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.15,
    }));
  };
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,184,167,${d.a})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  init();
  tick();
  window.addEventListener("resize", init);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });
}
