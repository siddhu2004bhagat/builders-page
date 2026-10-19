/* ==========================================================
   CONTENT — builds the DOM for data-driven parts of the page
   (command network, odometer, pace chart, map, team, hub).
   Animation lives in main.js; the 3D world in workshop3d.js.
   ========================================================== */
(function () {
  const D = window.BUILDERS;
  const $ = (s) => document.querySelector(s);
  const initials = (n) => n.replace("Er. ", "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const byId = Object.fromEntries(D.team.map((m) => [m.id, m]));

  /* ---------- odometer: one rolling column per digit ---------- */
  const digits = String(D.mission.target).length;
  let odo = "";
  for (let i = 0; i < digits; i++) {
    const pos = digits - 1 - i;
    odo += `<span class="odo__col" data-pos="${pos}"><span class="odo__strip">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<span>${d}</span>`).join("")}</span></span>`;
    if (pos && pos % 3 === 0) odo += `<span class="odo__sep">,</span>`;
  }
  $("#odo").innerHTML = odo;

  /* ---------- command network ---------- */
  const crew = D.team.filter((m) => m.id !== "raja");
  const pts = crew.map((m, i) => {
    const a = (-90 + i * (360 / crew.length)) * (Math.PI / 180);
    return { m, x: 50 + Math.cos(a) * 37, y: 50 + Math.sin(a) * 37 };
  });
  $("#netLines").innerHTML = pts.map((p, i) => `
    <line class="net__line" x1="50" y1="50" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}"/>
    <circle class="net__pulse" data-i="${i}" r="0.9" cx="50" cy="50"/>`).join("") + `<circle class="net__ring" cx="50" cy="50" r="12"/><circle class="net__ring net__ring--2" cx="50" cy="50" r="12"/>`;
  const face = (m, cls) => `<span class="${cls}" style="--a:${m.accent}">${m.photo ? `<img src="${m.photo}" alt="">` : initials(m.name)}</span>`;
  $("#net").insertAdjacentHTML("beforeend",
    `<div class="node node--lead" style="left:50%;top:50%">${face(byId.raja, "node__face")}<b>Er. Raja Singh</b><span class="mono">Team Lead · Manager</span></div>` +
    pts.map((p) => `
      <div class="node ${p.x > 50 ? "node--r" : p.x < 50 ? "node--l" : ""}" style="left:${p.x}%;top:${p.y}%">
        ${face(p.m, "node__face")}<b>${p.m.short}</b>
        <span class="node__order">${D.mission.directives[p.m.id] || ""}</span>
      </div>`).join(""));

  /* ---------- pace chart (plan, not actuals) ---------- */
  const W = 1000, H = 260, top = 34, base = 228, weeks = 13, bw = W / weeks;
  const start = new Date(D.mission.start), end = new Date(D.mission.end);
  const nowWeek = Math.max(0, Math.min(weeks, ((Date.now() - start) / (end - start)) * weeks));
  let bars = "";
  for (let i = 0; i < weeks; i++) {
    const h = ((i + 1) / weeks) * (base - top);
    bars += `<rect class="pace__bar ${i < Math.floor(nowWeek) ? "is-past" : ""}" x="${i * bw + 10}" y="${base - h}" width="${bw - 20}" height="${h}" rx="3"/>
             <text x="${i * bw + bw / 2}" y="${H - 8}" text-anchor="middle" class="pace__wk">W${i + 1}</text>`;
  }
  $("#pace").innerHTML = `
    <line x1="0" y1="${top}" x2="${W}" y2="${top}" class="pace__goal"/>
    <text x="${W - 6}" y="${top - 10}" text-anchor="end" class="pace__goaltxt">60,000,000 GOAL</text>
    ${bars}
    <line x1="${nowWeek * bw}" y1="${top - 6}" x2="${nowWeek * bw}" y2="${base}" class="pace__now"/>
    <text x="${nowWeek * bw + 6}" y="${top + 14}" class="pace__nowtxt">TODAY</text>`;

  /* ---------- Sahil's map (dark navigation style) ---------- */
  const pins = [
    { x: 120, y: 470, label: "WORKSHOP", cls: "home" },
    { x: 300, y: 200, label: "NEHRU PLACE", cls: "p1", item: "servo × 40" },
    { x: 560, y: 330, label: "CHANDNI CHOWK", cls: "p2", item: "LED strip × 20m" },
    { x: 690, y: 120, label: "LAJPAT RAI MKT", cls: "p3", item: "18650 × 12" },
  ];
  const route = "M120,470 C160,380 220,260 300,200 C380,140 460,250 560,330 C640,390 700,260 690,120";
  const blocks = Array.from({ length: 70 }, (_, i) => { const x = (i % 10) * 82 + 6 + ((i * 7) % 11), y = Math.floor(i / 10) * 88 + 8 + ((i * 13) % 9); return `<rect x="${x}" y="${y}" width="${60 + ((i * 17) % 14)}" height="${62 + ((i * 11) % 14)}" rx="4" fill="#15151b"/>`; }).join("");
  $("#stage-sahil").insertAdjacentHTML("afterbegin", `
    <svg class="map" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-label="Live map of Sahil's route through Delhi's electronics markets">
      <rect width="800" height="600" fill="#0e0e13"/>
      ${blocks}
      <g stroke="#23232c" stroke-width="16" stroke-linecap="round" fill="none"><path d="M0,120 L800,90"/><path d="M0,330 L800,360"/><path d="M0,500 L800,470"/><path d="M180,0 L210,600"/><path d="M430,0 L410,600"/><path d="M640,0 L660,600"/></g>
      <g stroke="#3a3420" stroke-width="5" fill="none" opacity=".8"><path d="M0,120 L800,90"/><path d="M430,0 L410,600"/></g>
      <path d="M0,560 C200,520 300,600 520,570 S760,540 800,560 L800,600 L0,600 Z" fill="#0b1a2b"/>
      <rect x="440" y="400" width="80" height="54" rx="6" fill="#10241a"/><rect x="70" y="160" width="70" height="50" rx="6" fill="#10241a"/>
      <path id="route" d="${route}" fill="none" stroke="#4fd1ff" stroke-width="4" stroke-dasharray="1 9" stroke-linecap="round" opacity=".5"/>
      <path class="route-done" d="${route}" fill="none" stroke="#4fd1ff" stroke-width="6" stroke-linecap="round"/>
      ${pins.map((p) => `
        <g class="pin pin--${p.cls}" transform="translate(${p.x},${p.y})">
          <circle r="20" class="pin-pulse" fill="${p.cls === "home" ? "rgba(92,242,162,.2)" : "rgba(255,122,26,.2)"}"/>
          <circle r="8" fill="${p.cls === "home" ? "#5cf2a2" : "#ff7a1a"}" stroke="#0e0e13" stroke-width="3"/>
          <text y="28" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#cfcac0" letter-spacing="1">${p.label}</text>
          ${p.item ? `<g class="pin-item"><rect x="-64" y="-46" width="128" height="26" rx="13" fill="#f3ede2"/><text y="-28" text-anchor="middle" font-family="Space Grotesk" font-size="12" font-weight="500" fill="#111">✓ ${p.item}</text></g>` : ""}
        </g>`).join("")}
      <g id="tracker"><circle r="22" fill="rgba(79,209,255,.18)" class="trk-halo"/><circle r="9" fill="#4fd1ff" stroke="#fff" stroke-width="3"/></g>
    </svg>`);

  /* ---------- waveform ---------- */
  let wave = "";
  for (let i = 0; i < 120; i++) { const h = 20 + Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) * 70 + ((i * 13) % 10); wave += `<rect x="${i * 0.833}" y="${50 - h / 2}" width=".45" height="${h}" fill="rgba(0,0,0,.45)"/>`; }
  $("#wave").innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${wave}</svg>`;

  /* ---------- team rail ---------- */
  $("#team-rail").innerHTML = D.team.map((m, i) => `
    <article class="member" data-cursor="drag" style="--a:${m.accent}">
      <div class="member__pic">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy">` : `<div class="member__mono"><span class="display">${initials(m.name)}</span></div>`}
        <span class="member__role">${m.role}</span><span class="member__no mono">${String(i + 1).padStart(2, "0")}/07</span>
      </div>
      <h3>${m.name}</h3><p>${m.line}</p>
    </article>`).join("");

  /* ---------- content hub ---------- */
  const s = D.socials;
  const play = `<span class="vcard__play"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 4v16l13-8z" fill="currentColor"/></svg></span>`;
  const vthumb = (v) => `<div style="background-image:url(${v.thumb})"><span class="ttl display">${v.ttl}</span></div>`;
  const [v0, ...vRest] = D.videos;
  $("#videos").innerHTML = `
    <a class="vcard" href="${v0.url}" target="_blank" rel="noopener" data-cursor="play"><div class="vcard__thumb">${vthumb(v0)}${play}</div><div class="vcard__meta"><h3>${v0.title}</h3><span>${v0.views} · ${v0.date}</span></div></a>
    <div class="videos__side">${vRest.map((v) => `<a class="vcard vcard--small" href="${v.url}" target="_blank" rel="noopener" data-cursor="play"><div class="vcard__thumb">${vthumb(v)}${play}</div><div class="vcard__meta"><h3>${v.title}</h3><span>${v.views}</span></div></a>`).join("")}</div>`;
  $("#insta").innerHTML = D.insta.map((p) => `<a href="${p.url === "#" ? s.instagram : p.url}" target="_blank" rel="noopener" data-likes="${p.likes}"><div style="background-image:url(${p.img})"></div></a>`).join("");
  $("#blog").innerHTML = D.blog.map((b) => `<a class="post" href="${b.url}"><span class="mono">${b.tag}</span><h3>${b.title}</h3><p>${b.excerpt}</p><span class="mono" style="color:var(--ink-mute)">${b.date} · ${b.read} read</span></a>`).join("");
  $("#community").innerHTML = D.community.map((c) => `<a class="comm" href="${s[c.url] || c.url}" target="_blank" rel="noopener" style="--c:${c.color}"><h3>${c.title}</h3><div><b><span class="count" data-to="${c.num}">0</span>${c.suffix}</b><p>${c.sub}</p></div></a>`).join("");

  /* ---------- story words ---------- */
  const st = $("#storyText");
  st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");

  /* ---------- photo credits (CC licences require attribution) ---------- */
  fetch("assets/img/credits.json").then((r) => r.json()).then((list) => {
    $("#credits").innerHTML = list.map((c) => `<li><a href="${c.source}" target="_blank" rel="noopener">${c.title.replace(/^File:/, "")}</a> by ${c.creator} · ${c.license}</li>`).join("");
  }).catch(() => {});
})();
