// road and car on the left side, seen from above
const roadSvg = document.getElementById("roadSvg");
const CAR_COLORS = {
  cherry: "#d94657",
  blue: "#1f4d67",
  mustard: "#e2a63b",
};
const SCENE_W = 112; // scaled to the --road width
const ROAD_W = 34;
const roadX = (y) =>
  56 + 20 * Math.sin(y / 170 + 0.6) + 8 * Math.sin(y / 67 + 2);
const headingDeg = (fn, y) =>
  (-Math.atan((fn(y + 3) - fn(y - 3)) / 6) * 180) / Math.PI;

// car nose points down
const carMarkup = `
  <rect x="-14" y="-24" width="28" height="48" fill="transparent"/>
  <g id="carShadow"><polygon fill="#241b1b" opacity="0.2" points="-9,-19 9,-19 10,-8 10,12 8,19 -8,19 -10,12 -10,-8"/></g>
  <g id="carBody">
    <g fill="#241b1b"><rect x="-12" y="-14" width="3" height="7"/><rect x="9" y="-14" width="3" height="7"/><rect x="-12" y="7" width="3" height="7"/><rect x="9" y="7" width="3" height="7"/></g>
    <polygon class="c-main" points="-9,-19 9,-19 10,-8 10,12 8,19 -8,19 -10,12 -10,-8"/>
    <polygon fill="#fff" opacity="0.2" points="0,19 -8,19 -10,12 0,8"/>
    <polygon fill="#000" opacity="0.14" points="0,19 8,19 10,12 0,8"/>
    <polygon fill="#fff" opacity="0.12" points="0,-19 -9,-19 -10,-8 0,-6"/>
    <polygon fill="#000" opacity="0.12" points="0,-19 9,-19 10,-8 0,-6"/>
    <polygon fill="#dbe8ee" points="-8,1 8,1 7,7 -7,7"/>
    <polygon fill="#c3d4dc" points="-7,-9 7,-9 8,-13 -8,-13"/>
    <polygon fill="#fff" opacity="0.2" points="0,-9 -8,-9 -8,1 0,1"/>
    <polygon fill="#000" opacity="0.16" points="0,-9 8,-9 8,1 0,1"/>
    <polygon fill="#faf6f0" points="-8,17 -4,17 -4,19 -7,19"/><polygon fill="#faf6f0" points="8,17 4,17 4,19 7,19"/>
    <polygon fill="#672a31" points="-8,-19 -4,-19 -4,-17 -8,-17"/><polygon fill="#672a31" points="8,-19 4,-19 4,-17 8,-17"/>
  </g>`;


let roadObjs = [];
let carY0 = 30;
let carY1 = 600;
let carEl = null;
let bodyEl = null;
let shadowEl = null;
let roadScale = 1;
let dragSize = 1;

// one sign per section, starting with the intro
const roadSections = [
  ["Intro", "#intro"],
  ...PROJECTS.map((p) => [p.sign || oneLine(p.title), "#" + p.id]),
  ["Stack", "#stack"],
  ["Contact", "#contact"],
];

function lateralAt(y) {
  let lat = 0;
  roadObjs.forEach((o) => {
    if (!o.def.dodge) return;
    const [amt, win] = o.def.dodge;
    const d = Math.abs(y - o.y);
    if (d < win)
      lat += -Math.sign(o.off) * amt * (1 - (d / win) ** 2) ** 2;
  });
  return Math.max(-15, Math.min(15, lat));
}
const carPathX = (y) => roadX(y) + lateralAt(y);

function skidAt(y) {
  let a = 0;
  roadObjs.forEach((o) => {
    if (!o.def.skid) return;
    const [amp, win] = o.def.skid;
    const d = y - o.y;
    if (Math.abs(d) < win)
      a +=
        amp *
        Math.sin((d / win) * Math.PI * 2) *
        (1 - (d / win) ** 2) *
        (o.off >= 0 ? 1 : -1);
  });
  return a;
}

