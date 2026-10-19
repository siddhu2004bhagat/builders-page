/* ==========================================================
   SCENES — the per-person "work" animations, drawn as inline SVG
   so GSAP can animate individual parts (arms typing, whiteboard
   drawing, day/night cycle, robot assembly, scooter route).
   ========================================================== */
(function () {
  const D = window.BUILDERS;
  const look = (id) => D.team.find((m) => m.id === id).look;
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    return "#" + ((c(n >> 16) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).padStart(6, "0");
  };

  /* ---------- profile head (faces right, centred on 0,0) ---------- */
  function hair(style, c) {
    switch (style) {
      case "spiky":
        return `<path d="M-22,4 C-25,-14 -16,-22 -10,-24 L-8,-34 L-2,-25 L4,-36 L8,-25 L15,-33 L16,-21 C21,-17 23,-11 22,-6 L8,-10 C0,-12 -8,-8 -12,4 Z" fill="${c}"/>`;
      case "curly":
        return `<g fill="${c}"><circle cx="-14" cy="-10" r="10"/><circle cx="-4" cy="-19" r="10"/><circle cx="8" cy="-20" r="9"/><circle cx="17" cy="-12" r="7"/><circle cx="-18" cy="2" r="8"/></g>`;
      case "long":
        return `<path d="M-21,0 C-24,-20 -6,-27 8,-23 C18,-20 23,-12 21,-6 L6,-9 C-4,-10 -10,-4 -12,6 L-12,34 L-26,30 Z" fill="${c}"/>`;
      case "cap":
        return `<path d="M-21,-2 C-22,-20 -6,-26 6,-25 C16,-24 21,-16 21,-10 Z" fill="${c}"/><path d="M14,-12 L34,-9 L33,-6 L12,-8 Z" fill="${c}"/>`;
      case "side":
        return `<path d="M-22,4 C-25,-18 -10,-28 6,-25 C18,-23 23,-14 22,-6 C14,-14 4,-16 -4,-12 C-10,-8 -12,-2 -12,4 Z" fill="${c}"/>`;
      default:
        return `<path d="M-21,2 C-24,-18 -10,-26 4,-24 C16,-23 22,-14 21,-8 L8,-10 C0,-12 -8,-8 -12,2 Z" fill="${c}"/>`;
    }
  }
  function head(L) {
    return `
      <rect x="-6" y="14" width="12" height="16" fill="${shade(L.skin, -20)}"/>
      <circle r="20" fill="${L.skin}"/>
      <path d="M18,-3 L25,4 L18,7 Z" fill="${L.skin}"/>
      <circle cx="-4" cy="2" r="4.5" fill="${shade(L.skin, -25)}"/>
      ${hair(L.style, L.hair)}
      <circle class="eye" cx="10" cy="-2" r="2.2" fill="#111"/>
      ${L.beard ? `<path d="M-6,8 C0,24 16,24 21,8 L19,6 C12,13 2,13 -6,5 Z" fill="${L.hair}"/>` : `<path d="M10,11 Q14,13 17,10" stroke="#5a2e1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`}
      ${L.glasses ? `<circle cx="11" cy="-2" r="6.5" fill="rgba(79,209,255,.15)" stroke="#111" stroke-width="2"/><path d="M5,-3 L-3,-2" stroke="#111" stroke-width="2"/>` : ""}
      ${L.headphones ? `<path d="M-20,-4 C-20,-34 18,-34 16,-8" stroke="#222" stroke-width="5" fill="none"/><rect x="-11" y="-6" width="12" height="16" rx="5" fill="#222"/><rect x="-9" y="-4" width="8" height="12" rx="3" fill="${L.shirt}"/>` : ""}`;
  }

  /* ---------- seated person, faces right; origin = seat ---------- */
  function seated(id, x, y, s = 1, flip = false, L = look(id)) {
    const pants = "#2b2a36";
    return `
    <g class="person person--${id}" transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
      <rect x="-40" y="-72" width="10" height="74" rx="4" fill="#26252e"/>
      <rect x="-36" y="-4" width="58" height="9" rx="3" fill="#26252e"/>
      <rect x="-8" y="5" width="6" height="34" fill="#1d1c22"/>
      <path d="M-30,44 L24,44" stroke="#1d1c22" stroke-width="5" stroke-linecap="round"/>
      <path d="M-4,-6 L40,-6 L42,40" stroke="${pants}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="50" cy="44" rx="12" ry="5.5" fill="#0f0f12"/>
      <g class="arm arm-back" transform="translate(0,-66)"><g class="arm-r"><path d="M0,0 L16,32 L44,30" stroke="${shade(L.shirt, -45)}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="47" cy="30" r="5.5" fill="${shade(L.skin, -20)}"/></g></g>
      <path d="M-20,0 L-16,-66 Q-14,-80 0,-80 Q14,-80 14,-66 L12,0 Z" fill="${L.shirt}"/>
      <g class="head" transform="translate(4,-104)"><g class="head-r">${head(L)}</g></g>
      <g class="arm arm-front" transform="translate(4,-64)"><g class="arm-r"><path d="M0,0 L18,30 L48,26" stroke="${shade(L.shirt, -15)}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="51" cy="26" r="6" fill="${L.skin}"/></g></g>
    </g>`;
  }

  /* ---------- standing person; origin = hip ---------- */
  function standing(id, x, y, s = 1, flip = false, pose = "down", L = look(id)) {
    const pants = "#2b2a36";
    const arms = {
      down: `<path d="M0,0 L6,34 L10,62" stroke="${shade(L.shirt, -15)}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="66" r="6" fill="${L.skin}"/>`,
      point: `<path d="M0,0 L26,-12 L54,-34" stroke="${shade(L.shirt, -15)}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="57" cy="-36" r="6" fill="${L.skin}"/><rect x="56" y="-52" width="5" height="16" rx="2" fill="#ff7a1a" transform="rotate(30 58 -44)"/>`,
      phone: `<path d="M0,0 L16,22 L16,-30" stroke="${shade(L.shirt, -15)}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="-33" r="6" fill="${L.skin}"/><rect x="10" y="-52" width="10" height="20" rx="3" fill="#111" stroke="#4fd1ff" stroke-width="1.5"/>`,
    };
    return `
    <g class="person person--${id}" transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
      <path d="M-5,0 L-8,80" stroke="${shade(pants, -10)}" stroke-width="15" stroke-linecap="round"/>
      <path d="M5,0 L8,80" stroke="${pants}" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="-2" cy="86" rx="12" ry="5" fill="#0f0f12"/><ellipse cx="14" cy="86" rx="12" ry="5" fill="#0f0f12"/>
      <g class="arm arm-back" transform="translate(-4,-64)"><path d="M0,0 L-6,34 L-4,62" stroke="${shade(L.shirt, -45)}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-4" cy="66" r="5.5" fill="${shade(L.skin, -20)}"/></g>
      <path d="M-18,6 L-16,-66 Q-14,-80 0,-80 Q14,-80 14,-66 L16,6 Z" fill="${L.shirt}"/>
      <g class="head" transform="translate(4,-104)"><g class="head-r">${head(L)}</g></g>
      <g class="arm arm-front" transform="translate(4,-64)"><g class="arm-r">${arms[pose]}</g></g>
    </g>`;
  }

  /* ---------- props ---------- */
  const monitor = (x, y, w = 70, h = 46, cls = "", inner = "") => `
    <g transform="translate(${x},${y})" class="${cls}">
      <rect x="${-w / 2 - 4}" y="${-h - 4}" width="${w + 8}" height="${h + 8}" rx="4" fill="#0b0b0e" stroke="#33323d" stroke-width="2"/>
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="2" fill="#0d1b26"/>
      ${inner}
      <rect x="-4" y="4" width="8" height="14" fill="#2a2933"/><rect x="-16" y="17" width="32" height="4" rx="2" fill="#2a2933"/>
    </g>`;
  const codeLines = (w, h) => {
    let s = "";
    const cols = ["#4fd1ff", "#5cf2a2", "#ff7a1a", "#a78bfa", "#f3ede2"];
    for (let i = 0; i < Math.floor(h / 7); i++) {
      const ind = (i % 4) * 5, len = 10 + ((i * 37) % (w - 24 - ind));
      s += `<rect class="code-ln" x="${-w / 2 + 5 + ind}" y="${-h + 5 + i * 7}" width="${len}" height="3" rx="1.5" fill="${cols[i % 5]}" opacity=".85"/>`;
    }
    return s;
  };
  const timelineMini = (w, h) => `
    <rect x="${-w / 2 + 4}" y="${-h + 4}" width="${w - 8}" height="${h * 0.48}" fill="#1a2a3a"/>
    <circle cx="0" cy="${-h + 4 + h * 0.24}" r="${h * 0.12}" fill="#ff7a1a" class="mini-sun"/>
    <rect x="${-w / 2 + 4}" y="${-h * 0.4}" width="${w * 0.4}" height="5" fill="#4fd1ff"/><rect x="${-w / 2 + 6 + w * 0.4}" y="${-h * 0.4}" width="${w * 0.3}" height="5" fill="#a78bfa"/>
    <rect x="${-w / 2 + 4}" y="${-h * 0.4 + 8}" width="${w * 0.55}" height="5" fill="#5cf2a2"/><rect x="${-w / 2 + 8 + w * 0.55}" y="${-h * 0.4 + 8}" width="${w * 0.25}" height="5" fill="#ffb36b"/>
    <rect class="mini-playhead" x="${-w / 2 + 6}" y="${-h * 0.48}" width="1.5" height="${h * 0.44}" fill="#ff5c8a"/>`;
  const robot = (x, y, s = 1, cls = "") => `
    <g transform="translate(${x},${y}) scale(${s})" class="robot ${cls}">
      <rect class="rb-part rb-base" x="-34" y="-14" width="68" height="14" rx="4" fill="#3a3946"/>
      <rect class="rb-part rb-body" x="-24" y="-56" width="48" height="42" rx="8" fill="#ff7a1a"/>
      <circle class="rb-part rb-dial" cx="0" cy="-35" r="7" fill="#0d0c10" stroke="#ffb36b" stroke-width="2"/>
      <rect class="rb-part rb-arm-l" x="-40" y="-52" width="14" height="32" rx="6" fill="#d4621a"/>
      <rect class="rb-part rb-arm-r" x="26" y="-52" width="14" height="32" rx="6" fill="#d4621a"/>
      <rect class="rb-part rb-neck" x="-5" y="-64" width="10" height="9" fill="#3a3946"/>
      <rect class="rb-part rb-head" x="-22" y="-92" width="44" height="30" rx="8" fill="#f3ede2"/>
      <g class="rb-part rb-eyes"><circle class="rb-eye" cx="-9" cy="-77" r="5" fill="#222"/><circle class="rb-eye" cx="9" cy="-77" r="5" fill="#222"/></g>
      <path class="rb-part rb-ant" d="M0,-92 L0,-104" stroke="#3a3946" stroke-width="3"/><circle class="rb-part rb-ant rb-led" cx="0" cy="-106" r="4" fill="#ff5c8a"/>
    </g>`;
  const mug = (x, y, c = "#f3ede2", cls = "") => `<g class="${cls}" transform="translate(${x},${y})"><rect x="-7" y="-14" width="14" height="14" rx="2" fill="${c}"/><path d="M7,-11 Q13,-8 7,-4" stroke="${c}" stroke-width="2.5" fill="none"/><path class="steam" d="M-2,-18 Q-5,-24 -1,-28 Q3,-32 0,-38" stroke="rgba(255,255,255,.35)" stroke-width="1.5" fill="none"/></g>`;

  /* ==========================================================
     2) CHAPTER SCENES
     ========================================================== */
  function rajaScene() {
    return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-label="Raja planning a build on a whiteboard">
      <rect width="800" height="600" fill="#15141a"/>
      <rect x="40" y="60" width="620" height="400" rx="10" fill="#ecebe6" stroke="#3a3946" stroke-width="10"/>
      <rect x="40" y="460" width="620" height="14" fill="#3a3946"/>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
        <text class="wb-t" x="80" y="110" font-family="Anton" font-size="30" fill="#1a1a1a">EP. 52 — SHINCHAN SANITIZER</text>
        <path class="draw" d="M80,124 L420,124" stroke="#ff7a1a"/>
        <rect class="draw" x="80" y="160" width="130" height="64" rx="10" stroke="#1a1a1a"/>
        <text class="wb-t" x="145" y="199" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="#1a1a1a">IDEA</text>
        <path class="draw" d="M216,192 L278,192 M266,182 L278,192 L266,202" stroke="#1a1a1a"/>
        <rect class="draw" x="284" y="160" width="130" height="64" rx="10" stroke="#ff7a1a"/>
        <text class="wb-t" x="349" y="199" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="#ff7a1a">BUILD</text>
        <path class="draw" d="M420,192 L482,192 M470,182 L482,192 L470,202" stroke="#1a1a1a"/>
        <rect class="draw" x="488" y="160" width="130" height="64" rx="10" stroke="#1f6fff"/>
        <text class="wb-t" x="553" y="199" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="#1f6fff">SHOOT</text>
        <path class="draw" d="M553,230 L553,282 M543,270 L553,282 L563,270" stroke="#1a1a1a"/>
        <rect class="draw" x="488" y="288" width="130" height="64" rx="10" stroke="#d61f5a"/>
        <text class="wb-t" x="553" y="327" text-anchor="middle" font-family="JetBrains Mono" font-size="17" fill="#d61f5a">UPLOAD</text>
        <rect class="draw" x="110" y="290" width="70" height="56" rx="8" stroke="#1a1a1a"/>
        <rect class="draw" x="120" y="350" width="50" height="60" rx="6" stroke="#1a1a1a"/>
        <circle class="draw" cx="132" cy="316" r="7" stroke="#1a1a1a"/><circle class="draw" cx="158" cy="316" r="7" stroke="#1a1a1a"/>
        <path class="draw" d="M170,370 L220,350 L236,326" stroke="#1a1a1a"/>
        <path class="draw" d="M228,300 L250,300 L246,330 L232,330 Z" stroke="#ff7a1a"/>
        <path class="draw" d="M236,292 Q232,282 238,276 M244,292 Q240,282 246,276" stroke="#aaa" stroke-width="3"/>
        <path class="draw" d="M270,420 C310,380 350,430 400,400" stroke="#1a1a1a" stroke-width="3"/>
        <text class="wb-t" x="290" y="444" font-family="JetBrains Mono" font-size="13" fill="#1a1a1a">pours chai in 9s ☕</text>
        <ellipse class="draw" cx="370" cy="300" rx="70" ry="30" stroke="#d61f5a" stroke-width="3"/>
        <text class="wb-t" x="370" y="306" text-anchor="middle" font-family="Anton" font-size="18" fill="#d61f5a">DEADLINE: FRI</text>
      </g>
      <g class="sticky" transform="translate(600,82) rotate(8)"><rect width="74" height="74" fill="#ffd23f"/><text x="37" y="34" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#111">CALL</text><text x="37" y="50" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#111">SAHIL</text></g>
      <g class="sticky" transform="translate(56,380) rotate(-6)"><rect width="70" height="70" fill="#5cf2a2"/><text x="35" y="32" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#111">HOOK</text><text x="35" y="47" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#111">IN 5s</text></g>
      <g class="sticky" transform="translate(430,390) rotate(4)"><rect width="66" height="66" fill="#ff5c8a"/><text x="33" y="30" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#111">BUDGET</text><text x="33" y="45" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#111">₹15K</text></g>
      <rect x="0" y="560" width="800" height="40" fill="#0d0c10"/>
      ${standing("raja", 700, 440, 1.45, true, "point")}
    </svg>`;
  }

  function buildersScene() {
    const stars = Array.from({ length: 40 }, (_, i) => `<circle class="b-star" cx="${70 + ((i * 89) % 660)}" cy="${40 + ((i * 47) % 170)}" r="${(i % 3) * 0.55 + 0.7}" fill="#fff"/>`).join("");
    const cups = Array.from({ length: 8 }, (_, i) => mug(470 + (i % 4) * 22, 412 - Math.floor(i / 4) * 16, ["#f3ede2", "#ff7a1a", "#4fd1ff", "#5cf2a2"][i % 4], "b-cup")).join("");
    const cloud = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="14"/><ellipse cx="-20" cy="4" rx="22" ry="11"/><ellipse cx="22" cy="5" rx="24" ry="10"/><ellipse cx="4" cy="-9" rx="20" ry="12"/></g>`;
    return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-label="Two engineers building a robot through day and night">
      <defs>
        <clipPath id="winClip"><rect x="60" y="30" width="680" height="240"/></clipPath>
        <linearGradient id="bSkyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="b-sky-top" stop-color="#3f9cff"/><stop offset="1" class="b-sky-bot" stop-color="#bfe6ff"/></linearGradient>
        <radialGradient id="bSunG"><stop offset="0" stop-color="rgba(255,226,120,.75)"/><stop offset="1" stop-color="rgba(255,226,120,0)"/></radialGradient>
        <radialGradient id="bMoonG"><stop offset="0" stop-color="rgba(200,220,255,.35)"/><stop offset="1" stop-color="rgba(200,220,255,0)"/></radialGradient>
        <radialGradient id="bLamp"><stop offset="0" stop-color="rgba(255,179,107,.55)"/><stop offset="1" stop-color="rgba(255,179,107,0)"/></radialGradient>
        <linearGradient id="bBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,244,214,.32)"/><stop offset="1" stop-color="rgba(255,244,214,0)"/></linearGradient>
        <linearGradient id="bCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,200,130,.55)"/><stop offset="1" stop-color="rgba(255,200,130,0)"/></linearGradient>
        <radialGradient id="bMonG"><stop offset="0" stop-color="rgba(79,209,255,.5)"/><stop offset="1" stop-color="rgba(79,209,255,0)"/></radialGradient>
        <linearGradient id="bWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1c24"/><stop offset="1" stop-color="#121117"/></linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bWall)"/>
      <g clip-path="url(#winClip)">
        <rect class="b-sky" x="60" y="30" width="680" height="240" fill="url(#bSkyG)"/>
        <g class="b-stars" opacity="0">${stars}</g>
        <path class="b-shoot" d="M0,0 L-60,22" stroke="url(#bBeam)" stroke-width="2.5" stroke-linecap="round" opacity="0"/>
        <g class="b-orbit">
          <circle cx="400" cy="70" r="70" fill="url(#bSunG)"/><circle class="b-sun" cx="400" cy="70" r="28" fill="#ffd23f"/>
          <circle cx="400" cy="590" r="60" fill="url(#bMoonG)"/><circle class="b-moon" cx="400" cy="590" r="22" fill="#e9eef7"/>
          <circle cx="393" cy="584" r="4" fill="#cdd5e3"/><circle cx="407" cy="596" r="3" fill="#cdd5e3"/><circle cx="404" cy="580" r="2" fill="#cdd5e3"/>
        </g>
        <g class="b-clouds" fill="#fff" opacity=".85">${cloud(160, 80, 1)}${cloud(520, 60, 0.8)}${cloud(690, 110, 0.7)}</g>
        <path d="M60,232 L110,206 L150,214 L200,186 L260,210 L320,190 L380,214 L440,192 L520,216 L580,196 L650,220 L740,200 L740,270 L60,270 Z" fill="#2b3456" class="b-city-far" opacity=".8"/>
        <path d="M60,220 L120,180 L160,200 L220,150 L290,196 L350,170 L420,206 L480,160 L560,200 L620,176 L700,210 L740,190 L740,270 L60,270 Z" fill="#1d2440" class="b-city"/>
        <g class="b-windows" fill="#ffd23f" opacity="0">${Array.from({ length: 22 }, (_, i) => `<rect x="${80 + i * 30}" y="${214 + ((i * 7) % 4) * 12}" width="4" height="5"/>`).join("")}</g>
      </g>
      <rect x="56" y="26" width="688" height="248" fill="none" stroke="#2f2e38" stroke-width="10"/><path d="M400,30 L400,270" stroke="#2f2e38" stroke-width="6"/>
      <polygon class="b-beam" points="70,274 730,274 800,600 0,600" fill="url(#bBeam)" opacity=".6"/>
      <g transform="translate(700,330)"><circle r="34" fill="#0d0c10" stroke="#3a3946" stroke-width="5"/><path class="b-hh" d="M0,0 L0,-16" stroke="#f3ede2" stroke-width="4" stroke-linecap="round"/><path class="b-mh" d="M0,0 L0,-26" stroke="#ff7a1a" stroke-width="3" stroke-linecap="round"/><circle r="3.5" fill="#ff7a1a"/></g>
      <rect x="0" y="500" width="800" height="100" fill="#0d0c10"/>
      <ellipse cx="400" cy="548" rx="300" ry="18" fill="#000" opacity=".45"/>
      ${seated("sudhanshu", 128, 486, 1.5)}
      ${seated("aryan", 672, 486, 1.5, true)}
      <rect x="190" y="420" width="420" height="16" rx="4" fill="#5a4a3a"/><rect x="190" y="420" width="420" height="3" rx="1.5" fill="#7a6650"/><rect x="204" y="436" width="14" height="110" fill="#3a2d22"/><rect x="582" y="436" width="14" height="110" fill="#3a2d22"/>
      ${monitor(250, 394, 90, 58, "b-mon", codeLines(90, 58))}
      ${robot(400, 418, 1.5, "b-robot")}
      ${cups}
      <g transform="translate(560,418)"><rect x="-26" y="-8" width="52" height="8" fill="#1f6f4a"/><g fill="#ffd23f">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-22 + i * 8}" y="-6" width="4" height="4"/>`).join("")}</g></g>
      <rect class="b-dark" width="800" height="600" fill="#04071a" opacity="0" style="mix-blend-mode:multiply"/>
      <polygon class="b-cone" points="384,318 416,318 560,548 240,548" fill="url(#bCone)" opacity="0" style="mix-blend-mode:screen"/>
      <circle cx="400" cy="420" r="230" fill="url(#bLamp)" class="b-lampglow" opacity=".25" style="mix-blend-mode:screen"/>
      <circle cx="250" cy="370" r="110" fill="url(#bMonG)" class="b-monglow" opacity=".3" style="mix-blend-mode:screen"/>
      <g class="b-sparks">${Array.from({ length: 14 }, () => `<circle class="spark" cx="440" cy="360" r="2.4" fill="#ffd23f"/>`).join("")}</g>
      <path d="M400,200 L400,300" stroke="#3a3946" stroke-width="4"/><path d="M366,300 L434,300 L420,320 L380,320 Z" fill="#3a3946"/><ellipse cx="400" cy="320" rx="20" ry="5" fill="#ffd8a8" class="b-bulb"/>
      <g class="b-tag b-tag--s" transform="translate(134,258)"><rect x="-86" y="-22" width="172" height="46" rx="23" fill="#0d0c10" stroke="#4fd1ff" stroke-width="2"/><text y="-1" text-anchor="middle" font-family="Anton" font-size="18" fill="#f3ede2" letter-spacing=".5">SUDHANSHU</text><text class="b-tag-sub" y="14" text-anchor="middle" font-family="JetBrains Mono" font-size="9.5" fill="#4fd1ff">● flashing firmware</text><path d="M-6,24 L0,32 L6,24 Z" fill="#4fd1ff"/></g>
      <g class="b-tag b-tag--a" transform="translate(666,258)"><rect x="-86" y="-22" width="172" height="46" rx="23" fill="#0d0c10" stroke="#5cf2a2" stroke-width="2"/><text y="-1" text-anchor="middle" font-family="Anton" font-size="18" fill="#f3ede2" letter-spacing=".5">ARYAN</text><text class="b-tag-sub" y="14" text-anchor="middle" font-family="JetBrains Mono" font-size="9.5" fill="#5cf2a2">● cutting metal</text><path d="M-6,24 L0,32 L6,24 Z" fill="#5cf2a2"/></g>
    </svg>`;
  }

  function sahilScene() {
    const pins = [
      { x: 120, y: 470, label: "WORKSHOP", cls: "home", item: "" },
      { x: 300, y: 200, label: "NEHRU PLACE", cls: "p1", item: "servo × 40" },
      { x: 560, y: 330, label: "CHANDNI CHOWK", cls: "p2", item: "LED strip × 20m" },
      { x: 690, y: 120, label: "LAJPAT RAI MKT", cls: "p3", item: "Li-ion 18650 × 12" },
    ];
    return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-label="Map of Sahil's route through markets sourcing parts">
      <rect width="800" height="600" fill="#121117"/>
      <g stroke="#1f1e27" stroke-width="18" stroke-linecap="round">
        <path d="M0,120 L800,90"/><path d="M0,330 L800,360"/><path d="M0,500 L800,470"/>
        <path d="M180,0 L210,600"/><path d="M430,0 L410,600"/><path d="M640,0 L660,600"/>
      </g>
      <g stroke="#191820" stroke-width="7"><path d="M0,230 L800,220"/><path d="M300,0 L320,600"/><path d="M540,0 L530,600"/></g>
      <path d="M0,560 C200,520 300,600 520,570 S760,540 800,560 L800,600 L0,600 Z" fill="#0c2033"/>
      <rect x="440" y="400" width="80" height="54" rx="6" fill="#142a1d"/><rect x="70" y="160" width="70" height="50" rx="6" fill="#142a1d"/>
      <path id="route" d="M120,470 C160,380 220,260 300,200 C380,140 460,250 560,330 C640,390 700,260 690,120" fill="none" stroke="#ff7a1a" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" opacity=".35"/>
      <path class="route-done" d="M120,470 C160,380 220,260 300,200 C380,140 460,250 560,330 C640,390 700,260 690,120" fill="none" stroke="#ff7a1a" stroke-width="5" stroke-linecap="round"/>
      ${pins.map((p) => `
        <g class="pin pin--${p.cls}" transform="translate(${p.x},${p.y})">
          <circle r="22" fill="rgba(255,122,26,.15)" class="pin-pulse"/>
          <path d="M0,0 C-14,-18 -14,-36 0,-36 C14,-36 14,-18 0,0 Z" fill="${p.cls === "home" ? "#5cf2a2" : "#ff7a1a"}"/>
          <circle cy="-24" r="5" fill="#0d0c10"/>
          <text y="20" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#f3ede2" letter-spacing="1">${p.label}</text>
          ${p.item ? `<g class="pin-item"><rect x="-62" y="-72" width="124" height="24" rx="12" fill="#f3ede2"/><text y="-56" text-anchor="middle" font-family="Space Grotesk" font-size="11" fill="#111">✓ ${p.item}</text></g>` : ""}
        </g>`).join("")}
      <g id="scooter">
        <g transform="translate(-26,-34)">
          <circle cx="8" cy="30" r="7" fill="#111" stroke="#555" stroke-width="2"/><circle cx="44" cy="30" r="7" fill="#111" stroke="#555" stroke-width="2"/>
          <path d="M4,24 L30,24 L40,10 L46,10 L50,26 L36,26 Z" fill="#ffd23f"/><path d="M40,10 L44,0" stroke="#ccc" stroke-width="3"/>
          <rect x="2" y="12" width="20" height="12" rx="2" fill="#a07a4a"/>
          <rect x="24" y="-6" width="12" height="20" rx="5" fill="#ffd23f"/><circle cx="30" cy="-14" r="8" fill="#B5764A"/><path d="M22,-16 C22,-26 38,-26 38,-16 Z" fill="#ff5c8a"/>
        </g>
      </g>
    </svg>`;
  }

  /* ==========================================================
     REVEAL — the team losing it over what the engineers built
     front-facing figures; each pose is its own group so the
     scroll timeline can swap them (down → hands-on-head etc.)
     ========================================================== */
  const byId = Object.fromEntries(D.team.map((m) => [m.id, m]));
  function cheer(id, x, y, s, poses, face = {}) {
    const m = byId[id], L = m.look, pants = "#24232d", arm = shade(L.shirt, -18);
    const limb = (d, hx, hy) => `<path d="${d}" stroke="${arm}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${hx}" cy="${hy}" r="5.5" fill="${L.skin}"/>`;
    const POSE = {
      down: limb("M-18,-70 L-26,-36 L-24,-6", -24, -3) + limb("M18,-70 L26,-36 L24,-6", 24, -3),
      head: limb("M-18,-70 L-46,-98 L-30,-130", -29, -133) + limb("M18,-70 L46,-98 L30,-130", 29, -133),
      up: limb("M-18,-70 L-34,-104 L-42,-142", -43, -145) + limb("M18,-70 L34,-104 L42,-142", 43, -145),
      clap: limb("M-18,-70 L-26,-42 L-5,-58", -4, -59) + limb("M18,-70 L26,-42 L5,-60", 4, -61),
      camera: limb("M-18,-70 L-28,-86 L-14,-100", -13, -101) + limb("M18,-70 L28,-86 L14,-100", 13, -101) +
        `<g class="rv-cam"><rect x="-19" y="-118" width="38" height="24" rx="4" fill="#15151a" stroke="#3a3946" stroke-width="2"/><circle cx="0" cy="-106" r="7" fill="#0b1a26" stroke="#4fd1ff" stroke-width="2"/><circle class="rv-rec" cx="13" cy="-113" r="2.6" fill="#ff3b3b"/></g>`,
    };
    const headY = -108;
    const headSvg = m.photo
      ? `<clipPath id="rv-cp-${id}"><circle cx="0" cy="${headY - 4}" r="31"/></clipPath>
         <image href="${m.photo}" x="${face.x ?? -36}" y="${face.y ?? -150}" width="72" height="96" preserveAspectRatio="xMidYMid slice" clip-path="url(#rv-cp-${id})"/>
         <circle cx="0" cy="${headY - 4}" r="31" fill="none" stroke="${m.accent}" stroke-width="3"/>`
      : `<circle cx="0" cy="${headY}" r="22" fill="${L.skin}"/>
         <path d="M-23,${headY} C-25,${headY - 28} 25,${headY - 28} 23,${headY} C14,${headY - 14} -14,${headY - 14} -23,${headY} Z" fill="${L.hair}"/>
         <path d="M-12,${headY - 2} q4,-5 8,0 M4,${headY - 2} q4,-5 8,0" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round"/>
         <path d="M-9,${headY + 7} Q0,${headY + 19} 9,${headY + 7} Z" fill="#3a1410"/>
         ${L.beard ? `<path d="M-20,${headY + 2} C-18,${headY + 26} 18,${headY + 26} 20,${headY + 2} C12,${headY + 18} -12,${headY + 18} -20,${headY + 2} Z" fill="${L.hair}" opacity=".9"/>` : ""}
         ${L.glasses ? `<g fill="none" stroke="#111" stroke-width="2"><circle cx="-8" cy="${headY - 2}" r="6"/><circle cx="8" cy="${headY - 2}" r="6"/></g>` : ""}
         ${L.headphones ? `<path d="M-23,${headY} C-23,${headY - 32} 23,${headY - 32} 23,${headY}" stroke="#222" stroke-width="5" fill="none"/>` : ""}`;
    return `
    <g class="rv-person rv-person--${id}" transform="translate(${x},${y}) scale(${s})">
      <g class="rv-body">
        <rect x="-14" y="0" width="11" height="78" rx="5" fill="${pants}"/><rect x="3" y="0" width="11" height="78" rx="5" fill="${shade(pants, -8)}"/>
        <ellipse cx="-9" cy="80" rx="10" ry="5" fill="#0d0c10"/><ellipse cx="9" cy="80" rx="10" ry="5" fill="#0d0c10"/>
        <path d="M-20,4 L-22,-60 Q-22,-76 -8,-78 L8,-78 Q22,-76 22,-60 L20,4 Z" fill="${L.shirt}"/>
        <rect x="-5" y="-88" width="10" height="12" fill="${shade(L.skin, -20)}"/>
        <g class="rv-head">${headSvg}</g>
        ${poses.map((p, i) => `<g class="rv-pose rv-pose--${p}" style="opacity:${i ? 0 : 1}">${POSE[p]}</g>`).join("")}
      </g>
    </g>`;
  }
  function revealScene() {
    const conf = Array.from({ length: 70 }, (_, i) => `<rect class="rv-conf" x="${(i * 53) % 800}" y="-20" width="${6 + (i % 3) * 2}" height="${10 + (i % 4) * 2}" rx="1.5" fill="${["#ff7a1a", "#4fd1ff", "#5cf2a2", "#ffd23f", "#ff5c8a", "#a78bfa", "#f3ede2"][i % 7]}"/>`).join("");
    const burst = (cx, cy, r1, r2, n) => Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r2 : r1; return `${(cx + Math.cos(a) * r * 1.5).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`; }).join(" ");
    return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-label="The team celebrating the engineers' build: Raja says Maa kasam, Ratnam yells crazy">
      <defs>
        <linearGradient id="rvWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18161f"/><stop offset="1" stop-color="#0f0e14"/></linearGradient>
        <linearGradient id="rvSpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,226,170,.55)"/><stop offset="1" stop-color="rgba(255,226,170,0)"/></linearGradient>
        <radialGradient id="rvGlow"><stop offset="0" stop-color="rgba(255,150,60,.5)"/><stop offset="1" stop-color="rgba(255,150,60,0)"/></radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#rvWall)"/>
      <rect y="520" width="800" height="80" fill="#0b0a0e"/>
      <g class="rv-banner"><path d="M150,40 Q400,74 650,40" stroke="#3a3946" stroke-width="2" fill="none"/>${["I", "T", " ", "W", "O", "R", "K", "S"].map((c, i) => `<g transform="translate(${190 + i * 60},${50 + Math.sin((i / 7) * Math.PI) * 14})"><path d="M-20,0 L20,0 L0,34 Z" fill="${["#ff7a1a", "#ffd23f", "#4fd1ff", "#5cf2a2", "#ff5c8a", "#a78bfa", "#ff7a1a", "#ffd23f"][i]}"/><text y="18" text-anchor="middle" font-family="Anton" font-size="15" fill="#111">${c}</text></g>`).join("")}</g>
      <polygon class="rv-spot" points="370,0 430,0 520,520 280,520" fill="url(#rvSpot)" opacity="0"/>
      <circle class="rv-glow" cx="400" cy="360" r="170" fill="url(#rvGlow)" opacity="0"/>
      ${cheer("prateek", 205, 440, 0.92, ["down", "camera"])}
      ${cheer("sahil", 462, 440, 0.88, ["down", "up"])}
      ${cheer("virendra", 600, 440, 0.92, ["down", "clap"])}
      <rect x="320" y="420" width="160" height="14" rx="3" fill="#5a4a3a"/><rect x="335" y="434" width="10" height="90" fill="#3a2d22"/><rect x="455" y="434" width="10" height="90" fill="#3a2d22"/>
      <g class="rv-robot">${robot(400, 420, 1.6)}</g>
      <path class="rv-cloth" d="M330,420 C330,330 350,240 400,236 C450,240 470,330 470,420 C450,410 430,426 400,416 C370,426 350,410 330,420 Z" fill="#8a8794" stroke="#6c6a76" stroke-width="2"/>
      ${cheer("raja", 112, 470, 1.25, ["down", "head"], { x: -36, y: -149 })}
      ${cheer("sudhanshu", 268, 476, 1.08, ["down", "up"])}
      ${cheer("aryan", 540, 476, 1.08, ["down", "up"])}
      ${cheer("ratnam", 690, 470, 1.25, ["down", "up"], { x: -32, y: -155 })}
      <g class="rv-badge rv-badge--s" transform="translate(268,262)"><rect x="-44" y="-15" width="88" height="28" rx="14" fill="#4fd1ff"/><text y="5" text-anchor="middle" font-family="Anton" font-size="14" fill="#111">ENGINEER 🙇</text></g>
      <g class="rv-badge rv-badge--a" transform="translate(540,262)"><rect x="-44" y="-15" width="88" height="28" rx="14" fill="#5cf2a2"/><text y="5" text-anchor="middle" font-family="Anton" font-size="14" fill="#111">ENGINEER 🙇</text></g>
      <g class="rv-bub rv-bub--raja" transform="translate(150,150)"><polygon points="${burst(0, 0, 58, 44, 13)}" fill="#ffd23f" stroke="#111" stroke-width="3"/><text y="-2" text-anchor="middle" font-family="Anton" font-size="30" fill="#111">MAA</text><text y="28" text-anchor="middle" font-family="Anton" font-size="30" fill="#d61f3c">KASAM!!</text></g>
      <g class="rv-bub rv-bub--ratnam" transform="translate(650,168)"><rect x="-120" y="-34" width="240" height="60" rx="30" fill="#f3ede2" stroke="#111" stroke-width="3"/><path d="M30,24 L48,52 L56,24 Z" fill="#f3ede2" stroke="#111" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="20" width="30" height="8" fill="#f3ede2"/><text class="rv-crazy" y="6" text-anchor="middle" font-family="Anton" font-size="30" fill="#111">CRAZY…</text></g>
      <g class="rv-bub rv-bub--sahil" transform="translate(462,250)"><rect x="-40" y="-16" width="80" height="28" rx="14" fill="#ffd23f"/><text y="4" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="12" fill="#111">bhai 🔥🔥</text></g>
      <g class="rv-bub rv-bub--vir" transform="translate(610,262)"><rect x="-34" y="-16" width="68" height="28" rx="14" fill="#ff5c8a"/><text y="4" text-anchor="middle" font-size="13">👏👏👏</text></g>
      <g class="rv-confetti">${conf}</g>
    </svg>`;
  }

  /* editing preview frames (Prateek & Virendra) */
  const frames = [
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#1a0f05"/><circle cx="160" cy="110" r="70" fill="#ff7a1a" opacity=".25"/>${robot(160, 150, 1.1)}<text x="16" y="30" font-family="Anton" font-size="22" fill="#fff">SCENE 12 · A-ROLL</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#04131c"/><g stroke="#4fd1ff" stroke-width="2" fill="none" opacity=".7">${Array.from({ length: 8 }, (_, i) => `<circle cx="160" cy="90" r="${12 + i * 14}"/>`).join("")}</g><text x="160" y="104" text-anchor="middle" font-family="Anton" font-size="44" fill="#fff">IT WORKS?!</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#ffd23f"/><text x="160" y="80" text-anchor="middle" font-family="Anton" font-size="46" fill="#111">₹500 vs ₹50K</text><rect x="70" y="100" width="180" height="30" rx="15" fill="#111"/><text x="160" y="120" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#ffd23f">THUMBNAIL v3</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#0d0c10"/><rect x="100" y="70" width="120" height="40" rx="8" fill="#ff3b3b"/><text x="160" y="96" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="16" fill="#fff">SUBSCRIBE</text><text x="160" y="140" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#a39e95">end card · builders.mu</text></svg>`,
  ];

  /* ---------- inject ---------- */
  const $ = (s) => document.querySelector(s);
  $("#stage-raja").insertAdjacentHTML("beforeend", rajaScene());
  $("#stage-builders").insertAdjacentHTML("beforeend", buildersScene());
  $("#stage-sahil").insertAdjacentHTML("beforeend", sahilScene());
  $("#stage-reveal").insertAdjacentHTML("beforeend", revealScene());
  document.querySelectorAll(".editor__frame").forEach((el, i) => (el.innerHTML = frames[i % frames.length]));
})();
