/* ==========================================================
   WORKSHOP 3D — real-time Three.js workshop with physically based
   lighting, shadows and bloom. The camera is driven by
   window.CAM (a plain object that main.js tweens with ScrollTrigger).
   People are backlit silhouettes seen over the shoulder, so the
   scene reads as cinematic rather than cartoon.
   ========================================================== */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("gl");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 760px)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#07060a");
scene.fog = new THREE.FogExp2("#07060a", 0.045);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.18;

const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 80);

/* ---------------- helpers ---------------- */
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...o });
const M = {
  floor: std("#1b1a1c", { roughness: 0.42 }),
  wall: std("#16151a", { roughness: 0.9 }),
  wood: std("#4a3324", { roughness: 0.55 }),
  woodDark: std("#2b1e15", { roughness: 0.6 }),
  metal: std("#9a9ca3", { metalness: 1, roughness: 0.32 }),
  darkMetal: std("#2a2b30", { metalness: 0.8, roughness: 0.45 }),
  black: std("#0e0e10", { roughness: 0.5 }),
  orange: std("#ff6a10", { roughness: 0.35, metalness: 0.1 }),
  cream: std("#e9e3d6", { roughness: 0.5 }),
  cardboard: std("#9a7448", { roughness: 0.85 }),
  person: std("#0b0b0e", { roughness: 0.75 }),
  fabric: std("#1d1c22", { roughness: 0.95 }),
};
function box(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m;
}
function cyl(rt, rb, h, mat, x = 0, y = 0, z = 0, parent = scene, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData = { c, g, draw }; return t;
}
function screen(w, h, tex, intensity = 1.4) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: "#000", emissive: "#fff", emissiveMap: tex, emissiveIntensity: intensity, roughness: 0.3 }));
}
const limbAxis = new THREE.Vector3(0, 1, 0);
function limb(a, b, r, mat, parent) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - r * 0.6), 4, 10), mat);
  m.position.copy(A).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(limbAxis, dir.normalize());
  m.castShadow = true; parent.add(m); return m;
}

/* ---------------- room ---------------- */
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), M.floor);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
box(28, 4.4, 0.2, M.wall, 0, 2.2, -3.5, scene, false);
box(0.2, 4.4, 10, M.wall, -12.6, 2.2, 1.5, scene, false);
box(0.2, 4.4, 10, M.wall, 12.6, 2.2, 1.5, scene, false);
// floor tape lines like a real workshop
for (const x of [-6.8, -2.3, 2.6, 7.6]) box(0.06, 0.005, 3.2, std("#c9a227", { roughness: 0.6 }), x, 0.003, -1.6, scene, false);

// neon sign
const neonTex = canvasTex(1024, 220, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.font = "140px Anton, Impact, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "#ff7a1a"; g.shadowBlur = 24; g.fillStyle = "#ffb06a"; g.fillText("BUILDERS.MU", w / 2, h / 2 + 6);
});
const neon = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1), new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, toneMapped: false, color: new THREE.Color(2.2, 1.6, 1.3) }));
neon.position.set(0.2, 3.35, -3.38); scene.add(neon);
const neonLight = new THREE.PointLight("#ff7a1a", 6, 7, 1.6); neonLight.position.set(0.2, 3.2, -2.6); scene.add(neonLight);

// city window
const cityTex = canvasTex(512, 384, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#050a1f"); gr.addColorStop(1, "#2a1238"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`; g.fillRect(Math.random() * w, Math.random() * h * 0.5, 1.5, 1.5); }
  g.fillStyle = "#06060c";
  let x = 0; while (x < w) { const bw = 30 + Math.random() * 60, bh = 80 + Math.random() * 200; g.fillRect(x, h - bh, bw, bh);
    g.fillStyle = "#ffcf6a"; for (let k = 0; k < 14; k++) if (Math.random() < 0.5) g.fillRect(x + 4 + Math.random() * (bw - 8), h - bh + 6 + Math.random() * (bh - 12), 3, 4); g.fillStyle = "#06060c"; x += bw + 4; }
});
const win = screen(1.9, 1.4, cityTex, 0.9); win.position.set(2.75, 2.05, -3.38); scene.add(win);
box(2.02, 0.06, 0.1, M.darkMetal, 2.75, 2.75, -3.36); box(2.02, 0.06, 0.1, M.darkMetal, 2.75, 1.35, -3.36); box(0.05, 1.4, 0.1, M.darkMetal, 2.75, 2.05, -3.36);

