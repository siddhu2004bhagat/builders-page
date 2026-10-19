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
  const logs = ["> powering up soldering iron…", "> lighting the workshop…", "> brewing chai ☕", "> waking up the editors…", "> Sahil is on a call…", "> Raja: 60M. Let's go."];
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
      .from(".nav", { y: -30, autoAlpha: 0, duration: 0.8 }, 0.6);
  }

  /* ---------- cursor + magnetic ---------- */
  const dot = $(".cursor"), ring = $(".cursor-ring");
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 }), dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("a, button, [data-cursor]"), mode = t && t.dataset.cursor;
    ring.classList.toggle("is-hover", !!t && !mode); ring.classList.toggle("is-drag", !!mode);
    ring.textContent = mode === "drag" ? "DRAG" : mode === "play" ? "PLAY" : "";
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
     CH 03 — BUILDERS: 72-hour photo time-lapse with day/night grade
     ========================================================== */
  (function builders() {
    const sec = $("#ch-builders"), photos = $$("#stage-builders .tl-photo"), grade = $("#grade"), logs = $$("#build-log div");
    const hh = $("#tlClock .h"), mh = $("#tlClock .m");
    const proxy = { p: 0 };
    function render() {
      const hour = 9 + proxy.p * 72, hod = hour % 24;
      const light = Math.cos(((hod - 13) / 24) * Math.PI * 2);
      const night = gsap.utils.clamp(0, 1, -light * 1.4 + 0.2), dusk = gsap.utils.clamp(0, 1, 1 - Math.abs(light) * 2.2);
      const seg = proxy.p * photos.length, idx = Math.min(photos.length - 1, Math.floor(seg));
      photos.forEach((ph, i) => {
        const local = seg - i;
        ph.style.opacity = i === idx ? 1 : 0;
        ph.style.transform = `scale(${1.06 + gsap.utils.clamp(0, 1, local) * 0.14})`;
        ph.style.filter = `brightness(${1 - night * 0.5}) saturate(${1 - night * 0.35}) contrast(1.05)`;
      });
      grade.style.background = `linear-gradient(180deg, rgba(255,120,40,${dusk * 0.32}), rgba(10,18,60,${night * 0.55}))`;
      hh.style.transform = `rotate(${(hour / 12) * 360}deg)`; mh.style.transform = `rotate(${hour * 360}deg)`;
      const h12 = Math.floor(hod) % 12 || 12, mins = Math.floor((hod % 1) * 60);
      $("#b-time").textContent = `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${hod < 12 ? "AM" : "PM"}`;
      $("#b-day").textContent = String(Math.floor(hour / 24) + 1).padStart(2, "0");
      $("#st-hours").textContent = Math.round(proxy.p * 72);
      $("#st-chai").textContent = Math.round(proxy.p * 27);
      $("#st-bugs").textContent = Math.round(proxy.p * 143);
    }
    render();
    const tl = pinnedTL(sec, 3);
    tl.to(proxy, { p: 1, duration: 1, onUpdate: render }, 0).to(logs, { autoAlpha: 1, stagger: 0.11, duration: 0.03 }, 0.05);
  })();

  /* ==========================================================
     CH 04 — EDITORS: timeline assembles, playhead scrubs, frames cut
     ========================================================== */
  (function editors() {
    const sec = $("#ch-editors"), tlEl = $("#timeline"), frames = $$(".editor__frame"), clips = $$("#timeline .clip");
    gsap.set(clips, { scaleX: 0, transformOrigin: "0% 50%" });
    const st = { p: 0 };
    function render() {
      const fps = 25, f = Math.floor(st.p * 12 * 60 * fps);
      $("#tc").textContent = [0, Math.floor(f / (60 * fps)), Math.floor(f / fps) % 60, f % fps].map((n) => String(n).padStart(2, "0")).join(":");
      const idx = Math.min(frames.length - 1, Math.floor(st.p * frames.length));
      frames.forEach((fr, i) => (fr.style.opacity = i === idx ? 1 : 0));
      $("#ed-pct").textContent = Math.round(st.p * 100) + "%";
    }
    render();
    const tl = pinnedTL(sec, 1.8);
    tl.to(clips, { scaleX: 1, stagger: 0.04, duration: 0.15, ease: "power2.out" }, 0)
      .to("#playhead", { x: () => tlEl.clientWidth - 34, duration: 0.7 }, 0.3)
      .to(st, { p: 1, duration: 0.7, onUpdate: render }, 0.3);
  })();

  /* ==========================================================
     CH 05 — SAHIL: live tracker rides the route, vendors reply
     ========================================================== */
  (function sahil() {
    const sec = $("#ch-sahil"), done = $("#stage-sahil .route-done"), L = done.getTotalLength();
    gsap.set(done, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set("#stage-sahil .pin-item", { scale: 0, transformOrigin: "50% 100%" });
    gsap.set("#tracker", { motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], start: 0, end: 0 } });
    if (!reduce) {
      gsap.to("#stage-sahil .pin-pulse", { scale: 1.9, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.6, repeat: -1, stagger: 0.4, ease: "power1.out" });
      gsap.to(".trk-halo", { scale: 1.6, autoAlpha: 0.2, transformOrigin: "50% 50%", duration: 0.9, yoyo: true, repeat: -1 });
    }
    const items = $$("#checklist li"), bubbles = $$("#chat .call-bubble");
    gsap.set(bubbles, { autoAlpha: 0, y: 14 });
    const pr = { p: 0 };
    const tl = pinnedTL(sec, 2);
    bubbles.forEach((b, i) => tl.to(b, { autoAlpha: 1, y: 0, duration: 0.06, ease: "back.out(2)" }, i * 0.07));
    tl.to("#tracker", { motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5] }, duration: 0.65 }, 0.3)
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

  /* ---------- content hub ---------- */
  gsap.set(".vcard, .insta a, .post, .comm", { autoAlpha: 0 });
  ScrollTrigger.batch(".vcard, .insta a, .post, .comm", {
    start: "top 88%",
    onEnter: (els) => gsap.fromTo(els, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.9, ease: "power3.out", overwrite: true }),
  });
  $$(".count").forEach((c) => {
    const o = { v: 0 };
    gsap.to(o, { v: +c.dataset.to, duration: 2, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 90%" }, onUpdate: () => (c.textContent = Math.round(o.v)) });
  });
  gsap.from(".footer__big", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
