/* ==========================================================
   MAIN — Lenis smooth scroll + GSAP ScrollTrigger choreography.
   The 3D camera is a plain object (window.CAM) tweened here and
   read every frame by workshop3d.js.
   ========================================================== */
(function () {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Draggable, InertiaPlugin);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const D = window.BUILDERS;

  $$("[data-yt]").forEach((a) => (a.href = D.socials.youtube));
  $$("[data-ig]").forEach((a) => (a.href = D.socials.instagram));
  $$("[data-li]").forEach((a) => (a.href = D.socials.linkedin));

  /* ---------- 3D camera keyframes ---------- */
  const K = (px, py, pz, tx, ty, tz, fov = 40) => ({ px, py, pz, tx, ty, tz, fov });
  const fovAdj = isMobile ? 16 : 0;
  const CAM0 = isMobile ? K(0, 5.2, 22, 0, 1.3, -2, 52) : K(-2.6, 4.0, 15.5, -4.2, 1.4, -2, 38);
  window.CAM = Object.assign(window.CAM || {}, CAM0);
  const stops = [
    { k: K(-7.3, 1.75, 1.3, -8.9, 1.7, -3.2, 40 + fovAdj), card: 0, name: "WAR ROOM · ER. RAJA SINGH" },
    { k: K(-3.55, 1.95, 0.35, -4.6, 1.0, -2.8, 40 + fovAdj), card: 1, name: "WRITER'S DESK · RATNAM KALRA" },
    { k: K(0.1, 1.85, 0.9, 0, 1.1, -2.6, 40 + fovAdj), card: 2, name: "THE BENCH · SUDHANSHU & ARYAN" },
    { k: K(0.65, 1.22, -1.05, 0.05, 1.22, -2.75, 36 + fovAdj), card: 2, name: "CLOSE-UP · THE BUILD", hold: 0.5 },
    { k: K(5.25, 1.7, 0.3, 5.2, 1.25, -3, 40 + fovAdj), card: 3, name: "EDIT BAY · PRATEEK & VIRENDRA" },
    { k: K(8.1, 1.65, 1.5, 10.0, 1.2, -2.2, 40 + fovAdj), card: 4, name: "LOADING DOOR · SAHIL" },
  ];

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.085 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const t = a.getAttribute("href");
      if (t.length > 1 && $(t)) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.8 }); }
    }));
  }
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ==========================================================
     LOADER — film-leader countdown, gated on fonts + 3D ready
     ========================================================== */
  const logs = ["> powering up soldering iron…", "> lighting the workshop…", "> brewing chai ☕", "> waking up the editors…", "> Sahil is on a call…", "> Just ship it."];
  const prog = { v: 0 };
  let ready3d = false, pageLoaded = false;
  addEventListener("workshop:ready", () => (ready3d = true));
  Promise.all([document.fonts ? document.fonts.ready : 0, new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)))]).then(() => (pageLoaded = true));
  setTimeout(() => (ready3d = true), 9000); // never hang if WebGL is unavailable
  const loaderTween = gsap.to(prog, {
    v: 100, duration: 2.6, ease: "power1.inOut",
    onUpdate() {
      if (!(ready3d && pageLoaded) && prog.v > 90) { loaderTween.pause(); const w = setInterval(() => { if (ready3d && pageLoaded) { clearInterval(w); loaderTween.resume(); } }, 80); }
      const v = Math.round(prog.v);
      $("#pct").textContent = v;
      $("#sweep").style.setProperty("--a", ((v % 33.34) / 33.34) * 360 + "deg");
      $("#leaderNum").textContent = Math.max(1, 3 - Math.floor(v / 33.34));
      $("#log").textContent = logs[Math.min(logs.length - 1, Math.floor(v / 17))];
    },
    onComplete() { $("#loader").classList.add("is-ready"); $("#leaderNum").textContent = "▶"; $("#sweep").style.setProperty("--a", "360deg"); },
  });
  let entered = false;
  function enter() {
    if (entered || !$("#loader").classList.contains("is-ready")) return;
    entered = true;
    gsap.timeline()
      .to(".leader, .loader__meta, .loader__log, .loader__cta", { scale: 1.08, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
      .to("#loader", { clipPath: "inset(50% 0 50% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.1")
      .add(() => { $("#loader").remove(); document.body.classList.remove("is-loading"); lenis && lenis.start(); ScrollTrigger.refresh(); }, "-=0.4")
      .add(heroIntro(), "-=0.8");
  }
  $("#loader").style.clipPath = "inset(0% 0 0% 0)";
  ["click", "keydown", "wheel", "touchend"].forEach((ev) => addEventListener(ev, enter, { passive: true }));

  function heroIntro() {
    return gsap.timeline()
      .fromTo(window.CAM, { pz: CAM0.pz + 9, py: CAM0.py + 3 }, { pz: CAM0.pz, py: CAM0.py, duration: 3, ease: "expo.out" }, 0)
      .from(".hero__title .split-line > span", { yPercent: 110, rotate: 4, duration: 1.2, stagger: 0.12, ease: "expo.out" }, 0.3)
      .from(".world__hero .eyebrow, .hero__lede, .hero__scroll, .vf", { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.6)
      .from(".nav", { y: -30, autoAlpha: 0, duration: 0.8 }, 0.6)
      .from(".jsi--hero span", { autoAlpha: 0, rotate: -14, scale: 1.4, duration: 0.6, ease: "back.out(2)" }, 1.1)
      .fromTo(".jsi--hero path", { strokeDasharray: 600, strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, 1.4);
  }

  /* ---------- cursor + magnetic ---------- */
  const dot = $(".cursor"), ring = $(".cursor-ring");
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 }), dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("a, button, [data-cursor]"), mode = t && t.dataset.cursor;
    ring.classList.toggle("is-hover", !!t && !mode); ring.classList.toggle("is-drag", !!mode && mode !== "hand"); ring.classList.toggle("is-hand", mode === "hand");
    ring.textContent = mode === "drag" ? "DRAG" : mode === "play" ? "PLAY" : mode === "hand" ? "✋" : "";
  });
  $$(".magnetic").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" }), yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });

  /* ---------- marquees react to scroll velocity ---------- */
  $$(".marquee__track").forEach((t, i) => {
    const dir = i % 2 ? -1 : 1;
    const tw = gsap.to(t, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    if (dir < 0) tw.timeScale(-1).progress(1);
    ScrollTrigger.create({ onUpdate: (s) => gsap.to(tw, { timeScale: dir * (1 + Math.min(4, Math.abs(s.getVelocity()) / 400)), duration: 0.3, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: dir, duration: 0.8 }) }) });
  });

  /* ==========================================================
     AMBIENT LOOPS — people typing, sparks, neon, clocks
     ========================================================== */
  function ambient(root) {
    if (reduce) return;
    $$(".person", root).forEach((p, i) => {
      const arm = $(".arm-front .arm-r", p), back = $(".arm-back .arm-r", p), headEl = $(".head-r", p);
      const isTyper = !p.classList.contains("person--raja") && !p.classList.contains("person--sahil");
      if (isTyper) {
        gsap.to(arm, { rotation: -6, transformOrigin: "0% 0%", duration: 0.18 + (i % 3) * 0.04, yoyo: true, repeat: -1, ease: "sine.inOut" });
        back && gsap.to(back, { rotation: 5, transformOrigin: "0% 0%", duration: 0.22, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.1 });
      } else {
        gsap.to(arm, { x: 3, y: -3, duration: 0.25, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
      gsap.to(headEl, { rotation: 4, y: 1, transformOrigin: "50% 100%", duration: 1.6 + (i % 4) * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to($$(".eye", p), { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.08, yoyo: true, repeat: -1, repeatDelay: 2.5 + i * 0.7 });
    });
    $$(".spark", root).forEach((s) => gsap.fromTo(s, { x: 0, y: 0, autoAlpha: 1 }, { x: () => gsap.utils.random(-40, 40), y: () => gsap.utils.random(-40, 8), autoAlpha: 0, duration: gsap.utils.random(0.4, 0.8), repeat: -1, repeatRefresh: true, delay: gsap.utils.random(0, 1.5), ease: "power2.out" }));
    $$(".code-ln", root).forEach((l, i) => gsap.fromTo(l, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.5, delay: i * 0.25, repeat: -1, repeatDelay: 3, ease: "steps(8)" }));
    $$(".mini-playhead", root).forEach((ph) => gsap.to(ph, { x: 60, duration: 4, repeat: -1, ease: "none" }));
    $$(".steam", root).forEach((s, i) => gsap.fromTo(s, { y: 4, autoAlpha: 0 }, { y: -8, autoAlpha: 1, duration: 1.6, repeat: -1, delay: i * 0.4, ease: "sine.out", yoyo: true }));
    $$(".rb-led, .rec-dot", root).forEach((l) => gsap.to(l, { autoAlpha: 0.2, duration: 0.5, repeat: -1, yoyo: true }));
  }
  ambient(document);

  /* ==========================================================
     3D WORKSHOP — pinned camera flight between stations
     ========================================================== */
  (function world() {
    const cards = $$(".tour__card"), dots = $$(".tour__dots i"), vfStation = $("#vfStation");
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: { trigger: ".world", start: "top top", end: () => "+=" + innerHeight * 9, pin: true, scrub: 1.2, anticipatePin: 1 },
    });
    tl.to(".world__hero, .hero__scroll", { autoAlpha: 0, y: -40, duration: 0.6 }, 0.2)
      .to(".world .letterbox", { scaleY: 1, duration: 0.6 }, 0.3);
    const marks = []; // [time the camera arrives, stop index]
    let shown = -1;
    stops.forEach((s, i) => {
      tl.to(window.CAM, { ...s.k, duration: 1.4 }, i === 0 ? 0.3 : ">");
      marks.push([tl.duration() - 0.7, i]);
      if (s.card !== shown) {
        if (shown >= 0) tl.to(cards[shown], { autoAlpha: 0, y: -24, duration: 0.3 }, "<");
        tl.fromTo(cards[s.card], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, "-=0.35");
        shown = s.card;
      }
      tl.to({}, { duration: s.hold || 0.9 });
    });
    tl.to(cards[shown], { autoAlpha: 0, duration: 0.3 })
      .to(window.CAM, { ...K(0, 5.4, 18 + (isMobile ? 6 : 0), 0, 1.2, -2, 38 + fovAdj), duration: 1.4 }, "<");
    marks.push([tl.duration() - 0.7, -1]);
    tl.to(".world .letterbox", { scaleY: 0, duration: 0.5 }, "-=0.6").to({}, { duration: 0.4 });
    tl.eventCallback("onUpdate", () => {
      const t = tl.time();
      let cur = -1;
      for (const [time, i] of marks) if (t >= time) cur = i;
      vfStation.textContent = cur < 0 ? "WIDE · THE WORKSHOP" : stops[cur].name;
      const d = cur < 0 ? 0 : stops[cur].card + 1;
      dots.forEach((el, i) => el.classList.toggle("on", i === d));
    });
    // running timecode in the viewfinder
    const tc = $("#vfTc"), t0 = performance.now();
    gsap.ticker.add(() => { const f = Math.floor((performance.now() - t0) / (1000 / 24)); tc.textContent = [Math.floor(f / 86400) % 24, Math.floor(f / 1440) % 60, Math.floor(f / 24) % 60, f % 24].map((n) => String(n).padStart(2, "0")).join(":"); });
  })();

  /* ---------- section reveals ---------- */
  $$(".chapter__text, .hub__head, .team__head, .pipeline__head").forEach((el) => {
    gsap.from(el.children, { y: 50, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  $$(".chapter__num").forEach((n) => gsap.fromTo(n, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: n.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));

  /* helper: scroll-scrubbed timeline, pinned on desktop */
  const mm = gsap.matchMedia();
  function pinnedTL(section, length = 1.6, stageSel = ".chapter__stage") {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    mm.add({ desk: "(min-width: 961px)", mob: "(max-width: 960px)" }, (ctx) => {
      const st = ctx.conditions.desk
        ? { trigger: section, start: "top top", end: () => "+=" + innerHeight * length, pin: true, scrub: 0.8, anticipatePin: 1 }
        : { trigger: $(stageSel, section) || section, start: "top 75%", end: "bottom 25%", scrub: 0.8 };
      const s = ScrollTrigger.create({ ...st, animation: tl });
      return () => s.kill();
    });
    return tl;
  }

  /* ==========================================================
     MISSION 60M — odometer, command network, countdown, pace
     ========================================================== */
  (function mission() {
    const M = D.mission, sec = $("#mission");
    const cols = $$(".odo__col").map((c) => ({ strip: $(".odo__strip", c), pos: +c.dataset.pos }));
    const odo = { v: 0 };
    const renderOdo = () => cols.forEach(({ strip, pos }) => {
      const d = (odo.v / Math.pow(10, pos)) % 10; // real odometer: each wheel turns at 1/10 the speed of the one to its right
      strip.style.transform = `translateY(${-(d / 11) * 100}%)`;
    });
    renderOdo();
    gsap.from(".mission__left > *", { y: 50, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 70%" } });
    // live quarter clock
    const s = new Date(M.start), e = new Date(M.end);
    $("#mqLabel").textContent = M.label + " · " + s.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " → " + e.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const units = Object.fromEntries($$("#countdown b").map((b) => [b.dataset.u, b]));
    function tick() {
      const now = Date.now(), pct = Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100));
      $("#mqPct").textContent = pct.toFixed(1); $("#mqBar").style.width = pct + "%";
      let left = Math.max(0, e - now) / 1000;
      const d = Math.floor(left / 86400); left -= d * 86400;
      const h = Math.floor(left / 3600); left -= h * 3600;
      const m = Math.floor(left / 60), sec = Math.floor(left - m * 60);
      [["d", d], ["h", h], ["m", m], ["s", sec]].forEach(([u, v]) => (units[u].textContent = String(v).padStart(2, "0")));
    }
    tick(); setInterval(tick, 1000);
    // network
    const lines = $$(".net__line");
    lines.forEach((l) => { const L = Math.hypot(l.x2.baseVal.value - 50, l.y2.baseVal.value - 50); gsap.set(l, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.set(".node", { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 }); gsap.set(".node__order", { autoAlpha: 0, y: 8 });
    gsap.set(".pace__bar", { scaleY: 0, transformOrigin: "50% 100%" });
    if (!reduce) {
      $$(".net__pulse").forEach((p, i) => { const l = lines[i]; gsap.fromTo(p, { attr: { cx: 50, cy: 50 }, autoAlpha: 1 }, { attr: { cx: l.x2.baseVal.value, cy: l.y2.baseVal.value }, autoAlpha: 0.2, duration: 1.4, ease: "power1.in", repeat: -1, delay: i * 0.23, repeatDelay: 0.6 }); });
      gsap.fromTo(".net__ring", { attr: { r: 12 }, autoAlpha: 0.7 }, { attr: { r: 30 }, autoAlpha: 0, duration: 2.4, repeat: -1, stagger: 1.2, ease: "power1.out" });
    }
    const tl = pinnedTL(sec, 2.2, ".mission__grid");
    tl.to(odo, { v: M.target, duration: 1.2, ease: "power2.inOut", onUpdate: renderOdo }, 0)
      .to(".node--lead", { scale: 1, autoAlpha: 1, duration: 0.15, ease: "back.out(2)" }, 0)
      .to(lines, { strokeDashoffset: 0, stagger: 0.08, duration: 0.25 }, 0.1)
      .to(".node:not(.node--lead)", { scale: 1, autoAlpha: 1, stagger: 0.08, duration: 0.15, ease: "back.out(2)" }, 0.25)
      .to(".node__order", { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.15 }, 0.5)
      .to(".pace__bar", { scaleY: 1, stagger: 0.04, duration: 0.25, ease: "power2.out" }, 0.7)
      .to(".mission__ghost", { xPercent: -12, duration: 1.4 }, 0);
  })();

  /* ==========================================================
     CH 01 — RAJA: whiteboard draws itself
     ========================================================== */
  (function raja() {
    const sec = $("#ch-raja"), draws = $$("#stage-raja .draw");
    draws.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.set("#stage-raja .wb-t", { autoAlpha: 0 });
    gsap.set("#stage-raja .sticky", { scale: 0, transformOrigin: "50% 0%" });
    const pct = { v: 0 };
    const tl = pinnedTL(sec, 1.4);
    tl.to("#stage-raja .wb-t", { autoAlpha: 1, stagger: 0.12, duration: 0.1 }, 0)
      .to(draws, { strokeDashoffset: 0, stagger: 0.06, duration: 0.25 }, 0)
      .to("#stage-raja .sticky", { scale: 1, stagger: 0.3, duration: 0.2, ease: "back.out(2)" }, 0.6)
      .to(pct, { v: 100, duration: tl.duration() || 1.6, onUpdate: () => ($("#raja-pct").textContent = Math.round(pct.v) + "%") }, 0);
  })();

  /* ==========================================================
     STORY — words light up, retention curve draws
     ========================================================== */
  (function story() {
    const sec = $("#story"), words = $$("#storyText .w"), line = $(".ret-line"), L = line.getTotalLength();
    gsap.set(line, { strokeDasharray: L, strokeDashoffset: L }); gsap.set(".ret-fill, .ret-mk", { autoAlpha: 0 });
    const tl = pinnedTL(sec, 1.8, ".story__inner");
    tl.to(".story .letterbox", { scaleY: 1, duration: 0.15 }, 0)
      .to(words, { opacity: 1, stagger: 0.02, duration: 0.05 }, 0.05)
      .to(line, { strokeDashoffset: 0, duration: 0.5 }, 0.5)
      .to(".ret-fill", { autoAlpha: 1, duration: 0.2 }, 0.75)
      .to(".ret-mk", { autoAlpha: 1, duration: 0.15 }, 0.6);
  })();

  /* ==========================================================
     CH 02 — RATNAM: scroll-scrubbed typewriter
     ========================================================== */
  (function ratnam() {
    const sec = $("#ch-ratnam"), lines = $$("#script .ty");
    const texts = lines.map((l) => l.dataset.t), total = texts.reduce((a, t) => a + t.length, 0);
    const caret = document.createElement("span"); caret.className = "caret";
    const state = { c: 0 };
    let last = -1;
    function render() {
      const n = Math.round(state.c);
      if (n === last) return; last = n;
      let left = n, words = 0, cur = lines[0];
      lines.forEach((l, i) => {
        const t = texts[i], shown = Math.max(0, Math.min(t.length, left));
        l.textContent = t.slice(0, shown);
        l.classList.toggle("on", shown > 0);
        if (shown > 0) cur = l;
        words += t.slice(0, shown).split(/\s+/).filter(Boolean).length;
        left -= t.length;
      });
      cur.appendChild(caret);
      const paper = $("#script"), overflow = cur.offsetTop + cur.offsetHeight - paper.clientHeight * 0.82;
      paper.scrollTop = Math.max(0, overflow);
      $("#ratnam-words").textContent = words;
    }
    render();
    const pages = $$("#stage-ratnam .page-fly");
    gsap.set(pages, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const tl = pinnedTL(sec, 1.6);
    tl.to(state, { c: total, duration: 1, onUpdate: render }, 0);
    pages.forEach((p, i) => tl.fromTo(p, { x: 0, y: 0, rotation: 0, autoAlpha: 1 }, { x: [-260, 280, -220][i], y: [-200, -160, 220][i], rotation: [-40, 55, -25][i], autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0.25 + i * 0.25));
  })();

  /* ==========================================================
     CH 03 — BUILDERS: 72 hours of day/night while the robot assembles
     ========================================================== */
  (function builders() {
    const sec = $("#ch-builders"), st = $("#stage-builders");
    const q = (c) => $(c, st);
    const skyTop = $(".b-sky-top", st), skyBot = $(".b-sky-bot", st);
    // sky palettes: night → dusk → day (top, bottom)
    const top = [gsap.utils.interpolate("#050a1f", "#3b2a6b"), gsap.utils.interpolate("#3b2a6b", "#3f9cff")];
    const bot = [gsap.utils.interpolate("#1a1238", "#ff8a4c"), gsap.utils.interpolate("#ff8a4c", "#bfe6ff")];
    const parts = $$(".rb-part", st), cups = $$(".b-cup", st), logs = $$("#build-log div");
    gsap.set(parts, { y: -260, autoAlpha: 0 });
    gsap.set(cups, { scale: 0, transformOrigin: "50% 100%" });
    const proxy = { p: 0 };
    function render() {
      const hour = 9 + proxy.p * 72, hod = hour % 24;
      const light = Math.cos(((hod - 13) / 24) * Math.PI * 2); // 1 = noon, -1 = midnight
      const k = gsap.utils.clamp(0, 1, (light + 0.45) / 0.9); // 0 night … 0.5 dusk … 1 day
      const i = k < 0.5 ? 0 : 1, f = k < 0.5 ? k * 2 : (k - 0.5) * 2;
      skyTop.setAttribute("stop-color", top[i](f)); skyBot.setAttribute("stop-color", bot[i](f));
      const night = gsap.utils.clamp(0, 1, -light * 1.6), day = gsap.utils.clamp(0, 1, light * 1.4);
      gsap.set(q(".b-stars"), { opacity: night });
      gsap.set(q(".b-windows"), { opacity: night });
      gsap.set(q(".b-clouds"), { opacity: day * 0.85, x: (proxy.p * 900) % 900 - 120 });
      gsap.set(q(".b-beam"), { opacity: day * 0.6 });
      gsap.set(q(".b-dark"), { opacity: night * 0.55 });
      gsap.set(q(".b-cone"), { opacity: night });
      gsap.set(q(".b-lampglow"), { opacity: 0.2 + night * 0.8 });
      gsap.set(q(".b-monglow"), { opacity: 0.25 + night * 0.75 });
      gsap.set(q(".b-orbit"), { rotation: ((hod - 13) / 24) * 360, svgOrigin: "400 330" });
      // a shooting star around 1–2 AM each night
      const sp = hod >= 1 && hod < 1.6 ? (hod - 1) / 0.6 : -1;
      gsap.set(q(".b-shoot"), { opacity: sp < 0 ? 0 : Math.sin(sp * Math.PI), x: 640 - sp * 300, y: 50 + sp * 90 });
      gsap.set(q(".b-hh"), { rotation: (hour / 12) * 360, transformOrigin: "50% 100%" });
      gsap.set(q(".b-mh"), { rotation: hour * 360, transformOrigin: "50% 100%" });
      const h12 = Math.floor(hod) % 12 || 12, mins = Math.floor((hod % 1) * 60);
      $("#b-time").textContent = `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${hod < 12 ? "AM" : "PM"}`;
      $("#b-day").textContent = String(Math.floor(hour / 24) + 1).padStart(2, "0");
      $("#st-hours").textContent = Math.round(proxy.p * 72);
      $("#st-chai").textContent = Math.round(proxy.p * 27);
      $("#st-bugs").textContent = Math.round(proxy.p * 143);
      const slot = hod < 5 ? 0 : hod < 11 ? 1 : hod < 18 ? 2 : 3;
      if (slot !== lastSlot) {
        lastSlot = slot;
        subS.textContent = ["● 3 AM debugging", "● chai #" + (Math.round(proxy.p * 27) || 1) + ", firmware v2", "● flashing firmware", "● soldering, again"][slot];
        subA.textContent = ["● one more test…", "● printing arm_v4", "● cutting metal", "● drilling. don't ask."][slot];
        if (proxy.p > 0) gsap.fromTo([subS, subA], { opacity: 0 }, { opacity: 1, duration: 0.4 });
      }
    }
    const subS = $(".b-tag--s .b-tag-sub", st), subA = $(".b-tag--a .b-tag-sub", st);
    let lastSlot = -1;
    if (!reduce) gsap.to($$(".b-tag", st), { y: "+=5", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.4 });
    render();
    const tl = pinnedTL(sec, 3);
    tl.to(proxy, { p: 1, duration: 1, onUpdate: render }, 0)
      .to(parts, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.12, ease: "back.out(1.6)" }, 0.05)
      .to(cups, { scale: 1, stagger: 0.11, duration: 0.04, ease: "back.out(3)" }, 0.05)
      .to(logs, { autoAlpha: 1, stagger: 0.11, duration: 0.03 }, 0.05)
      .to($$(".rb-eye", st), { attr: { fill: "#4fd1ff" }, duration: 0.03 }, 0.94)
      .to(q(".b-robot"), { y: "-=10", duration: 0.03, yoyo: true, repeat: 1, ease: "power2.out" }, 0.95);
  })();

  /* ==========================================================
     CH 04 — EDITORS: timeline assembles, playhead scrubs, frames cut
     ========================================================== */
  (function editors() {
    const sec = $("#ch-editors"), tlEl = $("#timeline"), frames = $$(".editor__frame"), clips = $$("#timeline .clip");
    gsap.set(clips, { scaleX: 0, transformOrigin: "0% 50%" });
    gsap.set(frames[0], { opacity: 1 });
    const st = { p: 0 };
    function render() {
      const fps = 25, f = Math.floor(st.p * 12 * 60 * fps);
      $("#tc").textContent = [0, Math.floor(f / (60 * fps)), Math.floor(f / fps) % 60, f % fps].map((n) => String(n).padStart(2, "0")).join(":");
      const idx = Math.min(frames.length - 1, Math.floor(st.p * frames.length));
      frames.forEach((fr, i) => (fr.style.opacity = i === idx ? 1 : 0));
      $("#ed-pct").textContent = Math.round(st.p * 100) + "%";
      const k = Math.min(2, Math.floor(st.p * 3));
      if (k !== lastK) {
        lastK = k;
        subP.textContent = ["cutting the hook", "trimming B-roll", "syncing the audio"][k];
        subV.textContent = ["colour grade", "masking the robot", "animating titles"][k];
      }
    }
    const subP = $("#curP i"), subV = $("#curV i");
    let lastK = -1;
    // named cursors, like two editors in a shared project
    gsap.set("#curP", { left: "10%", top: "78%" }); gsap.set("#curV", { left: "62%", top: "22%" });
    if (!reduce) gsap.to(".ed-cursor svg", { x: 2, y: 2, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.3 });
    render();
    const tl = pinnedTL(sec, 1.8);
    tl.to("#curP", { keyframes: [{ left: "28%", top: "84%" }, { left: "52%", top: "78%" }, { left: "66%", top: "84%" }, { left: "76%", top: "86%" }], duration: 1, ease: "power1.inOut" }, 0)
      .to("#curV", { keyframes: [{ left: "38%", top: "40%" }, { left: "72%", top: "30%" }, { left: "46%", top: "52%" }, { left: "36%", top: "70%" }], duration: 1, ease: "power1.inOut" }, 0);
    tl.to(clips, { scaleX: 1, stagger: 0.04, duration: 0.15, ease: "power2.out" }, 0)
      .to("#playhead", { x: () => tlEl.clientWidth - 34, duration: 0.7 }, 0.3)
      .to(st, { p: 1, duration: 0.7, onUpdate: render }, 0.3);
  })();

  /* ==========================================================
     CH 05 — SAHIL: scooter rides the route, vendors answer
     ========================================================== */
  (function sahil() {
    const sec = $("#ch-sahil"), done = $("#stage-sahil .route-done"), L = done.getTotalLength();
    gsap.set(done, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set("#stage-sahil .pin-item", { scale: 0, transformOrigin: "50% 100%" });
    if (!reduce) gsap.to("#stage-sahil .pin-pulse", { scale: 1.8, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.6, repeat: -1, stagger: 0.4, ease: "power1.out" });
    const items = $$("#checklist li"), bubbles = $$("#stage-sahil .call-bubble");
    const pr = { p: 0 };
    gsap.set("#scooter", { motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], start: 0, end: 0 } });
    const tl = pinnedTL(sec, 2);
    bubbles.forEach((b, i) => tl.fromTo(b, { autoAlpha: 0, y: 14, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.06, ease: "back.out(2)" }, i * 0.06));
    tl.to(bubbles, { autoAlpha: 0, duration: 0.05, stagger: 0.01 }, 0.32)
      .to("#scooter", { motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5] }, duration: 0.65 }, 0.3)
      .to(done, { strokeDashoffset: 0, duration: 0.65 }, 0.3)
      .to(pr, { p: 1, duration: 0.65, onUpdate() {
        $("#km").textContent = (pr.p * 18.4).toFixed(1) + " km";
        items.forEach((li, i) => li.classList.toggle("done", pr.p >= [0.34, 0.67, 0.98, 0.999][i]));
      } }, 0.3)
      .to("#stage-sahil .pin--p1 .pin-item", { scale: 1, duration: 0.05, ease: "back.out(3)" }, 0.3 + 0.65 * 0.34)
      .to("#stage-sahil .pin--p2 .pin-item", { scale: 1, duration: 0.05, ease: "back.out(3)" }, 0.3 + 0.65 * 0.67)
      .to("#stage-sahil .pin--p3 .pin-item", { scale: 1, duration: 0.05, ease: "back.out(3)" }, 0.3 + 0.65 * 0.99);
  })();

  /* ==========================================================
     PIPELINE — pinned horizontal scroll
     ========================================================== */
  (function pipeline() {
    const track = $(".pipeline__track");
    const dist = () => track.scrollWidth - innerWidth + 40;
    const st = { trigger: ".pipeline", start: "top top", end: () => "+=" + dist(), scrub: 0.8, invalidateOnRefresh: true };
    const move = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { ...st, pin: true, anticipatePin: 1 } });
    gsap.to(".pipeline__line i", { scaleX: 1, ease: "none", scrollTrigger: st });
    $$(".step").forEach((s) => gsap.from($$("h3, p", s), { y: 40, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: s, containerAnimation: move, start: "left 85%", toggleActions: "play none none reverse" } }));
  })();

  /* ==========================================================
     TEAM — draggable rail with inertia
     ========================================================== */
  (function team() {
    const rail = $("#team-rail");
    const bounds = () => ({ minX: Math.min(0, innerWidth - rail.scrollWidth - 40), maxX: 0 });
    const [drag] = Draggable.create(rail, { type: "x", bounds: bounds(), inertia: true, edgeResistance: 0.85, dragClickables: true,
      onPress() { rail.style.cursor = "grabbing"; }, onRelease() { rail.style.cursor = "grab"; } });
    addEventListener("resize", () => drag.applyBounds(bounds()));
    gsap.from(".member", { y: 100, autoAlpha: 0, rotate: 3, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: rail, start: "top 85%" } });
    gsap.to(rail, { x: () => bounds().minX * 0.35, ease: "none", scrollTrigger: { trigger: ".team", start: "top bottom", end: "bottom top", scrub: 1, onUpdate: () => drag.update() } });
  })();

  /* ==========================================================
     LAB EXHIBIT — Shinchan sanitizer: hand in front of the
     sensor → sanitizer arc follows the hand, team laughs
     ========================================================== */
  (function sanitizer() {
    const sec = $("#sanitizer"), stage = $("#saniStage"), img = $(".sani__gadget img"), sensor = $(".sani__sensor");
    const dropsG = $("#saniDrops"), bubbles = $("#saniBubbles"), fans = $$(".fan");
    const NS = "http://www.w3.org/2000/svg";
    const jokes = ["HAHAHA 😂", "bhai 💀", "again! again!", "Shinchan pls 😭", "LMAOOO", "🤣🤣🤣", "sanitized 💦", "kya bana diya 😂"];
    const st = { flow: 0 }, drops = [];
    let hand = null, on = false, touchT = 0, count = 0, laughs = 0, visible = false, last = null;
    const local = (e) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const at = (el, fx, fy) => { const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * fy }; };
    const origin = () => at(img, 0.37, 0.53);     // where Shinchan... dispenses
    const sensorPt = () => at(sensor, 0.5, 0.5);
    function inFront() {
      if (!hand) return false;
      const s = sensorPt(), dx = hand.x - s.x, dy = hand.y - s.y;
      return dx < 24 && dx > -stage.clientWidth * 0.6 && Math.abs(dy) < stage.clientHeight * 0.42;
    }
    function check() {
      const want = inFront() || performance.now() < touchT;
      if (want && !on) start(); else if (!want && on) stop();
    }
    function start() {
      on = true; sec.classList.add("is-on");
      $("#saniCount").textContent = ++count;
      gsap.to(st, { flow: 1, duration: 0.28, ease: "power2.out", overwrite: true });
      laugh();
    }
    function stop() {
      on = false; sec.classList.remove("is-on");
      gsap.to(st, { flow: 0, duration: 0.35, ease: "power2.in", overwrite: true });
    }
    function laugh() {
      $("#saniLaughs").textContent = ++laughs;
      fans.forEach((f, i) => {
        const body = $(".fan__body", f), lol = $(".fan__lol", f), dir = i % 2 ? 1 : -1;
        gsap.killTweensOf([body, lol]);
        gsap.timeline({ delay: i * 0.05 })
          .to(body, { y: -14, rotation: 8 * dir, duration: 0.12, ease: "power2.out" })
          .fromTo(body, { y: -14, rotation: 8 * dir }, { y: 0, rotation: -6 * dir, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 6 })
          .to(body, { y: 0, rotation: 0, duration: 0.25 });
        gsap.timeline({ delay: i * 0.05 })
          .fromTo(lol, { scale: 0, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: "back.out(3)" })
          .to(lol, { scale: 0, opacity: 0, duration: 0.3 }, "+=1.3");
      });
      if (bubbles.children.length > 4) return;
      for (let k = 0; k < 3; k++) {
        const f = fans[(Math.random() * fans.length) | 0], fr = f.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        const b = document.createElement("div"); b.className = "lol"; b.textContent = jokes[(Math.random() * jokes.length) | 0];
        b.style.left = Math.min(sr.width - 150, Math.max(8, fr.left - sr.left + fr.width * 0.4)) + "px"; b.style.top = fr.top - sr.top - 34 + "px";
        bubbles.appendChild(b);
        gsap.fromTo(b, { scale: 0, opacity: 0, transformOrigin: "20% 100%" }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.5)", delay: 0.15 + k * 0.22 });
        gsap.to(b, { y: -40, opacity: 0, duration: 0.6, delay: 1.6 + k * 0.22, onComplete: () => b.remove() });
      }
    }
    stage.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { hand = local(e); check(); } });
    stage.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hand = null; check(); } });
    stage.addEventListener("pointerdown", (e) => {
      hand = local(e);
      if (e.pointerType !== "mouse") { const s = sensorPt(); hand.x = Math.min(hand.x, s.x - 30); touchT = performance.now() + 1600; setTimeout(check, 1650); }
      check();
    });
    ScrollTrigger.create({ trigger: sec, start: "top bottom", end: "bottom top", onToggle: (t) => (visible = t.isActive) });

    // glossy liquid stream: soft glow + gradient body + a highlight that visibly flows toward the hand
    const svg = $("#saniFx");
    svg.insertAdjacentHTML("afterbegin", `
      <defs>
        <linearGradient id="peeBody" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4fbff" stop-opacity=".98"/><stop offset=".55" stop-color="#bfe8ff" stop-opacity=".9"/><stop offset="1" stop-color="#8fd3ff" stop-opacity=".75"/></linearGradient>
        <filter id="peeGlow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.2"/></filter>
      </defs>`);
    const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); dropsG.before(el); return el; };
    const glowEl = mk("path", { fill: "rgba(140,210,255,.55)", filter: "url(#peeGlow)" });
    const bodyEl = mk("path", { fill: "url(#peeBody)" });
    const flowEl = mk("path", { fill: "none", stroke: "rgba(255,255,255,.95)", "stroke-width": "1.3", "stroke-linecap": "round", "stroke-dasharray": "5 11" });
    const edgeEl = mk("path", { fill: "none", stroke: "rgba(70,150,210,.45)", "stroke-width": "0.8" });
    const grad = svg.querySelector("#peeBody");
    const quad = (O, C, T, t) => { const u = 1 - t; return { x: u * u * O.x + 2 * u * t * C.x + t * t * T.x, y: u * u * O.y + 2 * u * t * C.y + t * t * T.y, dx: 2 * u * (C.x - O.x) + 2 * t * (T.x - C.x), dy: 2 * u * (C.y - O.y) + 2 * t * (T.y - C.y) }; };
    function bead(x, y, vx, vy, r, life, g = 0.22) {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", r); c.setAttribute("fill", "rgba(220,244,255,.95)");
      dropsG.appendChild(c);
      drops.push({ el: c, x, y, vx, vy, g, f: 0, F: life });
    }
    function ring(x, y) {
      const e = document.createElementNS(NS, "ellipse");
      e.setAttribute("cx", x); e.setAttribute("cy", y); e.setAttribute("fill", "none"); e.setAttribute("stroke", "rgba(200,238,255,.8)"); e.setAttribute("stroke-width", "1.4");
      dropsG.appendChild(e);
      gsap.fromTo(e, { attr: { rx: 3, ry: 1 }, opacity: 0.9 }, { attr: { rx: 22, ry: 6 }, opacity: 0, duration: 0.55, ease: "power2.out", onComplete: () => e.remove() });
    }
    let flowOff = 0, lastRing = 0;
    gsap.ticker.add(() => {
      if (!visible) return;
      if (on && hand) last = { ...hand };
      const f = st.flow, time = performance.now() / 1000;
      const paths = [glowEl, bodyEl, flowEl, edgeEl];
      if (f > 0.02 && last) {
        const O = origin(), T = last;
        // projectile-style arc: rises a little out of Shinchan, then falls onto the hand
        const C = { x: O.x + (T.x - O.x) * 0.38, y: Math.min(O.y, T.y) - 18 - Math.abs(T.x - O.x) * 0.16 };
        const reach = 0.9 * f, N = 36, L = [], R = [], mid = [];
        for (let i = 0; i <= N; i++) {
          const t = (i / N) * reach, p = quad(O, C, T, t), len = Math.hypot(p.dx, p.dy) || 1;
          const nx = -p.dy / len, ny = p.dx / len;
          const pulse = 1 + 0.08 * Math.sin(time * 9 - i * 0.45);
          const w = (2.6 + 1.6 * Math.min(1, t * 6) - 2.4 * t * t) * pulse;   // fat near the source, thinning as it falls
          const wob = Math.sin(time * 5 - i * 0.35) * 0.7 * t;
          const cx = p.x + nx * wob, cy = p.y + ny * wob;
          L.push(`${(cx + nx * w).toFixed(1)},${(cy + ny * w).toFixed(1)}`); R.push(`${(cx - nx * w).toFixed(1)},${(cy - ny * w).toFixed(1)}`);
          mid.push(`${(cx + nx * w * 0.38).toFixed(1)},${(cy + ny * w * 0.38).toFixed(1)}`);
        }
        const body = `M${L.join(" L")} L${[...R].reverse().join(" L")} Z`;
        glowEl.setAttribute("d", body); bodyEl.setAttribute("d", body);
        edgeEl.setAttribute("d", `M${R.join(" L")}`);
        flowEl.setAttribute("d", `M${mid.slice(1, -2).join(" L")}`);
        flowOff -= 2.2; flowEl.setAttribute("stroke-dashoffset", flowOff);
        grad.setAttribute("x1", O.x); grad.setAttribute("y1", O.y); grad.setAttribute("x2", T.x); grad.setAttribute("y2", T.y);
        paths.forEach((el) => (el.style.opacity = Math.min(1, f * 1.4)));
        if (drops.length < 220) {
          // tail breaks into beads that carry on into the hand
          for (let k = 0; k < 2; k++) {
            const t = reach * (0.9 + Math.random() * 0.1), p = quad(O, C, T, t);
            bead(p.x, p.y, p.dx / 28, p.dy / 28, 1.1 + Math.random() * 1.2, 7 + Math.random() * 5);
          }
          if (f > 0.9) {
            // splash crown + drips running off the hand
            for (let k = 0; k < 2; k++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 1.2 + Math.random() * 2.4; bead(T.x, T.y, Math.cos(a) * v, Math.sin(a) * v, 0.7 + Math.random() * 0.9, 12 + Math.random() * 8); }
            if (Math.random() < 0.25) bead(T.x + (Math.random() - 0.5) * 18, T.y + 8, 0, 0.4, 1.4 + Math.random() * 1.2, 40, 0.12);
          }
        }
        if (f > 0.9 && time - lastRing > 0.14) { lastRing = time; ring(T.x, T.y + 6); }
      } else paths.forEach((el) => (el.style.opacity = 0));
      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.f++;
        if (p.f >= p.F || p.y > stage.clientHeight) { p.el.remove(); drops.splice(i, 1); continue; }
        p.el.setAttribute("cx", p.x.toFixed(1)); p.el.setAttribute("cy", p.y.toFixed(1)); p.el.setAttribute("opacity", (1 - p.f / p.F).toFixed(2));
      }
    });
  })();

  /* ---------- content hub ---------- */
  (function dragScroll(el) {
    let down = false, moved = 0, sx = 0, sl = 0;
    el.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = 0; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener("pointermove", (e) => { if (!down) return; moved = Math.abs(e.clientX - sx); el.scrollLeft = sl - (e.clientX - sx); });
    addEventListener("pointerup", () => (down = false));
    el.addEventListener("click", (e) => { if (moved > 6) e.preventDefault(); }, true);
    el.addEventListener("dragstart", (e) => e.preventDefault());
  })($("#videos"));
  gsap.set(".short, .insta a, .post, .comm", { autoAlpha: 0 });
  ScrollTrigger.batch(".short, .insta a, .post, .comm", {
    start: "top 88%",
    onEnter: (els) => gsap.fromTo(els, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.9, ease: "power3.out", overwrite: true }),
  });
  $$(".count").forEach((c) => {
    const o = { v: 0 };
    const dec = +c.dataset.dec || 0;
    gsap.to(o, { v: +c.dataset.to, duration: 2, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 90%" }, onUpdate: () => (c.textContent = o.v.toFixed(dec)) });
  });
  (function fitWordmark() {
    const el = $(".footer__big"); el.innerHTML = `<span>${el.textContent}</span>`;
    const span = el.firstChild, fit = () => { el.style.fontSize = "100px"; el.style.fontSize = (100 * el.clientWidth / span.offsetWidth) * 0.99 + "px"; };
    fit(); addEventListener("resize", fit); document.fonts && document.fonts.ready.then(fit);
  })();
  gsap.fromTo(".footer__scribble path", { strokeDasharray: 600, strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: ".footer__cta", start: "top 75%" } });
  gsap.from(".footer__big", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