/* ---------------- people (silhouettes) ---------------- */
const people = {};
function seatedPerson(id, x, z, rotY = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
  // chair
  box(0.52, 0.07, 0.5, M.fabric, 0, 0.47, 0.02, g); box(0.5, 0.62, 0.07, M.fabric, 0, 0.85, 0.28, g);
  cyl(0.03, 0.03, 0.4, M.darkMetal, 0, 0.26, 0.02, g, 10); cyl(0.28, 0.28, 0.03, M.darkMetal, 0, 0.05, 0.02, g, 5);
  // body
  const P = M.person;
  limb([-0.1, 0.55, 0], [-0.1, 0.55, -0.42], 0.075, P, g); limb([0.1, 0.55, 0], [0.1, 0.55, -0.42], 0.075, P, g);
  limb([-0.1, 0.55, -0.42], [-0.1, 0.07, -0.47], 0.06, P, g); limb([0.1, 0.55, -0.42], [0.1, 0.07, -0.47], 0.06, P, g);
  const torso = limb([0, 0.62, 0.02], [0, 1.08, -0.08], 0.17, P, g); torso.scale.set(1.15, 1, 0.75);
  const head = new THREE.Group(); head.position.set(0, 1.3, -0.12); g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), P); skull.scale.set(0.95, 1.1, 1); skull.castShadow = true; head.add(skull);
  limb([0, 1.1, -0.08], [0, 1.22, -0.11], 0.045, P, g);
  const arms = [-1, 1].map((s) => {
    const a = new THREE.Group(); a.position.set(0.2 * s, 1.08, -0.06); g.add(a);
    limb([0, 0, 0], [0.04 * s, -0.27, -0.12], 0.05, P, a); limb([0.04 * s, -0.27, -0.12], [-0.03 * s, -0.3, -0.45], 0.045, P, a);
    return a;
  });
  people[id] = { g, head, arms, type: "seated", headWorld: new THREE.Vector3() };
}
function standingPerson(id, x, z, rotY = 0, pose = "point") {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
  const P = M.person;
  limb([-0.1, 0.95, 0], [-0.11, 0.08, 0.02], 0.075, P, g); limb([0.1, 0.95, 0], [0.11, 0.08, -0.02], 0.075, P, g);
  const torso = limb([0, 1.0, 0], [0, 1.45, 0], 0.18, P, g); torso.scale.set(1.15, 1, 0.75);
  limb([0, 1.5, 0], [0, 1.6, 0], 0.045, P, g);
  const head = new THREE.Group(); head.position.set(0, 1.72, 0); g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 16), P); skull.scale.set(0.95, 1.1, 1); skull.castShadow = true; head.add(skull);
  const aL = new THREE.Group(); aL.position.set(-0.22, 1.48, 0); g.add(aL);
  limb([0, 0, 0], [-0.05, -0.3, 0.02], 0.05, P, aL); limb([-0.05, -0.3, 0.02], [-0.04, -0.58, 0.05], 0.045, P, aL);
  const aR = new THREE.Group(); aR.position.set(0.22, 1.48, 0); g.add(aR);
  if (pose === "point") { limb([0, 0, 0], [0.12, 0.05, -0.28], 0.05, P, aR); limb([0.12, 0.05, -0.28], [0.1, 0.3, -0.55], 0.045, P, aR);
    const marker = cyl(0.012, 0.012, 0.12, std("#ff3b3b"), 0.1, 0.36, -0.58, aR, 8); marker.rotation.x = -0.6; }
  else { limb([0, 0, 0], [0.08, -0.26, -0.08], 0.05, P, aR); limb([0.08, -0.26, -0.08], [-0.06, 0.2, -0.04], 0.045, P, aR);
    const phone = box(0.04, 0.14, 0.012, std("#000", { emissive: "#4fd1ff", emissiveIntensity: 1.6 }), -0.08, 0.26, -0.03, aR); phone.rotation.z = 0.2; }
  people[id] = { g, head, arms: [aL, aR], type: pose, headWorld: new THREE.Vector3() };
}

