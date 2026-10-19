/* ==========================================================
   SCENES — every illustration on the site is generated here as
   inline SVG so GSAP can animate individual body parts.
   Replace with real photos/Lottie/frame-sequences later.
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
  const tag = (x, y, name, role, id) => `
    <g class="ntag ntag--${id}" transform="translate(${x},${y})">
      <rect x="-64" y="-24" width="128" height="34" rx="17" fill="#0d0c10" stroke="#ff7a1a" stroke-width="1.5"/>
      <text x="0" y="-8" text-anchor="middle" font-family="Anton" font-size="13" fill="#f3ede2" letter-spacing=".5">${name}</text>
      <text x="0" y="5" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#ff7a1a" letter-spacing="1">${role}</text>
      <path d="M-5,10 L0,17 L5,10 Z" fill="#ff7a1a"/>
    </g>`;

  /* ==========================================================
     1) OFFICE — the full workspace used by the pinned camera tour
     ========================================================== */
  function office() {
    const floorLines = Array.from({ length: 17 }, (_, i) => `<path d="M${800 + (i - 8) * 30},600 L${800 + (i - 8) * 260},900" stroke="#1d1c24" stroke-width="1"/>`).join("");
    const stars = Array.from({ length: 22 }, (_, i) => `<circle class="star" cx="${630 + ((i * 97) % 340)}" cy="${95 + ((i * 53) % 150)}" r="${(i % 3) * 0.5 + 0.8}" fill="#fff"/>`).join("");
    return `
    <svg id="office" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-label="Illustrated Builders.mu workspace with seven team members at work">
      <defs>
        <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121117"/><stop offset="1" stop-color="#1b1a22"/></linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16151b"/><stop offset="1" stop-color="#0b0a0e"/></linearGradient>
        <radialGradient id="lampG"><stop offset="0" stop-color="rgba(255,179,107,.35)"/><stop offset="1" stop-color="rgba(255,179,107,0)"/></radialGradient>
        <radialGradient id="screenG"><stop offset="0" stop-color="rgba(79,209,255,.28)"/><stop offset="1" stop-color="rgba(79,209,255,0)"/></radialGradient>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset="1" stop-color="#2a1640"/></linearGradient>
        <filter id="neon" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="1600" height="600" fill="url(#wallG)"/>
      <rect y="600" width="1600" height="300" fill="url(#floorG)"/>
      ${floorLines}
      <rect y="596" width="1600" height="6" fill="#24232c"/>

      <!-- window -->
      <rect x="620" y="80" width="360" height="200" fill="url(#skyG)"/>
      ${stars}
      <circle cx="900" cy="130" r="18" fill="#f3ede2" opacity=".9"/><circle cx="908" cy="124" r="16" fill="#0a1230"/>
      <path d="M620,250 L660,215 L690,232 L740,190 L790,226 L840,200 L900,236 L940,214 L980,240 L980,280 L620,280 Z" fill="#0b0a14"/>
      <g fill="#ffd23f" opacity=".7"><rect x="676" y="244" width="4" height="4"/><rect x="752" y="230" width="4" height="4"/><rect x="852" y="236" width="4" height="4"/><rect x="930" y="250" width="4" height="4"/></g>
      <rect x="616" y="76" width="368" height="208" fill="none" stroke="#2f2e38" stroke-width="8"/><path d="M800,80 L800,280 M620,180 L980,180" stroke="#2f2e38" stroke-width="5"/>

      <!-- neon sign -->
      <text x="1205" y="150" text-anchor="middle" font-family="Anton" font-size="64" fill="#ff7a1a" filter="url(#neon)" class="neon" letter-spacing="3">BUILDERS.MU</text>
      <text x="1205" y="182" text-anchor="middle" font-family="JetBrains Mono" font-size="13" fill="#4fd1ff" filter="url(#neon)" letter-spacing="6">WE BUILD · YOU WATCH</text>

      <!-- clock -->
      <g transform="translate(1500,110)"><circle r="30" fill="#0d0c10" stroke="#3a3946" stroke-width="4"/><path class="clk-h" d="M0,0 L0,-14" stroke="#f3ede2" stroke-width="3" stroke-linecap="round"/><path class="clk-m" d="M0,0 L0,-22" stroke="#ff7a1a" stroke-width="2" stroke-linecap="round"/><circle r="3" fill="#ff7a1a"/></g>

      <!-- shelves -->
      <g><rect x="1020" y="250" width="200" height="6" fill="#2f2e38"/><rect x="1020" y="330" width="200" height="6" fill="#2f2e38"/>
        <rect x="1030" y="214" width="28" height="36" fill="#ff7a1a"/><rect x="1062" y="224" width="40" height="26" fill="#4fd1ff" opacity=".7"/><circle cx="1130" cy="234" r="16" fill="#5cf2a2" opacity=".7"/><rect x="1160" y="206" width="16" height="44" fill="#a78bfa"/><rect x="1180" y="218" width="30" height="32" fill="#f3ede2" opacity=".6"/>
        <rect x="1032" y="300" width="50" height="30" fill="#3a3946"/><rect x="1090" y="290" width="22" height="40" fill="#ffd23f" opacity=".7"/><rect x="1120" y="304" width="60" height="26" fill="#ff5c8a" opacity=".6"/><text x="1150" y="322" font-family="JetBrains Mono" font-size="8" fill="#111" text-anchor="middle">PARTS</text></g>
      <!-- poster -->
      <g transform="translate(1290,250)"><rect width="90" height="120" fill="#ffd23f"/><text x="45" y="50" font-family="Anton" font-size="26" text-anchor="middle" fill="#111">SHIP</text><text x="45" y="78" font-family="Anton" font-size="26" text-anchor="middle" fill="#111">IT.</text><rect x="20" y="92" width="50" height="4" fill="#111"/></g>

      <!-- ZONE 1: RAJA — whiteboard -->
      <g class="zone zone--raja">
        <rect x="70" y="160" width="270" height="200" rx="6" fill="#ecebe6" stroke="#3a3946" stroke-width="6"/>
        <rect x="70" y="360" width="270" height="8" fill="#3a3946"/>
        <g class="wb" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round">
          <rect class="draw" x="92" y="186" width="60" height="34" rx="6"/><text x="122" y="208" font-family="JetBrains Mono" font-size="11" text-anchor="middle" fill="#1a1a1a" stroke="none">IDEA</text>
          <path class="draw" d="M156,203 L196,203 M188,196 L196,203 L188,210"/>
          <rect class="draw" x="200" y="186" width="60" height="34" rx="6" stroke="#ff7a1a"/><text x="230" y="208" font-family="JetBrains Mono" font-size="11" text-anchor="middle" fill="#ff7a1a" stroke="none">BUILD</text>
          <path class="draw" d="M230,224 L230,256 M223,248 L230,256 L237,248"/>
          <rect class="draw" x="200" y="260" width="60" height="34" rx="6" stroke="#1f6fff"/><text x="230" y="282" font-family="JetBrains Mono" font-size="11" text-anchor="middle" fill="#1f6fff" stroke="none">SHOOT</text>
          <path class="draw" d="M100,320 C130,270 160,330 190,300 S250,320 320,250" stroke="#d61f5a"/>
          <circle class="draw" cx="300" cy="200" r="22" stroke="#d61f5a"/><text x="300" y="204" font-family="Anton" font-size="12" text-anchor="middle" fill="#d61f5a" stroke="none">1M!</text>
        </g>
        <rect x="282" y="300" width="40" height="40" fill="#ffd23f" transform="rotate(6 302 320)"/><rect x="96" y="236" width="36" height="36" fill="#5cf2a2" transform="rotate(-5 114 254)"/>
        ${standing("raja", 380, 470, 1.25, true, "point")}
      </g>

      <!-- ZONE 2: RATNAM — writer's desk -->
      <g class="zone zone--ratnam">
        <ellipse cx="520" cy="640" rx="140" ry="20" fill="#000" opacity=".35"/>
        ${seated("ratnam", 440, 560, 1)}
        <rect x="480" y="520" width="130" height="10" rx="3" fill="#3a2d22"/><rect x="490" y="530" width="8" height="90" fill="#2a2018"/><rect x="592" y="530" width="8" height="90" fill="#2a2018"/>
        <g transform="translate(520,520)"><path d="M-22,0 L22,0 L28,-4 L-28,-4 Z" fill="#9aa0aa"/><rect x="-24" y="-38" width="44" height="32" rx="2" fill="#c8ccd2" transform="skewX(-12)"/><rect x="-20" y="-35" width="36" height="25" fill="#0d1b26" transform="skewX(-12)"/><g class="ratnam-text">${[0, 1, 2, 3].map((i) => `<rect x="${-18 + i}" y="${-32 + i * 6}" width="${24 - i * 3}" height="2.5" fill="#f3ede2" opacity=".8" transform="skewX(-12)"/>`).join("")}</g></g>
        <g class="paper-stack"><rect x="560" y="508" width="34" height="12" fill="#f3ede2"/><rect x="562" y="502" width="32" height="6" fill="#e2dac9"/></g>
        ${mug(596, 520, "#4fd1ff")}
        <g class="pages-fly">${[0, 1, 2].map(() => `<rect class="pg" x="570" y="490" width="22" height="28" fill="#f3ede2" opacity="0"/>`).join("")}</g>
        <circle cx="560" cy="420" r="120" fill="url(#lampG)"/><path d="M600,520 L612,470 L590,440" stroke="#3a3946" stroke-width="4" fill="none"/><path d="M575,430 L608,430 L598,446 L585,446 Z" fill="#ff7a1a"/>
      </g>

      <!-- ZONE 3: BUILDERS — workbench -->
      <g class="zone zone--builders">
        <ellipse cx="830" cy="650" rx="240" ry="24" fill="#000" opacity=".4"/>
        <circle cx="830" cy="480" r="200" fill="url(#lampG)" class="bench-glow"/>
        ${seated("sudhanshu", 650, 560, 1)}
        ${seated("aryan", 1010, 560, 1, true)}
        <rect x="690" y="520" width="280" height="12" rx="3" fill="#5a4a3a"/><rect x="700" y="532" width="10" height="90" fill="#3a2d22"/><rect x="950" y="532" width="10" height="90" fill="#3a2d22"/><rect x="700" y="580" width="260" height="6" fill="#3a2d22"/>
        ${monitor(735, 500, 72, 48, "mon-code", codeLines(72, 48))}
        ${robot(840, 520, 0.9, "office-robot")}
        <g class="sparks">${Array.from({ length: 8 }, () => `<circle class="spark" cx="870" cy="490" r="1.8" fill="#ffd23f"/>`).join("")}</g>
        <g transform="translate(920,518)"><rect x="-22" y="-10" width="44" height="10" fill="#1f6f4a"/><g fill="#ffd23f">${[0, 1, 2, 3, 4].map((i) => `<rect x="${-18 + i * 8}" y="-8" width="4" height="4"/>`).join("")}</g><path d="M-14,-10 C-20,-30 6,-34 14,-22" stroke="#ff5c8a" stroke-width="2" fill="none"/></g>
        ${mug(780, 520, "#f3ede2")}${mug(960, 520, "#ff7a1a")}
        <g transform="translate(700,516)"><rect x="-8" y="-6" width="30" height="6" fill="#26252e"/><path d="M14,-6 L24,-26" stroke="#ff7a1a" stroke-width="3"/></g>
        <path d="M830,330 L830,410" stroke="#3a3946" stroke-width="3"/><path d="M800,410 L860,410 L846,428 L814,428 Z" fill="#3a3946"/><ellipse cx="830" cy="428" rx="16" ry="4" fill="#ffd8a8" class="bench-bulb"/>
      </g>

      <!-- ZONE 4: EDITORS -->
      <g class="zone zone--editors">
        <ellipse cx="1200" cy="650" rx="190" ry="22" fill="#000" opacity=".4"/>
        <circle cx="1200" cy="470" r="150" fill="url(#screenG)"/>
        ${seated("prateek", 1080, 560, 1)}
        ${seated("virendra", 1330, 560, 1, true)}
        <rect x="1120" y="520" width="170" height="10" rx="3" fill="#2f2e38"/><rect x="1130" y="530" width="8" height="90" fill="#1d1c24"/><rect x="1272" y="530" width="8" height="90" fill="#1d1c24"/>
        ${monitor(1170, 500, 74, 48, "mon-edit mon-edit-1", timelineMini(74, 48))}
        ${monitor(1250, 500, 74, 48, "mon-edit mon-edit-2", timelineMini(74, 48))}
        <rect x="1150" y="512" width="40" height="6" rx="2" fill="#1d1c24"/><rect x="1232" y="512" width="40" height="6" rx="2" fill="#1d1c24"/>
        <g transform="translate(1210,452)"><rect x="-10" y="-8" width="20" height="14" rx="3" fill="#222"/><circle r="5" fill="#111" stroke="#4fd1ff" stroke-width="1.5"/><circle cx="7" cy="-5" r="1.6" fill="#ff5c8a" class="rec-dot"/></g>
      </g>

      <!-- ZONE 5: SAHIL — door, boxes, phone -->
      <g class="zone zone--sahil">
        <rect x="1470" y="330" width="100" height="270" fill="#26252e" stroke="#3a3946" stroke-width="5"/><circle cx="1480" cy="470" r="4" fill="#ffb36b"/><rect x="1490" y="350" width="60" height="70" fill="#0a1230" opacity=".8"/>
        <text x="1520" y="320" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#5cf2a2" letter-spacing="2">EXIT → MARKET</text>
        <g class="boxes"><rect x="1380" y="550" width="60" height="50" fill="#a07a4a"/><path d="M1380,568 L1440,568" stroke="#7a5a32" stroke-width="3"/><rect x="1390" y="510" width="44" height="40" fill="#b88c56"/><text x="1412" y="534" font-family="JetBrains Mono" font-size="7" text-anchor="middle" fill="#3a2a14">SERVO x40</text><rect x="1446" y="566" width="34" height="34" fill="#8a6a3e"/></g>
        ${standing("sahil", 1470, 505, 1.05, false, "phone")}
        <g class="bubbles">
          <g class="bub bub-1" transform="translate(1410,370)"><rect x="-56" y="-20" width="112" height="30" rx="15" fill="#ff7a1a"/><text x="0" y="0" font-family="Space Grotesk" font-size="11" text-anchor="middle" fill="#111">Bhaiya, 40 servo?</text></g>
          <g class="bub bub-2" transform="translate(1400,330)"><rect x="-50" y="-20" width="100" height="30" rx="15" fill="#f3ede2"/><text x="0" y="0" font-family="Space Grotesk" font-size="11" text-anchor="middle" fill="#111">Kal subah! 🙏</text></g>
        </g>
      </g>

      <!-- name tags -->
      ${tag(380, 330, "ER. RAJA SINGH", "TEAM LEAD", "raja")}
      ${tag(452, 430, "RATNAM KALRA", "SCRIPT WRITER", "ratnam")}
      ${tag(660, 420, "SUDHANSHU", "ENGINEER", "sudhanshu")}
      ${tag(1000, 420, "ARYAN SAGAR", "ENGINEER", "aryan")}
      ${tag(1090, 420, "PRATEEK", "EDITOR", "prateek")}
      ${tag(1320, 420, "VIRENDRA", "EDITOR", "virendra")}
      ${tag(1475, 270, "SAHIL", "PRODUCER", "sahil")}
    </svg>`;
  }

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
        <text class="wb-t" x="80" y="110" font-family="Anton" font-size="30" fill="#1a1a1a">EP. 47 — ROBOT CHAIWALA</text>
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
    const stars = Array.from({ length: 30 }, (_, i) => `<circle cx="${70 + ((i * 89) % 660)}" cy="${40 + ((i * 47) % 180)}" r="${(i % 3) * 0.6 + 0.8}" fill="#fff"/>`).join("");
    const cups = Array.from({ length: 8 }, (_, i) => mug(470 + (i % 4) * 22, 412 - Math.floor(i / 4) * 16, ["#f3ede2", "#ff7a1a", "#4fd1ff", "#5cf2a2"][i % 4], "b-cup")).join("");
    return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-label="Two engineers building a robot through day and night">
      <defs><clipPath id="winClip"><rect x="60" y="30" width="680" height="240"/></clipPath>
        <radialGradient id="bLamp"><stop offset="0" stop-color="rgba(255,179,107,.45)"/><stop offset="1" stop-color="rgba(255,179,107,0)"/></radialGradient></defs>
      <rect width="800" height="600" fill="#15141a"/>
      <g clip-path="url(#winClip)">
        <rect class="b-sky" x="60" y="30" width="680" height="240" fill="#7ec8ff"/>
        <g class="b-stars" opacity="0">${stars}</g>
        <g class="b-orbit"><circle class="b-sun" cx="400" cy="70" r="30" fill="#ffd23f"/><circle class="b-moon" cx="400" cy="590" r="24" fill="#f3ede2"/></g>
        <path d="M60,220 L120,180 L160,200 L220,150 L290,196 L350,170 L420,206 L480,160 L560,200 L620,176 L700,210 L740,190 L740,270 L60,270 Z" fill="#1d2440" class="b-city"/>
        <g class="b-windows" fill="#ffd23f" opacity="0">${Array.from({ length: 14 }, (_, i) => `<rect x="${90 + i * 46}" y="${220 + (i % 3) * 12}" width="5" height="5"/>`).join("")}</g>
      </g>
      <rect x="56" y="26" width="688" height="248" fill="none" stroke="#2f2e38" stroke-width="10"/><path d="M400,30 L400,270" stroke="#2f2e38" stroke-width="6"/>
      <g transform="translate(700,330)"><circle r="34" fill="#0d0c10" stroke="#3a3946" stroke-width="5"/><path class="b-hh" d="M0,0 L0,-16" stroke="#f3ede2" stroke-width="4" stroke-linecap="round"/><path class="b-mh" d="M0,0 L0,-26" stroke="#ff7a1a" stroke-width="3" stroke-linecap="round"/><circle r="3.5" fill="#ff7a1a"/></g>
      <circle cx="400" cy="400" r="260" fill="url(#bLamp)" class="b-lampglow" opacity=".3"/>
      <rect x="0" y="500" width="800" height="100" fill="#0d0c10"/>
      ${seated("sudhanshu", 150, 470, 1.25)}
      ${seated("aryan", 650, 470, 1.25, true)}
      <rect x="190" y="420" width="420" height="16" rx="4" fill="#5a4a3a"/><rect x="204" y="436" width="14" height="110" fill="#3a2d22"/><rect x="582" y="436" width="14" height="110" fill="#3a2d22"/>
      ${monitor(250, 394, 90, 58, "b-mon", codeLines(90, 58))}
      ${robot(400, 418, 1.5, "b-robot")}
      <g class="b-sparks">${Array.from({ length: 14 }, () => `<circle class="spark" cx="440" cy="360" r="2.4" fill="#ffd23f"/>`).join("")}</g>
      ${cups}
      <g transform="translate(560,418)"><rect x="-26" y="-8" width="52" height="8" fill="#1f6f4a"/><g fill="#ffd23f">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-22 + i * 8}" y="-6" width="4" height="4"/>`).join("")}</g></g>
      <path d="M400,200 L400,300" stroke="#3a3946" stroke-width="4"/><path d="M366,300 L434,300 L420,320 L380,320 Z" fill="#3a3946"/><ellipse cx="400" cy="320" rx="20" ry="5" fill="#ffd8a8"/>
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

  /* editing preview frames (Prateek & Virendra) */
  const frames = [
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#1a0f05"/><circle cx="160" cy="110" r="70" fill="#ff7a1a" opacity=".25"/>${robot(160, 150, 1.1)}<text x="16" y="30" font-family="Anton" font-size="22" fill="#fff">SCENE 12 · A-ROLL</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#04131c"/><g stroke="#4fd1ff" stroke-width="2" fill="none" opacity=".7">${Array.from({ length: 8 }, (_, i) => `<circle cx="160" cy="90" r="${12 + i * 14}"/>`).join("")}</g><text x="160" y="104" text-anchor="middle" font-family="Anton" font-size="44" fill="#fff">IT WORKS?!</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#ffd23f"/><text x="160" y="80" text-anchor="middle" font-family="Anton" font-size="46" fill="#111">₹500 vs ₹50K</text><rect x="70" y="100" width="180" height="30" rx="15" fill="#111"/><text x="160" y="120" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#ffd23f">THUMBNAIL v3</text></svg>`,
    `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#0d0c10"/><rect x="100" y="70" width="120" height="40" rx="8" fill="#ff3b3b"/><text x="160" y="96" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="16" fill="#fff">SUBSCRIBE</text><text x="160" y="140" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#a39e95">end card · builders.mu</text></svg>`,
  ];

  /* ==========================================================
     3) FRONT-FACING AVATAR for team cards
     ========================================================== */
  function avatar(m) {
    const L = m.look;
    const hairFront = {
      short: `<path d="M100,150 C96,92 204,92 200,150 C188,122 150,118 112,128 Z" fill="${L.hair}"/>`,
      spiky: `<path d="M98,152 C94,120 104,104 114,98 L118,78 L134,96 L146,72 L160,94 L176,74 L182,98 L196,86 L194,108 C204,122 204,140 202,152 C186,124 150,118 112,128 Z" fill="${L.hair}"/>`,
      curly: `<g fill="${L.hair}">${[[110, 120], [130, 102], [152, 96], [174, 102], [192, 120], [100, 142], [200, 142]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20"/>`).join("")}</g>`,
      long: `<path d="M96,250 C80,150 100,96 150,96 C200,96 220,150 204,250 L190,250 C196,190 192,150 180,134 C150,128 120,130 110,140 C106,170 104,210 110,250 Z" fill="${L.hair}"/>`,
      cap: `<path d="M98,146 C96,96 204,96 202,146 Z" fill="${L.hair}"/><path d="M96,142 L214,142 L228,154 L98,154 Z" fill="${shade(L.hair, 25)}"/>`,
      side: `<path d="M98,156 C92,96 206,90 202,150 C188,130 168,116 132,118 C118,124 106,138 98,156 Z" fill="${L.hair}"/>`,
    }[L.style];
    return `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated portrait of ${m.name}">
      <defs><linearGradient id="av-${m.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(L.shirt, -120)}"/><stop offset="1" stop-color="#0d0c10"/></linearGradient></defs>
      <rect width="300" height="400" fill="url(#av-${m.id})"/>
      <text x="150" y="250" text-anchor="middle" font-family="Anton" font-size="220" fill="${L.shirt}" opacity=".08">${m.name.replace("Er. ", "").split(" ").map((w) => w[0]).join("").slice(0, 2)}</text>
      <path d="M40,400 C40,300 90,276 150,276 C210,276 260,300 260,400 Z" fill="${L.shirt}"/>
      <path d="M128,276 L150,306 L172,276 Z" fill="${shade(L.shirt, -40)}"/>
      <rect x="132" y="232" width="36" height="50" rx="10" fill="${shade(L.skin, -18)}"/>
      <ellipse cx="102" cy="176" rx="11" ry="16" fill="${shade(L.skin, -12)}"/><ellipse cx="198" cy="176" rx="11" ry="16" fill="${shade(L.skin, -12)}"/>
      <ellipse cx="150" cy="168" rx="50" ry="64" fill="${L.skin}"/>
      ${L.beard ? `<path d="M102,180 C104,240 130,250 150,250 C170,250 196,240 198,180 C190,214 170,222 150,222 C130,222 110,214 102,180 Z" fill="${L.hair}"/>` : ""}
      ${hairFront}
      <ellipse class="av-eye" cx="130" cy="170" rx="5" ry="6" fill="#111"/><ellipse class="av-eye" cx="170" cy="170" rx="5" ry="6" fill="#111"/>
      <path d="M120,152 Q130,146 140,152 M160,152 Q170,146 180,152" stroke="${L.hair}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M150,176 L146,196 L154,196" stroke="${shade(L.skin, -35)}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M134,212 Q150,224 166,212" stroke="#5a2e1a" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${L.glasses ? `<g fill="rgba(79,209,255,.12)" stroke="#111" stroke-width="4"><circle cx="130" cy="170" r="16"/><circle cx="170" cy="170" r="16"/></g><path d="M146,170 L154,170" stroke="#111" stroke-width="4"/>` : ""}
      ${L.headphones ? `<path d="M94,180 C86,80 214,80 206,180" stroke="#222" stroke-width="12" fill="none"/><rect x="78" y="160" width="26" height="44" rx="12" fill="#222"/><rect x="196" y="160" width="26" height="44" rx="12" fill="#222"/>` : ""}
    </svg>`;
  }

  /* ---------- inject ---------- */
  const $ = (s) => document.querySelector(s);
  $("#tour-stage").innerHTML = office();
  $("#stage-raja").insertAdjacentHTML("beforeend", rajaScene());
  $("#stage-builders").insertAdjacentHTML("beforeend", buildersScene());
  $("#stage-sahil").insertAdjacentHTML("beforeend", sahilScene());
  document.querySelectorAll(".editor__frame").forEach((el, i) => (el.innerHTML = frames[i % frames.length]));

  // team rail
  $("#team-rail").innerHTML = D.team.map((m) => `
    <article class="member" data-cursor="drag">
      <div class="member__pic">${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy">` : avatar(m)}<span class="member__role">${m.role}</span></div>
      <h3>${m.name}</h3><p>${m.line}</p>
    </article>`).join("");

  // content hub
  const s = D.socials;
  const vthumb = (v) => v.thumb ? `<div><img src="${v.thumb}" alt=""></div>` : `<div style="background:${v.bg}"><span class="ttl">${v.ttl}</span></div>`;
  const play = `<span class="vcard__play"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 4v16l13-8z" fill="currentColor"/></svg></span>`;
  const [v0, ...vRest] = D.videos;
  $("#videos").innerHTML = `
    <a class="vcard" href="${v0.url}" target="_blank" rel="noopener" data-cursor="play"><div class="vcard__thumb">${vthumb(v0)}${play}</div><div class="vcard__meta"><h3>${v0.title}</h3><span>${v0.views} · ${v0.date}</span></div></a>
    <div class="videos__side">${vRest.map((v) => `<a class="vcard vcard--small" href="${v.url}" target="_blank" rel="noopener" data-cursor="play"><div class="vcard__thumb">${vthumb(v)}${play}</div><div class="vcard__meta"><h3>${v.title}</h3><span>${v.views}</span></div></a>`).join("")}</div>`;
  $("#insta").innerHTML = D.insta.map((p) => `<a href="${p.url === "#" ? s.instagram : p.url}" target="_blank" rel="noopener" data-likes="${p.likes}"><div style="background:${p.bg}">${p.emoji}</div></a>`).join("");
  $("#blog").innerHTML = D.blog.map((b) => `<a class="post" href="${b.url}"><span class="mono">${b.tag}</span><h3>${b.title}</h3><p>${b.excerpt}</p><span class="mono" style="color:var(--ink-mute)">${b.date} · ${b.read} read</span></a>`).join("");
  $("#community").innerHTML = D.community.map((c) => `<a class="comm" href="${s[c.url] || c.url}" target="_blank" rel="noopener" style="--c:${c.color}"><h3>${c.title}</h3><div><b><span class="count" data-to="${c.num}">0</span>${c.suffix}</b><p>${c.sub}</p></div></a>`).join("");
})();