function buildRoad() {
  const roadPx = roadSvg.parentElement.clientWidth || SCENE_W;
  const scale = roadPx / SCENE_W;
  roadScale = scale;
  const roadH = window.innerHeight / scale;
  roadSvg.setAttribute("viewBox", `0 0 ${SCENE_W} ${roadH}`);
  carY0 = 30;
  carY1 = roadH - 44;

  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const frac = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return 0;
    return Math.min(
      1,
      Math.max(
        0,
        (el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2) /
          maxScroll,
      ),
    );
  };
  const signs = roadSections.map(([label, sel]) => ({
    label,
    href: sel,
    y: carY0 + frac(sel) * (carY1 - carY0),
  }));
  const nearSign = (y, d) => signs.some((sign) => Math.abs(sign.y - y) < d);

  // ground
  const tones = ["#efe4d7", "#eadfd0", "#f2e9dd"];
  let out = "";
  const cw = 28;
  const ch = 32;
  for (let r = 0; r * ch < roadH + ch; r++) {
    for (let c = 0; c * cw < SCENE_W + cw; c++) {
      const x = c * cw;
      const y = r * ch;
      const t1 = tones[Math.floor(hash(r * 31 + c) * 3)];
      const t2 = tones[Math.floor(hash(r * 17 + c * 5 + 9) * 3)];
      out += `<polygon fill="${t1}" points="${x},${y} ${x + cw},${y} ${x},${y + ch}"/><polygon fill="${t2}" points="${x + cw},${y} ${x + cw},${y + ch} ${x},${y + ch}"/>`;
    }
  }

  // trees
  for (let i = 0, y = 24; y < roadH; i++, y += 44 + hash(i) * 30) {
    if (nearSign(y, 30)) continue;
    const cx = roadX(y);
    const side = cx < 56 ? 1 : -1;
    const trees = [[cx + side * 36, 8 + hash(i + 3) * 3]];
    if (cx >= 46 && cx <= 66 && i % 2 === 0)
      trees.push([cx - side * 36, 7 + hash(i + 8) * 3]);
    trees.forEach(([tx, r]) => {
      if (tx - r < 2 || tx + r > SCENE_W - 2) return;
      out += `<g transform="translate(${tx.toFixed(1)},${y.toFixed(1)})"><polygon fill="#241b1b" opacity="0.14" points="${octagon(2.5, 2.5, r)}"/><polygon fill="#4f6b45" points="${octagon(0, 0, r)}"/><polygon fill="#6b8a5a" points="0,0 ${(-r * 0.92).toFixed(1)},${(-r * 0.38).toFixed(1)} ${(-r * 0.38).toFixed(1)},${(-r * 0.92).toFixed(1)} ${(r * 0.38).toFixed(1)},${(-r * 0.92).toFixed(1)}"/><polygon fill="#3f5738" points="0,0 ${(r * 0.92).toFixed(1)},${(r * 0.38).toFixed(1)} ${(r * 0.38).toFixed(1)},${(r * 0.92).toFixed(1)}"/></g>`;
    });
  }

  // road
  let points = "";
  for (let y = -10; y <= roadH + 10; y += 6)
    points += `${y === -10 ? "M" : "L"}${roadX(y).toFixed(1)},${y} `;
  out += `<path d="${points}" fill="none" stroke="#b98f66" stroke-width="${ROAD_W + 8}" stroke-linejoin="round"/>`;
  out += `<path d="${points}" fill="none" stroke="#d4ab7f" stroke-width="${ROAD_W}" stroke-linejoin="round"/>`;
  out += `<path d="${points}" fill="none" stroke="#faf6f0" stroke-width="2.2" stroke-dasharray="10 9"/>`;

  // finish line
  const fy = roadH - 14;
  let checks = "";
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 8; c++)
      checks += `<rect x="${-ROAD_W / 2 + c * (ROAD_W / 8)}" y="${r * 4}" width="${ROAD_W / 8}" height="4" fill="${(r + c) % 2 ? "#faf6f0" : "#241b1b"}"/>`;
  out += `<g transform="translate(${roadX(fy).toFixed(1)},${fy}) rotate(${headingDeg(roadX, fy).toFixed(1)})">${checks}</g>`;

  // obstacles, going through SEQUENCE down the road
  roadObjs = [];
  for (
    let i = 0, y = carY0 + 70;
    y < carY1 - 40;
    i++, y += 46 + hash(i + 40) * 20
  ) {
    if (nearSign(y, 24)) continue;
    const type = SEQUENCE[i % SEQUENCE.length];
    const def = OBSTACLES[type];
    const off = def.side ? (i % 2 ? 1 : -1) * def.off : def.off;
    const rot = def.flat ? headingDeg(roadX, y) : 0;
    const id = `ob${i}`;
    out += `<g id="${id}" transform="translate(${(roadX(y) + off).toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)})">${def.draw("wk" + i)}</g>`;
    roadObjs.push({ y, type, def, off, id });
  }

  out += `<g id="car">${carMarkup}</g>`;

  // signs above the road
  signs.forEach((sign) => {
    const cx = roadX(sign.y);
    const w = 50;
    out += `<g class="road-sign" data-href="${esc(sign.href)}" role="link" tabindex="0" aria-label="Go to ${esc(sign.label)}" transform="translate(${cx.toFixed(1)},${sign.y.toFixed(1)})"><rect x="${-w / 2 + 2}" y="-3" width="${w}" height="12" fill="#241b1b" opacity="0.16"/><rect x="${-w / 2}" y="-6" width="${w}" height="12" fill="#241b1b"/><rect x="${-w / 2}" y="-6" width="3" height="12" fill="#d94657"/><rect x="${w / 2 - 3}" y="-6" width="3" height="12" fill="#d94657"/>`;
    if (scale >= 0.8)
      out += `<text x="0" y="2.6" text-anchor="middle" font-family="Azeret Mono, monospace" font-size="7.6" letter-spacing=".3" fill="#faf6f0">${esc(sign.label.slice(0, 9).toUpperCase())}</text>`;
    out += `</g>`;
  });

  roadSvg.innerHTML = out;
  carEl = document.getElementById("car");
  bodyEl = document.getElementById("carBody");
  shadowEl = document.getElementById("carShadow");
  roadObjs.forEach((o) => {
    o.el = document.getElementById(o.id);
    if (o.def.walker)
      o.walker = document.getElementById("wk" + o.id.slice(2));
  });
  updateCar();
}