/* ---------------- STATION 1: RAJA — war room ---------------- */
const boardTex = canvasTex(1600, 860, (g, w, h) => {
  g.fillStyle = "#f2f1ec"; g.fillRect(0, 0, w, h);
  const hand = (t, x, y, s, c, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.font = `${s}px "Permanent Marker", "Comic Sans MS", cursive`; g.fillStyle = c; g.fillText(t, 0, 0); g.restore(); };
  hand("Q4 MISSION", 60, 110, 74, "#1b1b1b", -0.02);
  g.strokeStyle = "#1b1b1b"; g.lineWidth = 6; g.beginPath(); g.moveTo(60, 130); g.lineTo(520, 124); g.stroke();
  hand("60M", 760, 330, 260, "#d81f3c", -0.04);
  hand("VIEWS", 840, 430, 90, "#d81f3c", -0.03);
  g.strokeStyle = "#d81f3c"; g.lineWidth = 9; g.beginPath(); g.ellipse(980, 290, 330, 190, -0.06, 0, Math.PI * 2); g.stroke();
  const items = ["WK1-4  build 4 big ones", "WK5-8  2 uploads / week", "WK9-12 shorts blitz x30", "EVERY VIDEO: hook < 5s"];
  items.forEach((t, i) => hand(t, 70, 230 + i * 78, 46, i === 3 ? "#1f5fd6" : "#1b1b1b", -0.01));
  const arrows = [[540, 260, 640, 250], [540, 500, 640, 420]];
  g.strokeStyle = "#1b1b1b"; g.lineWidth = 5; arrows.forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
  // sprint graph
  g.strokeStyle = "#1b1b1b"; g.lineWidth = 4; g.beginPath(); g.moveTo(1380, 780); g.lineTo(1380, 520); g.moveTo(1380, 780); g.lineTo(1570, 780); g.stroke();
  g.strokeStyle = "#16a34a"; g.lineWidth = 7; g.beginPath(); g.moveTo(1385, 770); g.bezierCurveTo(1450, 760, 1500, 700, 1560, 540); g.stroke();
  hand("pace ↑", 1400, 510, 40, "#16a34a");
  const sticky = (x, y, c, a, b, r) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = c; g.shadowColor = "rgba(0,0,0,.25)"; g.shadowBlur = 10; g.shadowOffsetY = 6; g.fillRect(0, 0, 170, 170); g.shadowColor = "transparent"; g.font = '30px "Permanent Marker", cursive'; g.fillStyle = "#222"; g.fillText(a, 18, 70); g.fillText(b, 18, 115); g.restore(); };
  sticky(1380, 70, "#ffd23f", "CALL", "SAHIL", 0.06); sticky(1180, 560, "#5cf2a2", "THUMB", "A/B", -0.05); sticky(80, 620, "#ff8fb1", "ROUGH CUT", "WED", 0.03); sticky(360, 640, "#7fd3ff", "FIRMWARE", "v2 TONIGHT", -0.04);
});
const board = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.05), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.55, metalness: 0 }));
board.position.set(-9.2, 1.85, -3.37); scene.add(board);
box(3.9, 0.05, 0.08, M.metal, -9.2, 0.8, -3.33); box(3.9, 0.04, 0.04, M.metal, -9.2, 2.9, -3.38);
// analytics TV
const graphTex = canvasTex(1024, 576, (g, w, h, t = 0) => {
  g.fillStyle = "#0a0a0f"; g.fillRect(0, 0, w, h);
  g.font = "28px 'JetBrains Mono', monospace"; g.fillStyle = "#8a8794"; g.fillText("CHANNEL ANALYTICS · Q4 2026", 40, 60);
  g.font = "84px Anton, Impact, sans-serif"; g.fillStyle = "#fff"; g.fillText("TARGET 60,000,000", 40, 160);
  g.strokeStyle = "#26252e"; g.lineWidth = 2; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(40, 220 + i * 80); g.lineTo(w - 40, 220 + i * 80); g.stroke(); }
  g.strokeStyle = "#ff7a1a"; g.lineWidth = 6; g.shadowColor = "#ff7a1a"; g.shadowBlur = 16; g.beginPath();
  for (let i = 0; i <= 60; i++) { const x = 40 + (i / 60) * (w - 80), y = 540 - Math.pow(i / 60, 1.8) * 300 - Math.sin(i * 0.7) * 10; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.shadowBlur = 0;
  g.setLineDash([12, 10]); g.strokeStyle = "#5cf2a2"; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 230); g.lineTo(w - 40, 230); g.stroke(); g.setLineDash([]);
  g.font = "22px 'JetBrains Mono', monospace"; g.fillStyle = "#5cf2a2"; g.fillText("60M GOAL", w - 180, 220);
});
const tv = screen(1.7, 0.96, graphTex, 1.3); tv.position.set(-6.55, 2.05, -3.36); scene.add(tv);
box(1.78, 1.04, 0.05, M.black, -6.55, 2.05, -3.4);
const rajaSpot = new THREE.SpotLight("#e8eeff", 11, 9, 0.55, 0.7, 1.4); rajaSpot.position.set(-8.4, 4.2, 0.5); rajaSpot.target.position.set(-9.2, 1.6, -3.3);
rajaSpot.castShadow = true; rajaSpot.shadow.mapSize.set(1024, 1024); rajaSpot.shadow.bias = -0.0005; scene.add(rajaSpot, rajaSpot.target);
// standing table
box(1.3, 0.05, 0.7, M.woodDark, -7.3, 1.05, -1.7); cyl(0.04, 0.04, 1.05, M.darkMetal, -7.3, 0.52, -1.7, scene, 10);
box(0.36, 0.02, 0.25, M.darkMetal, -7.45, 1.09, -1.7);
standingPerson("raja", -8.75, -2.6, 0, "point");

