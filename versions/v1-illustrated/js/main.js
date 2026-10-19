/* ==========================================================
   MAIN — Lenis smooth scroll + GSAP ScrollTrigger choreography
   ========================================================== */
(function () {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Draggable, InertiaPlugin);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.BUILDERS;

  // social links from data.js
  $$("[data-yt]").forEach((a) => (a.href = D.socials.youtube));
  $$("[data-ig]").forEach((a) => (a.href = D.socials.instagram));
  $$("[data-li]").forEach((a) => (a.href = D.socials.linkedin));

  /* ---------- smooth scroll (Lenis drives ScrollTrigger) ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const t = a.getAttribute("href");
      if (t.length > 1 && $(t)) { e.preventDefault(); lenis.scrollTo(t, { offset: 0, duration: 1.6 }); }
    }));
  }

  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ==========================================================
     LOADER — fake-but-honest progress gated on fonts + load
     ========================================================== */
  const logs = ["> powering up soldering iron…", "> calibrating servos…", "> brewing chai ☕", "> waking up the editors…", "> Sahil is on a call…", "> workshop ready."];
  const prog = { v: 0 };
  let assetsReady = false;
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)))]).then(() => (assetsReady = true));
  const loaderTween = gsap.to(prog, {
    v: 100, duration: 2.2, ease: "power1.inOut",
    onUpdate() {
      if (!assetsReady && prog.v > 88) { loaderTween.pause(); const wait = setInterval(() => { if (assetsReady) { clearInterval(wait); loaderTween.resume(); } }, 60); }
      const v = Math.round(prog.v);
      $("#pct").textContent = v;
      $("#bar").style.width = v + "%";
      $("#log").textContent = logs[Math.min(logs.length - 1, Math.floor(v / 18))];
    },
    onComplete() { $("#loader").classList.add("is-ready"); },
  });
  let entered = false;
  function enter() {
    if (entered || !$("#loader").classList.contains("is-ready")) return;
    entered = true;
    gsap.timeline()
      .to(".loader__inner", { y: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" })
      .to("#loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.1")
      .add(() => { $("#loader").remove(); document.body.classList.remove("is-loading"); lenis && lenis.start(); ScrollTrigger.refresh(); }, "-=0.4")
      .add(heroIntro(), "-=0.7");
  }
  $("#loader").style.clipPath = "inset(0 0 0% 0)";
  ["click", "keydown", "wheel", "touchend"].forEach((ev) => addEventListener(ev, enter, { passive: true }));

  function heroIntro() {
    return gsap.timeline()
      .from(".hero__title .split-line > span", { yPercent: 110, rotate: 4, duration: 1.2, stagger: 0.12, ease: "expo.out" })
      .from(".hero__row > *, .hero__badge", { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, "-=0.8")
      .from(".nav", { y: -30, autoAlpha: 0, duration: 0.8 }, "-=0.8");
  }

  /* ---------- cursor ---------- */
  const dot = $(".cursor"), ring = $(".cursor-ring");
  const dx = gsap.quickTo(dot, "x", { duration: 0.1 }), dy = gsap.quickTo(dot, "y", { duration: 0.1 });
  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("a, button, [data-cursor]");
    const mode = t && t.dataset.cursor;
    ring.classList.toggle("is-hover", !!t && !mode);
    ring.classList.toggle("is-drag", !!mode);
    ring.textContent = mode === "drag" ? "DRAG" : mode === "play" ? "PLAY" : "";
  });

  /* ---------- magnetic ---------- */
  $$(".magnetic").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" }), yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });

  /* ==========================================================
     HERO — solder-spark particles on <canvas>
     ========================================================== */
  (function sparks() {
    const cv = $("#sparks"), ctx = cv.getContext("2d");
    let w, h, dpr, parts = [], running = true;
    const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize);
    cv.parentElement.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); for (let i = 0; i < 3; i++) emit(e.clientX - r.left, e.clientY - r.top, 1); });
    function emit(x, y, power) {
      const a = Math.random() * Math.PI * 2, s = (Math.random() * 3 + 1) * power;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: 1, d: Math.random() * 0.02 + 0.012, hue: 20 + Math.random() * 30 });
    }
    ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", onToggle: (st) => (running = st.isActive) });
    gsap.ticker.add(() => {
      if (!running) return;
      if (!reduce && Math.random() < 0.5) emit(w * (0.15 + Math.random() * 0.7), h * 0.98, 1.6);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.06; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.life -= p.d;
        if (p.life <= 0 || p.y > h + 10) { parts.splice(i, 1); continue; }
        ctx.strokeStyle = `hsla(${p.hue},100%,${55 + p.life * 30}%,${p.life})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    });
  })();

  gsap.to(".hero__title", { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ---------- marquees speed up with scroll velocity ---------- */
  $$(".marquee__track").forEach((t, i) => {
    const tw = gsap.to(t, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    if (i % 2) tw.reversed(true).progress(1);
    ScrollTrigger.create({ onUpdate: (s) => gsap.to(tw, { timeScale: (i % 2 ? -1 : 1) * (1 + Math.min(4, Math.abs(s.getVelocity()) / 400)), duration: 0.3, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: i % 2 ? -1 : 1, duration: 0.8 }) }) });
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
     WORKSPACE TOUR — pinned SVG "camera" flying between desks
     by tweening the <svg> viewBox (scrubbed to scroll)
     ========================================================== */
  (function tour() {
    const svg = $("#office");
    const cards = $$(".tour__card"), dots = $$(".tour__dots i");
    if (!reduce) {
      gsap.to(".neon", { opacity: 0.55, duration: 0.08, repeat: -1, repeatDelay: 3, yoyo: true, ease: "steps(1)" });
      gsap.to("#office .clk-m", { rotation: 360, transformOrigin: "50% 100%", duration: 6, repeat: -1, ease: "none" });
      gsap.to("#office .clk-h", { rotation: 360, transformOrigin: "50% 100%", duration: 72, repeat: -1, ease: "none" });
      gsap.timeline({ repeat: -1, repeatDelay: 0.6 }).fromTo("#office .bub-1", { scale: 0, autoAlpha: 0, transformOrigin: "100% 100%" }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" }).to("#office .bub-1", { autoAlpha: 0, duration: 0.2 }, "+=1.6").fromTo("#office .bub-2", { scale: 0, autoAlpha: 0, transformOrigin: "100% 100%" }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" }).to("#office .bub-2", { autoAlpha: 0, duration: 0.2 }, "+=1.6");
      $$("#office .pg").forEach((pg, i) => gsap.fromTo(pg, { x: 0, y: 0, rotation: 0, autoAlpha: 1 }, { x: () => gsap.utils.random(-120, -40), y: () => gsap.utils.random(-80, -20), rotation: () => gsap.utils.random(-90, 90), autoAlpha: 0, duration: 1.8, repeat: -1, repeatRefresh: true, delay: i * 0.9, ease: "power1.out" }));
      gsap.to("#office .ntag", { y: -6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: 0.2, from: "random" } });
    }
    $$("#office .wb .draw").forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });

    const stops = [
      "0 0 1600 900",
      "20 140 600 338",   // Raja
      "340 380 340 191",  // Ratnam
      "590 330 480 270",  // Sudhanshu & Aryan
      "1030 340 380 214", // Prateek & Virendra
      "1240 340 460 259", // Sahil
    ];
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: ".tour", start: "top top", end: () => "+=" + innerHeight * 7, pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: (st) => { const idx = Math.min(5, Math.round(st.progress * 6.2 - 0.3)); dots.forEach((d, i) => d.classList.toggle("on", i === Math.max(0, idx))); },
      },
    });
    tl.to(".tour__intro", { autoAlpha: 0, duration: 0.5 }, 0.5)
      .to("#office .ntag", { autoAlpha: 0, duration: 0.3 }, 0.6);
    for (let i = 1; i < stops.length; i++) {
      tl.to(svg, { attr: { viewBox: stops[i] }, duration: 1.2 });
      if (i === 1) tl.to("#office .wb .draw", { strokeDashoffset: 0, stagger: 0.08, duration: 0.6, ease: "none" }, "<0.4");
      tl.fromTo(cards[i - 1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.2");
      tl.to({}, { duration: 0.8 }); // hold
      tl.to(cards[i - 1], { autoAlpha: 0, y: -30, duration: 0.3 });
    }
    tl.to(svg, { attr: { viewBox: stops[0] }, duration: 1.2 });
    tl.to("#office .ntag", { autoAlpha: 1, stagger: 0.05, duration: 0.3 }, "-=0.3");
    tl.to({}, { duration: 0.4 });
  })();

  /* ---------- section headings reveal ---------- */
  $$(".chapter__text, .hub__head, .team__head, .pipeline__head").forEach((el) => {
    gsap.from(el.children, { y: 50, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } });
  });
  $$(".chapter__num").forEach((n) => gsap.fromTo(n, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: n.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));

  /* helper: scroll-scrubbed chapter timeline; pinned on desktop */
  const mm = gsap.matchMedia();
  function chapterTL(section, length = 1.6) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    mm.add({ desk: "(min-width: 961px)", mob: "(max-width: 960px)" }, (ctx) => {
      const st = ctx.conditions.desk
        ? { trigger: section, start: "top top", end: () => "+=" + innerHeight * length, pin: true, scrub: 0.8, anticipatePin: 1 }
        : { trigger: $(".chapter__stage", section), start: "top 75%", end: "bottom 25%", scrub: 0.8 };
      const s = ScrollTrigger.create({ ...st, animation: tl });
      return () => s.kill();
    });
    return tl;
  }

  /* ==========================================================
     CH 01 — RAJA: whiteboard draws itself
     ========================================================== */
  (function raja() {
    const sec = $("#ch-raja"), draws = $$("#stage-raja .draw");
    draws.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.set("#stage-raja .wb-t", { autoAlpha: 0 });
    gsap.set("#stage-raja .sticky", { scale: 0, transformOrigin: "50% 0%" });
    const pct = { v: 0 };
    const tl = chapterTL(sec, 1.4);
    tl.to("#stage-raja .wb-t", { autoAlpha: 1, stagger: 0.12, duration: 0.1 }, 0)
      .to(draws, { strokeDashoffset: 0, stagger: 0.06, duration: 0.25 }, 0)
      .to("#stage-raja .sticky", { scale: 1, stagger: 0.3, duration: 0.2, ease: "back.out(2)" }, 0.6)
      .to(pct, { v: 100, duration: tl.duration() || 1.6, onUpdate: () => ($("#raja-pct").textContent = Math.round(pct.v) + "%") }, 0);
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
    const tl = chapterTL(sec, 1.6);
    tl.to(state, { c: total, duration: 1, onUpdate: render }, 0);
    pages.forEach((p, i) => tl.fromTo(p, { x: 0, y: 0, rotation: 0, autoAlpha: 1 }, { x: [-260, 280, -220][i], y: [-200, -160, 220][i], rotation: [-40, 55, -25][i], autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0.25 + i * 0.25));
  })();

  /* ==========================================================
     CH 03 — BUILDERS: 72 hours of day/night while the robot assembles
     ========================================================== */
  (function builders() {
    const sec = $("#ch-builders"), sky = $("#stage-builders .b-sky");
    const skyDay = "#7ec8ff", skyDusk = "#ff8a4c", skyNight = "#0a1230";
    const mixDusk = gsap.utils.interpolate(skyDusk, skyDay), mixNightDusk = gsap.utils.interpolate(skyNight, skyDusk);
    const parts = $$("#stage-builders .rb-part"), cups = $$("#stage-builders .b-cup"), logs = $$("#build-log div");
    gsap.set(parts, { y: -260, autoAlpha: 0 });
    gsap.set(cups, { scale: 0, transformOrigin: "50% 100%" });
    const proxy = { p: 0 };
    function render() {
      const hour = 9 + proxy.p * 72, hod = hour % 24;
      const light = Math.cos(((hod - 13) / 24) * Math.PI * 2); // 1 = noon, -1 = midnight
      const col = light > 0.25 ? mixDusk(Math.min(1, (light - 0.25) / 0.5)) : light > -0.35 ? mixNightDusk((light + 0.35) / 0.6) : skyNight;
      sky.setAttribute("fill", col);
      const night = gsap.utils.clamp(0, 1, -light * 1.6);
      gsap.set("#stage-builders .b-stars", { opacity: night });
      gsap.set("#stage-builders .b-windows", { opacity: night });
      gsap.set("#stage-builders .b-lampglow", { opacity: 0.25 + night * 0.75 });
      gsap.set("#stage-builders .b-orbit", { rotation: ((hod - 13) / 24) * 360, svgOrigin: "400 330" });
      gsap.set("#stage-builders .b-hh", { rotation: (hour / 12) * 360, transformOrigin: "50% 100%" });
      gsap.set("#stage-builders .b-mh", { rotation: hour * 360, transformOrigin: "50% 100%" });
      const h12 = Math.floor(hod) % 12 || 12, mins = Math.floor((hod % 1) * 60);
      $("#b-time").textContent = `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${hod < 12 ? "AM" : "PM"}`;
      $("#b-day").textContent = String(Math.floor(hour / 24) + 1).padStart(2, "0");
      $("#st-hours").textContent = Math.round(proxy.p * 72);
      $("#st-chai").textContent = Math.round(proxy.p * 27);
      $("#st-bugs").textContent = Math.round(proxy.p * 143);
    }
    render();
    const tl = chapterTL(sec, 3);
    tl.to(proxy, { p: 1, duration: 1, onUpdate: render }, 0)
      .to(parts, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.12, ease: "back.out(1.6)" }, 0.05)
      .to(cups, { scale: 1, stagger: 0.11, duration: 0.04, ease: "back.out(3)" }, 0.05)
      .to(logs, { autoAlpha: 1, stagger: 0.11, duration: 0.03 }, 0.05)
      .to("#stage-builders .rb-eye", { attr: { fill: "#4fd1ff" }, duration: 0.03 }, 0.94)
      .to("#stage-builders .b-robot", { y: "-=10", duration: 0.03, yoyo: true, repeat: 1, ease: "power2.out" }, 0.95);
  })();

  /* ==========================================================
     CH 04 — EDITORS: timeline assembles, playhead scrubs, frames cut
     ========================================================== */
  (function editors() {
    const sec = $("#ch-editors"), tlEl = $("#timeline"), frames = $$(".editor__frame");
    let bars = ""; for (let i = 0; i < 120; i++) { const h = 20 + Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 70 + ((i * 13) % 10); bars += `<rect x="${i * 0.833}" y="${50 - h / 2}" width=".45" height="${h}" fill="rgba(0,0,0,.45)"/>`; }
    $("#wave").innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${bars}</svg>`;
    const clips = $$("#timeline .clip");
    gsap.set(clips, { scaleX: 0, transformOrigin: "0% 50%" });
    gsap.set(frames[0], { opacity: 1 });
    const st = { p: 0 };
    function render() {
      const fps = 25, totalFrames = 12 * 60 * fps, f = Math.floor(st.p * totalFrames);
      const mm = Math.floor(f / (60 * fps)), ss = Math.floor(f / fps) % 60, ff = f % fps;
      $("#tc").textContent = [0, mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");
      const idx = Math.min(frames.length - 1, Math.floor(st.p * frames.length));
      frames.forEach((fr, i) => (fr.style.opacity = i === idx ? 1 : 0));
      $("#ed-pct").textContent = Math.round(st.p * 100) + "%";
    }
    const tl = chapterTL(sec, 1.8);
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
    const tl = chapterTL(sec, 2);
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
    $$(".step").forEach((s) => gsap.from($$(".step__ic, h3", s), { y: 40, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: s, containerAnimation: move, start: "left 85%", toggleActions: "play none none reverse" } }));
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

  /* ---------- content hub reveals + counters ---------- */
  gsap.set(".vcard, .insta a, .post, .comm", { autoAlpha: 0 });
  ScrollTrigger.batch(".vcard, .insta a, .post, .comm", {
    start: "top 88%",
    onEnter: (els) => gsap.fromTo(els, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.9, ease: "power3.out", overwrite: true }),
  });
  $$(".count").forEach((c) => {
    const o = { v: 0 };
    gsap.to(o, { v: +c.dataset.to, duration: 2, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 90%" }, onUpdate: () => (c.textContent = Math.round(o.v)) });
  });

  /* ---------- footer ---------- */
  gsap.from(".footer__big", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
