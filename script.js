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

// Videos: play only while visible (saves battery/data); show controls if reduced motion
const vids = document.querySelectorAll("video.lazy-vid");
if (reduceMotion) {
  vids.forEach((v) => { v.controls = true; v.preload = "metadata"; });
} else {
  const vidObs = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) en.target.play().catch(() => {});
        else en.target.pause();
      }
    },
    { threshold: 0.25 }
  );
  vids.forEach((v) => vidObs.observe(v));
}

// Spatial hero: depth-map parallax in WebGL (falls back to the plain image)
(function () {
  const img = document.getElementById("hero-img");
  const canvas = document.getElementById("hero-spatial");
  if (!img || !canvas) return;
  const frame = img.closest(".hero-frame");
  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) return;

  const vs = "attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
  const fs = `precision mediump float;
varying vec2 uv;uniform sampler2D c,d;uniform vec2 m;
void main(){
  float z=texture2D(d,uv).r;
  vec2 o=m*(z-.45)*.045;
  gl_FragColor=texture2D(c,uv+o*vec2(1.,1.));
}`;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return;
  const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = (unit, image) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const depth = new Image();
  const start = () => {
    tex(0, img); tex(1, depth);
    gl.uniform1i(gl.getUniformLocation(pr, "c"), 0);
    gl.uniform1i(gl.getUniformLocation(pr, "d"), 1);
    const um = gl.getUniformLocation(pr, "m");
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = frame.clientWidth * dpr; canvas.height = frame.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    size(); window.addEventListener("resize", () => { size(); draw(); });
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, last = 0;
    const draw = () => { gl.uniform2f(um, cx, cy); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
    frame.classList.add("spatial");
    draw();
    if (reduceMotion) return;
    const aim = (x, y) => { tx = x; ty = y; };
    window.addEventListener("pointermove", (e) => {
      const r = frame.getBoundingClientRect();
      aim(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2);
    }, { passive: true });
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      aim(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 50) / 25)));
    }, { passive: true });
    const tick = (t) => {
      // gentle idle sway when the pointer is not guiding it
      const idle = t - last > 3000;
      const gx = idle ? Math.sin(t / 1800) * .5 : tx, gy = idle ? Math.cos(t / 2300) * .25 : ty;
      cx += (gx - cx) * .08; cy += (gy - cy) * .08;
      draw(); raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", () => (last = performance.now()), { passive: true });
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) raf = requestAnimationFrame(tick); else cancelAnimationFrame(raf);
    });
    io.observe(frame);
  };
  let ready = 0;
  const go = () => { if (++ready === 2) { try { start(); } catch (e) { frame.classList.remove("spatial"); } } };
  depth.onload = go;
  if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
  depth.src = img.dataset.depth;
})();