/* ---------------- STATION 2: RATNAM — writer's desk ---------------- */
const desk = (x, z, w, d, mat = M.wood) => { box(w, 0.05, d, mat, x, 0.76, z); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.05, 0.74, 0.05, M.darkMetal, x + sx * (w / 2 - 0.06), 0.37, z + sz * (d / 2 - 0.06)); };
desk(-4.55, -2.75, 1.6, 0.8);
const scriptTex = canvasTex(800, 520, (g, w, h) => {
  g.fillStyle = "#f4efe4"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#1a1a1a"; g.font = "bold 26px 'Courier Prime', 'Courier New', monospace"; g.fillText("EP. 47 — ROBOT CHAIWALA", 60, 70);
  g.font = "22px 'Courier Prime', 'Courier New', monospace";
  const L = ["INT. BUILDERS.MU WORKSHOP — 3:12 AM", "", "Sparks. A half-built robot on the bench.", "Two engineers stare at it like it owes", "them money.", "", "                SUDHANSHU", "      If this pours chai first try,", "      I'm sleeping for two days.", "", "                  ARYAN", "      It won't. But the second try..."];
  L.forEach((t, i) => g.fillText(t, 60, 120 + i * 30));
  g.fillStyle = "#ff7a1a"; g.fillRect(420, 120 + 11 * 30 - 20, 12, 24);
});
const lapBase = box(0.5, 0.02, 0.34, M.metal, -4.6, 0.79, -2.65);
const lapScreen = screen(0.48, 0.31, scriptTex, 0.45); lapScreen.position.set(-4.6, 0.97, -2.84); lapScreen.rotation.x = -0.25; scene.add(lapScreen);
box(0.5, 0.33, 0.012, M.metal, -4.6, 0.97, -2.855).rotation.x = -0.25;
for (let i = 0; i < 6; i++) { const p = box(0.21, 0.004, 0.29, M.cream, -4.05 + Math.random() * 0.05, 0.79 + i * 0.005, -2.7 + Math.random() * 0.04); p.rotation.y = (Math.random() - 0.5) * 0.3; }
cyl(0.04, 0.035, 0.1, std("#4fd1ff"), -5.15, 0.84, -2.55, scene, 16);
// desk lamp
cyl(0.08, 0.09, 0.02, M.black, -5.15, 0.79, -2.95); const arm1 = cyl(0.01, 0.01, 0.45, M.black, -5.15, 1.0, -2.95, scene, 8); arm1.rotation.z = 0.25;
const shade = cyl(0.04, 0.11, 0.12, M.black, -4.98, 1.2, -2.85, scene, 20); shade.rotation.z = -0.9;
const ratLamp = new THREE.SpotLight("#ffc48a", 5, 4, 0.9, 0.7, 1.5); ratLamp.position.set(-4.95, 1.18, -2.8); ratLamp.target.position.set(-4.4, 0.78, -2.6); scene.add(ratLamp, ratLamp.target);
const ratFill = new THREE.PointLight("#ffb36b", 0.6, 3); ratFill.position.set(-4.4, 1.0, -2.3); scene.add(ratFill);
seatedPerson("ratnam", -4.6, -2.0);
// shelf of books
box(1.4, 0.04, 0.25, M.woodDark, -4.55, 2.0, -3.3);
for (let i = 0; i < 14; i++) box(0.05 + Math.random() * 0.03, 0.22 + Math.random() * 0.08, 0.18, std(["#7a2e1a", "#1f3a5a", "#d6c7a1", "#2d4a2d", "#ff7a1a"][i % 5], { roughness: 0.8 }), -5.15 + i * 0.085, 2.15, -3.3);