function updateCar() {
  if (!carEl) return;
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const prog = Math.min(1, Math.max(0, window.scrollY / max));
  const y = carY0 + prog * (carY1 - carY0);
  const x = carPathX(y);

  // hops make the car bigger and move its shadow
  let lift = 0;
  roadObjs.forEach((o) => {
    if (o.def.lift) {
      const [amp, win] = o.def.lift;
      const d = Math.abs(y - o.y);
      if (d < win) lift += amp * (1 - (d / win) ** 2) ** 1.5;
    }
    if (o.def.hit)
      o.el.firstElementChild.classList.toggle("hit", y + 14 > o.y);
    if (o.walker) {
      // person crosses when the car comes close
      const t = Math.min(1, Math.max(0, (y - (o.y - 75)) / 75));
      o.walker.setAttribute(
        "transform",
        `translate(${(-ROAD_W / 2 - 5 + t * (ROAD_W + 10)).toFixed(1)},${(Math.sin(t * 22) * 1.3).toFixed(1)})`,
      );
    }
  });

  carEl.setAttribute(
    "transform",
    `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(headingDeg(carPathX, y) + skidAt(y)).toFixed(1)})`,
  );
  bodyEl.setAttribute(
    "transform",
    `scale(${((1 + lift * 0.02) * dragSize).toFixed(3)})`,
  );
  shadowEl.setAttribute(
    "transform",
    `translate(${(lift * 0.6 + (dragSize - 1) * 5).toFixed(1)},${(lift * 0.6 + (dragSize - 1) * 5).toFixed(1)})`,
  );
}

// car color picker
const carBtns = document.querySelectorAll(".car-picker button");
function setCar(name) {
  if (!CAR_COLORS[name]) name = "cherry";
  document.documentElement.style.setProperty("--car", CAR_COLORS[name]);
  carBtns.forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.car === name)),
  );
  try {
    localStorage.setItem("car", name);
  } catch (e) {}
}
carBtns.forEach((b) =>
  b.addEventListener("click", () => setCar(b.dataset.car)),
);
let savedCar = "cherry";
try {
  savedCar = localStorage.getItem("car") || "cherry";
} catch (e) {}
setCar(savedCar);

buildRoad();
window.addEventListener("scroll", updateCar, { passive: true });

// rebuild the road once after resizing stops
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildRoad, 100);
});
window.addEventListener("load", buildRoad);
if (document.fonts && document.fonts.ready)
  document.fonts.ready.then(buildRoad);

// drag the car to scroll the page
let dragging = false;
let dragTarget = 1;
let grabOffset = 0;
let skipClick = false;

function growCar() {
  dragSize += (dragTarget - dragSize) * 0.2;
  if (Math.abs(dragTarget - dragSize) < 0.005) dragSize = dragTarget;
  updateCar();
  if (dragSize !== dragTarget) requestAnimationFrame(growCar);
}

function sceneY(clientY) {
  return (clientY - roadSvg.getBoundingClientRect().top) / roadScale;
}

function dragTo(clientY) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = sceneY(clientY) - grabOffset;
  const progress = Math.min(1, Math.max(0, (y - carY0) / (carY1 - carY0)));
  window.scrollTo(0, progress * max);
}

// signs can sit on top of the car, so check the car area directly
function overCar(e) {
  const box = carEl.getBoundingClientRect();
  return (
    e.clientX >= box.left &&
    e.clientX <= box.right &&
    e.clientY >= box.top &&
    e.clientY <= box.bottom
  );
}

roadSvg.addEventListener("pointerdown", (e) => {
  if (e.button !== 0 || !overCar(e)) return;
  e.preventDefault();
  cancelAnimationFrame(scrollFrame);
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const carY = carY0 + (window.scrollY / max) * (carY1 - carY0);
  grabOffset = sceneY(e.clientY) - carY;
  dragging = true;
  dragTarget = 1.6;
  document.documentElement.classList.add("dragging-car");
  growCar();
});

window.addEventListener("pointermove", (e) => {
  if (dragging) dragTo(e.clientY);
});

function stopDrag() {
  if (!dragging) return;
  dragging = false;
  skipClick = true;
  setTimeout(() => (skipClick = false), 0);
  dragTarget = 1;
  document.documentElement.classList.remove("dragging-car");
  growCar();
}
window.addEventListener("pointerup", stopDrag);
window.addEventListener("pointercancel", stopDrag);
window.addEventListener("blur", stopDrag);
