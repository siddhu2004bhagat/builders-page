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
  const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e5 ? 0 : 1) + "K" : String(n)).replace(".0", "");
  const ago = (d) => { const days = Math.round((Date.now() - new Date(d)) / 864e5); return days < 1 ? "today" : days < 7 ? days + "d ago" : days < 60 ? Math.round(days / 7) + "w ago" : Math.round(days / 30) + "mo ago"; };
  const best = [...D.videos].sort((a, b) => b.views - a.views)[0];
  const short = (v, cls = "") => `
    <a class="short ${cls}" href="https://www.youtube.com/shorts/${v.id}" target="_blank" rel="noopener" data-cursor="play">
      <div class="short__thumb" style="background-image:url(assets/yt/${v.id}.jpg)"></div>
      <span class="short__views">▶ ${fmt(v.views)}</span>${v.id === best.id ? '<span class="short__badge">Most viewed</span>' : ""}
      <div class="short__meta"><h3>${v.title}</h3><span>${ago(v.date)}</span></div>
    </a>`;
  $("#videos").innerHTML = D.videos.slice(0, 10).map((v) => short(v)).join("");
  $("#insta").innerHTML = D.videos.slice(5, 11).map((v) => `<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Builders.mu on Instagram"><div style="background-image:url(assets/yt/${v.id}.jpg)"></div><span class="insta__ic">↗</span></a>`).join("");
  $("#blog").innerHTML = D.blog.map((b) => `<a class="post" href="${b.url}"><span class="mono">${b.tag}</span><h3>${b.title}</h3><p>${b.excerpt}</p><span class="mono" style="color:var(--ink-mute)">${b.date} · ${b.read} read</span></a>`).join("");
  $("#community").innerHTML = D.stats.map((c) => `<a class="comm" href="${s[c.url] || c.url}" target="_blank" rel="noopener" style="--c:${c.color}"><h3>${c.title}</h3><div><b><span class="count" data-to="${c.num}" data-dec="${c.dec || 0}">0</span>${c.suffix}</b><p>${c.sub}</p></div></a>`).join("");

  /* ---------- real faces on 3D labels + tour cards ---------- */
  document.querySelectorAll(".tag3d").forEach((el) => { const m = byId[el.dataset.track]; if (m && m.photo) { el.classList.add("has-pic"); el.insertAdjacentHTML("afterbegin", `<img src="${m.photo}" alt="">`); } });
  document.querySelectorAll(".tour__card[data-who]").forEach((el) => { const pics = el.dataset.who.split(" ").map((id) => byId[id]).filter((m) => m && m.photo); if (pics.length) el.insertAdjacentHTML("afterbegin", `<div class="tour__pics">${pics.map((m) => `<img src="${m.photo}" alt="${m.name}">`).join("")}</div>`); });

  /* ---------- sanitizer crowd: the team peeking from behind ---------- */
  const crowd = ["sudhanshu", "raja", "prateek", "ratnam", "virendra", "aryan", "sahil"].map((id) => byId[id]);
  $("#saniCrowd").innerHTML = crowd.map((m, i) => `
    <div class="fan" style="--i:${i};--a:${m.accent}">
      <div class="fan__body">${m.photo ? `<img src="${m.photo}" alt="">` : `<span>${initials(m.name)}</span>`}<i class="fan__lol">😂</i></div>
      <b class="mono">${m.short}</b>
    </div>`).join("");

  /* ---------- story words ---------- */
  const st = $("#storyText");
  st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");

  /* ---------- photo credits (CC licences require attribution) ---------- */
  fetch("assets/img/credits.json").then((r) => r.json()).then((list) => {
    $("#credits").innerHTML = list.map((c) => `<li><a href="${c.source}" target="_blank" rel="noopener">${c.title.replace(/^File:/, "")}</a> by ${c.creator} · ${c.license}</li>`).join("");
  }).catch(() => {});
})();