/* ---------------- STATION 3: BUILDERS — workbench ---------------- */
box(3.4, 0.07, 0.95, M.wood, 0, 0.9, -2.65); box(3.3, 0.04, 0.85, M.woodDark, 0, 0.3, -2.65);
for (const sx of [-1.62, 1.62]) for (const sz of [-3.05, -2.25]) box(0.07, 0.9, 0.07, M.darkMetal, sx, 0.45, sz);
// pegboard with tools
const pegTex = canvasTex(1024, 420, (g, w, h) => { g.fillStyle = "#3a2c20"; g.fillRect(0, 0, w, h); g.fillStyle = "#231a12"; for (let y = 16; y < h; y += 28) for (let x = 16; x < w; x += 28) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); } });
const peg = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.35), std("#fff", { map: pegTex, roughness: 0.9 })); peg.position.set(0, 1.85, -3.38); scene.add(peg);
const tools = [[-1.3, 2.1, 0.03, 0.4, M.metal], [-1.15, 2.05, 0.05, 0.3, M.orange], [-0.95, 2.15, 0.02, 0.45, M.metal], [-0.7, 2.0, 0.06, 0.28, std("#d61f3c")], [0.75, 2.1, 0.03, 0.36, M.metal], [0.95, 2.05, 0.05, 0.3, std("#ffd23f")], [1.2, 2.12, 0.025, 0.42, M.metal]];
tools.forEach(([x, y, r, l, m]) => cyl(r, r, l, m, x, y, -3.33, scene, 10));
const reel = cyl(0.13, 0.13, 0.06, std("#d61f3c"), -0.3, 2.2, -3.32); reel.rotation.x = Math.PI / 2;
const reel2 = cyl(0.1, 0.1, 0.05, std("#1f5fd6"), 0.3, 2.25, -3.32); reel2.rotation.x = Math.PI / 2;
// robot (the build)
const robot = new THREE.Group(); robot.position.set(0.05, 0.94, -2.75); scene.add(robot);
box(0.5, 0.06, 0.36, M.darkMetal, 0, 0.03, 0, robot);
const rBody = box(0.32, 0.3, 0.24, M.orange, 0, 0.23, 0, robot);
const dial = cyl(0.05, 0.05, 0.02, M.black, 0, 0.25, 0.125, robot); dial.rotation.x = Math.PI / 2;
cyl(0.03, 0.03, 0.06, M.metal, 0, 0.41, 0, robot, 12);
const rHead = new THREE.Group(); rHead.position.set(0, 0.52, 0); robot.add(rHead);
box(0.3, 0.18, 0.2, std("#b9b2a4", { roughness: 0.55 }), 0, 0, 0, rHead);
const eyeMat = new THREE.MeshStandardMaterial({ color: "#000", emissive: "#4fd1ff", emissiveIntensity: 3 });
for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 12), eyeMat); e.position.set(0.065 * s, 0.01, 0.1); rHead.add(e); }
const ant = cyl(0.006, 0.006, 0.1, M.metal, 0, 0.14, 0, rHead, 6);
const led = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 10), new THREE.MeshStandardMaterial({ color: "#000", emissive: "#ff3b6b", emissiveIntensity: 4 })); led.position.set(0, 0.2, 0); rHead.add(led);
const rArm = new THREE.Group(); rArm.position.set(0.2, 0.33, 0); robot.add(rArm);
limb([0, 0, 0], [0.12, -0.05, 0.12], 0.035, M.darkMetal, rArm); limb([0.12, -0.05, 0.12], [0.2, 0.04, 0.22], 0.03, M.orange, rArm);
const lArm = new THREE.Group(); lArm.position.set(-0.2, 0.33, 0); robot.add(lArm);
limb([0, 0, 0], [-0.06, -0.18, 0.06], 0.035, M.darkMetal, lArm);
// glass of chai
const glass = cyl(0.035, 0.03, 0.09, new THREE.MeshPhysicalMaterial({ color: "#c98a3a", transmission: 0.4, roughness: 0.1, thickness: 0.05 }), 0.35, 0.99, -2.5, scene, 16);
// monitor with code
const codeTex = canvasTex(900, 520, (g, w, h) => {
  g.fillStyle = "#0b1118"; g.fillRect(0, 0, w, h);
  g.font = "22px 'JetBrains Mono', monospace";
  const code = [["#c792ea", "void "], ["#82aaff", "pourChai"], ["#fff", "(int ml) {"], null, ["#89ddff", "  servo[3].write(", "#f78c6c", "142", "#89ddff", ");"], ["#89ddff", "  pid.tune(", "#f78c6c", "2.4", "#89ddff", ", 0.1, 0.8);"], ["#c3e88d", "  // don't spill this time"], ["#89ddff", "  while(flow < ml) step();"], ["#fff", "}"], null, ["#5cf2a2", "> upload ... OK  (3.2s)"], ["#ff5370", "> servo_3: timeout ✗"], ["#5cf2a2", "> retry ... OK ✓"]];
  let y = 60; code.forEach((ln) => { if (ln) { let x = 40; for (let i = 0; i < ln.length; i += 2) { g.fillStyle = ln[i]; g.fillText(ln[i + 1], x, y); x += g.measureText(ln[i + 1]).width; } } y += 34; });
});
const mon = screen(0.72, 0.42, codeTex, 1.25); mon.position.set(-1.05, 1.27, -2.95); mon.rotation.y = 0.25; scene.add(mon);
const monBack = box(0.76, 0.46, 0.03, M.black, -1.06, 1.27, -2.97); monBack.rotation.y = 0.25; box(0.05, 0.3, 0.05, M.black, -1.07, 1.06, -3.0); box(0.25, 0.015, 0.18, M.black, -1.07, 0.94, -3.0);
// oscilloscope
const scopeTex = canvasTex(512, 320, (g, w, h) => { g.fillStyle = "#04140c"; g.fillRect(0, 0, w, h); g.strokeStyle = "#0c3a22"; g.lineWidth = 1; for (let i = 0; i < w; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } for (let i = 0; i < h; i += 32) { g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } });
const scopeDraw = (t) => { const { g, c } = scopeTex.userData; const w = c.width, h = c.height; g.fillStyle = "rgba(4,20,12,.35)"; g.fillRect(0, 0, w, h); g.strokeStyle = "#5cf2a2"; g.lineWidth = 4; g.shadowColor = "#5cf2a2"; g.shadowBlur = 12; g.beginPath(); for (let x = 0; x < w; x += 4) { const y = h / 2 + Math.sin(x * 0.04 + t * 6) * 60 * Math.sin(t * 1.3) + Math.sin(x * 0.13 + t * 11) * 10; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.shadowBlur = 0; scopeTex.needsUpdate = true; };
box(0.46, 0.28, 0.3, std("#c9cbd1", { roughness: 0.5 }), 1.15, 1.08, -2.85);
const scope = screen(0.26, 0.17, scopeTex, 1.6); scope.position.set(1.08, 1.1, -2.699); scene.add(scope);
// soldering station + PCB
box(0.2, 0.08, 0.16, std("#2b6cb0"), 0.7, 0.98, -2.45); const iron = cyl(0.01, 0.006, 0.22, M.metal, 0.62, 1.05, -2.45, scene, 8); iron.rotation.z = 1.1;
box(0.22, 0.012, 0.15, std("#1f6f4a", { roughness: 0.4 }), 0.38, 0.945, -2.75);
// pendant lamp over bench (key light, shadows)
cyl(0.006, 0.006, 1.3, M.black, 0, 3.75, -2.6, scene, 6);
const pend = cyl(0.06, 0.32, 0.22, M.darkMetal, 0, 3.0, -2.6, scene, 28);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 1.4, 1.0) })); bulb.position.set(0, 2.88, -2.6); scene.add(bulb);
const benchSpot = new THREE.SpotLight("#ffd2a0", 11, 6, 0.75, 0.6, 1.4); benchSpot.position.set(0, 2.86, -2.6); benchSpot.target.position.set(0, 0.9, -2.6);
benchSpot.castShadow = true; benchSpot.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); benchSpot.shadow.bias = -0.0004; benchSpot.shadow.radius = 4; scene.add(benchSpot, benchSpot.target);
const sparkLight = new THREE.PointLight("#ffb347", 0, 2.2, 2); sparkLight.position.set(0.3, 1.05, -2.5); scene.add(sparkLight);
seatedPerson("sudhanshu", -0.75, -1.95, 0.12);
seatedPerson("aryan", 0.85, -1.95, -0.12);
// 3D printer
box(0.5, 0.55, 0.5, std("#1d1d22", { metalness: 0.4, roughness: 0.4 }), 2.25, 1.2, -2.85);
const printLed = box(0.42, 0.01, 0.02, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 1.8, 2.2) }), 2.25, 1.45, -2.6, scene, false);

/* ---------------- STATION 4: EDITORS — edit bay ---------------- */
desk(5.2, -2.8, 2.8, 0.85, M.black);
const timelineTex = (seed) => canvasTex(1100, 460, (g, w, h) => {
  g.fillStyle = "#121217"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#000"; g.fillRect(30, 20, 520, 270); g.fillRect(570, 20, 500, 270);
  const gr = g.createLinearGradient(30, 20, 550, 290); gr.addColorStop(0, seed ? "#2b1460" : "#5a1e00"); gr.addColorStop(1, seed ? "#4fd1ff" : "#ff9a3c"); g.fillStyle = gr; g.fillRect(40, 30, 500, 250);
  g.font = "60px Anton, Impact"; g.fillStyle = "#fff"; g.fillText(seed ? "IT WORKS?!" : "₹500 vs ₹50K", 80, 180);
  // scopes
  g.strokeStyle = "rgba(92,242,162,.8)"; for (let i = 0; i < 200; i++) { const x = 590 + Math.random() * 460, y = 60 + Math.random() * 200; g.fillStyle = `rgba(${seed ? "79,209,255" : "255,140,60"},.5)`; g.fillRect(x, 140 + (y - 140) * 0.5, 2, 2); }
  const cols = ["#4fd1ff", "#a78bfa", "#5cf2a2", "#ffb36b"];
  for (let r = 0; r < 4; r++) { let x = 30; while (x < w - 40) { const cw = 60 + Math.random() * 180; g.fillStyle = cols[r]; g.globalAlpha = 0.85; g.fillRect(x, 310 + r * 36, cw - 4, 28); x += cw; } }
  g.globalAlpha = 1; g.fillStyle = "#ff3b6b"; g.fillRect(seed ? 620 : 380, 300, 4, 156);
});
const mon1 = screen(1.15, 0.48, timelineTex(0), 1.25); mon1.position.set(4.55, 1.3, -3.0); mon1.rotation.y = 0.12; scene.add(mon1);
const mon2 = screen(1.15, 0.48, timelineTex(1), 1.25); mon2.position.set(5.85, 1.3, -3.0); mon2.rotation.y = -0.12; scene.add(mon2);
[mon1, mon2].forEach((m) => { const b = box(1.2, 0.53, 0.03, M.black, m.position.x, m.position.y, m.position.z - 0.025); b.rotation.y = m.rotation.y; box(0.05, 0.3, 0.05, M.black, m.position.x, 1.0, -3.05); });
for (const s of [-1, 1]) box(0.16, 0.26, 0.18, M.black, 5.2 + s * 1.3, 0.92, -2.95);
box(0.45, 0.02, 0.15, M.darkMetal, 4.6, 0.79, -2.55); box(0.45, 0.02, 0.15, M.darkMetal, 5.85, 0.79, -2.55);
const ledStrip = box(2.8, 0.025, 0.02, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 0.6, 2.6) }), 5.2, 2.35, -3.37, scene, false);
const editGlow = new THREE.PointLight("#8b5cf6", 5, 5, 1.6); editGlow.position.set(5.2, 2.1, -2.9); scene.add(editGlow);
const screenGlow = new THREE.PointLight("#4fd1ff", 2.5, 3, 1.8); screenGlow.position.set(5.2, 1.3, -2.4); scene.add(screenGlow);
for (let i = 0; i < 6; i++) box(0.5, 0.5, 0.06, M.fabric, 3.85 + (i % 3) * 0.6 + (i > 2 ? 1.5 : 0), 1.85 + (i % 2) * 0.55 - 0.25, -3.37);
seatedPerson("prateek", 4.6, -2.05, 0.05);
seatedPerson("virendra", 5.85, -2.05, -0.05);

/* ---------------- STATION 5: SAHIL — loading door ---------------- */
const doorOut = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 0.4, 0.27) }));
doorOut.position.set(10.3, 1.3, -3.39); scene.add(doorOut);
box(0.12, 2.75, 0.2, M.darkMetal, 9.35, 1.37, -3.35); box(0.12, 2.75, 0.2, M.darkMetal, 11.25, 1.37, -3.35); box(2.02, 0.15, 0.2, M.darkMetal, 10.3, 2.7, -3.35);
const doorLight = new THREE.SpotLight("#ffcf9a", 16, 10, 0.7, 0.8, 1.3); doorLight.position.set(10.3, 2.2, -3.6); doorLight.target.position.set(9.6, 0, 0.5);
doorLight.castShadow = !mobile; doorLight.shadow.mapSize.set(1024, 1024); scene.add(doorLight, doorLight.target);
const labelTex = (t) => canvasTex(256, 160, (g, w, h) => { g.fillStyle = "#a07a4a"; g.fillRect(0, 0, w, h); g.fillStyle = "#3a2a14"; g.font = "bold 34px 'JetBrains Mono', monospace"; g.fillText(t, 18, 90); g.strokeStyle = "#3a2a14"; g.lineWidth = 3; g.strokeRect(10, 40, w - 20, 70); });
[[8.6, 0.25, -2.6, 0.6, 0.5, "SERVO x40"], [8.65, 0.72, -2.65, 0.5, 0.44, "LI-ION"], [9.2, 0.2, -2.9, 0.42, 0.4, "LED 20m"], [8.0, 0.22, -2.9, 0.45, 0.44, "MOTORS"]].forEach(([x, y, z, s, hgt, t]) => {
  const mats = Array(6).fill(M.cardboard).map((m, i) => (i === 4 ? std("#fff", { map: labelTex(t), roughness: 0.85 }) : m));
  const b = new THREE.Mesh(new THREE.BoxGeometry(s, hgt, s * 0.8), mats); b.position.set(x, y + hgt / 2 - 0.2 + 0.2, z); b.castShadow = b.receiveShadow = true; b.rotation.y = (Math.random() - 0.5) * 0.3; scene.add(b);
});
// scooter silhouette by the door
const sc = new THREE.Group(); sc.position.set(11.0, 0, -1.9); sc.rotation.y = -0.6; scene.add(sc);
for (const z of [-0.55, 0.55]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.07, 12, 24), M.black); w.position.set(0, 0.27, z); w.rotation.y = Math.PI / 2; w.castShadow = true; sc.add(w); }
box(0.32, 0.35, 0.8, std("#ffd23f", { roughness: 0.35, metalness: 0.2 }), 0, 0.5, 0.1, sc); box(0.24, 0.12, 0.5, M.black, 0, 0.75, 0.15, sc);
const stem = cyl(0.03, 0.03, 0.8, M.metal, 0, 0.75, -0.5, sc, 8); stem.rotation.x = 0.25; box(0.55, 0.03, 0.03, M.black, 0, 1.15, -0.6, sc);
standingPerson("sahil", 9.7, -1.4, -0.5, "phone");

/* ---------------- ambient particles: dust + sparks ---------------- */
const dustN = mobile ? 250 : 600, dustGeo = new THREE.BufferGeometry(), dustPos = new Float32Array(dustN * 3);
for (let i = 0; i < dustN; i++) { dustPos[i * 3] = (Math.random() - 0.5) * 24; dustPos[i * 3 + 1] = Math.random() * 3.8; dustPos[i * 3 + 2] = -3.3 + Math.random() * 6; }
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: "#ffd9b0", size: 0.012, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
scene.add(dust);

const SP = 220, spGeo = new THREE.BufferGeometry(), spPos = new Float32Array(SP * 3), spVel = new Float32Array(SP * 3), spLife = new Float32Array(SP);
spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({ color: new THREE.Color(4, 2.2, 0.8), size: 0.018, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
scene.add(sparks);
const emitAt = new THREE.Vector3(0.38, 0.96, -2.72);
let spIdx = 0, burst = 0;
function emitSpark() {
  const i = spIdx++ % SP;
  spPos[i * 3] = emitAt.x; spPos[i * 3 + 1] = emitAt.y; spPos[i * 3 + 2] = emitAt.z;
  const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 1.6;
  spVel[i * 3] = Math.cos(a) * s; spVel[i * 3 + 1] = 0.6 + Math.random() * 1.8; spVel[i * 3 + 2] = Math.sin(a) * s * 0.7; spLife[i] = 0.5 + Math.random() * 0.6;
}

/* ---------------- post processing ---------------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.45, 0.92);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------------- labels that track people in 3D ---------------- */
const labels = [...document.querySelectorAll("[data-track]")].map((el) => ({ el, id: el.dataset.track }));
const tmp = new THREE.Vector3();

/* ---------------- loop ---------------- */
const CAM = (window.CAM = window.CAM || { px: 0, py: 4.2, pz: 15.5, tx: 0, ty: 1.3, tz: -2, fov: 38 });
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();

let visible = true;
new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  mouse.sx += (mouse.x - mouse.sx) * 0.04; mouse.sy += (mouse.y - mouse.sy) * 0.04;
  camera.position.set(CAM.px + mouse.sx * 0.35, CAM.py - mouse.sy * 0.2, CAM.pz);
  camera.lookAt(CAM.tx + mouse.sx * 0.15, CAM.ty - mouse.sy * 0.08, CAM.tz);
  if (camera.fov !== CAM.fov) { camera.fov = CAM.fov; camera.updateProjectionMatrix(); }

  if (!reduce) {
    // people at work
    for (const [id, p] of Object.entries(people)) {
      const k = id.length;
      if (p.type === "seated") {
        p.arms[0].rotation.x = Math.sin(t * 9 + k) * 0.05; p.arms[1].rotation.x = Math.sin(t * 9.6 + k + 1.3) * 0.05;
        p.head.rotation.y = Math.sin(t * 0.5 + k) * 0.12; p.head.rotation.x = Math.sin(t * 0.7 + k) * 0.05;
      } else if (p.type === "point") {
        p.arms[1].rotation.z = Math.sin(t * 3) * 0.06; p.arms[1].rotation.x = Math.sin(t * 2.1) * 0.05; p.head.rotation.y = Math.sin(t * 0.6) * 0.2;
      } else { p.head.rotation.y = Math.sin(t * 0.8) * 0.35; p.g.rotation.y = -0.5 + Math.sin(t * 0.3) * 0.25; }
    }
    // robot
    rHead.rotation.y = Math.sin(t * 0.8) * 0.4; rArm.rotation.z = Math.sin(t * 1.6) * 0.25; led.material.emissiveIntensity = 2 + Math.sin(t * 6) * 2;
    // sparks in bursts like real soldering
    burst -= dt; if (burst < -1.2) burst = 0.35 + Math.random() * 0.5;
    if (burst > 0) for (let i = 0; i < 6; i++) emitSpark();
    sparkLight.intensity = burst > 0 ? 0.6 + Math.random() * 1.2 : sparkLight.intensity * 0.85;
    for (let i = 0; i < SP; i++) {
      if (spLife[i] <= 0) { spPos[i * 3 + 1] = -10; continue; }
      spLife[i] -= dt; spVel[i * 3 + 1] -= 6 * dt;
      spPos[i * 3] += spVel[i * 3] * dt; spPos[i * 3 + 1] += spVel[i * 3 + 1] * dt; spPos[i * 3 + 2] += spVel[i * 3 + 2] * dt;
      if (spPos[i * 3 + 1] < 0.945 && Math.abs(spPos[i * 3] - 0) < 1.7 && spPos[i * 3 + 2] > -3.1 && spPos[i * 3 + 2] < -2.2) { spPos[i * 3 + 1] = 0.945; spVel[i * 3 + 1] *= -0.35; spVel[i * 3] *= 0.6; }
    }
    spGeo.attributes.position.needsUpdate = true;
    // dust drift
    for (let i = 0; i < dustN; i++) { dustPos[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0006; dustPos[i * 3] += 0.0008; if (dustPos[i * 3] > 12) dustPos[i * 3] = -12; }
    dustGeo.attributes.position.needsUpdate = true;
    // neon flicker + screens
    neon.material.color.setScalar(Math.random() < 0.012 ? 0.4 : 1).multiply(new THREE.Color(2.2, 1.6, 1.3));
    neonLight.intensity = neon.material.color.r > 1 ? 6 : 1.5;
    scopeDraw(t);
    printLed.material.color.setRGB(0.6, 1.8 + Math.sin(t * 2) * 0.6, 2.2);
  }

  composer.render();

  // tracked name labels
  for (const L of labels) {
    const p = people[L.id]; if (!p) continue;
    p.head.getWorldPosition(tmp); tmp.y += 0.32;
    const dist = tmp.distanceTo(camera.position);
    tmp.project(camera);
    const on = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1 && dist < 7.5;
    const x = (tmp.x * 0.5 + 0.5) * canvas.clientWidth, y = (-tmp.y * 0.5 + 0.5) * canvas.clientHeight;
    L.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    L.el.style.opacity = on ? Math.min(1, (7.5 - dist) / 2.5) : 0;
  }
}
// wait for display fonts so canvas textures use Anton/Permanent Marker
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  [neonTex, boardTex, graphTex, scriptTex, codeTex].forEach((tx) => { const { g, c, draw } = tx.userData; draw(g, c.width, c.height); tx.needsUpdate = true; });
  frame();
  window.dispatchEvent(new Event("workshop:ready"));
});
