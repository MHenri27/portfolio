// coin flip
(() => {
  const btn = document.getElementById("coinBtn");
  const coin = document.getElementById("coin");
  if (!btn || !coin) return;
  let angle = 0;
  let busy = false;
  function flip() {
    if (busy) return;
    busy = true;
    const from = angle;
    const spins = 360 * (2 + Math.floor(Math.random() * 3));
    angle = from + spins + (Math.random() < 0.5 ? 0 : 180);
    const quick = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anim = coin.animate(
      [
        { transform: `translateY(0) rotateY(${from}deg)` },
        {
          transform: `translateY(${quick ? 0 : -50}px) rotateY(${from + (angle - from) * 0.55}deg)`,
          offset: 0.45,
        },
        { transform: `translateY(0) rotateY(${angle}deg)` },
      ],
      {
        duration: quick ? 250 : 1400,
        easing: "cubic-bezier(0.25, 0.6, 0.35, 1)",
      },
    );
    coin.style.transform = `rotateY(${angle}deg)`;
    anim.onfinish = () => (busy = false);
  }
  btn.addEventListener("click", flip);
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });
})();

// split headings into letters for the hover effect
function splitChars(node) {
  [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        const w = document.createElement("span");
        w.className = "w";
        [...part].forEach((c) => {
          const ch = document.createElement("span");
          ch.className = "ch";
          ch.textContent = c;
          w.appendChild(ch);
        });
        frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName === "EM") {
      splitChars(n);
    }
  });
}

document
  .querySelectorAll(".project-title, .section-title, .footer-title")
  .forEach((h) => {
    h.setAttribute(
      "aria-label",
      h.textContent.replace(/\s+/g, " ").trim(),
    );
    splitChars(h);
  });

// crop marks in the corners of every page
document.querySelectorAll(".content-canvas").forEach((c) => {
  ["tl", "tr", "bl", "br"].forEach((k) => {
    const m = document.createElement("span");
    m.className = "crop " + k;
    m.setAttribute("aria-hidden", "true");
    c.appendChild(m);
  });
});

// word changer in the hero
const cycle = document.getElementById("cycle");
const words = [
  "right.",
  "clean.",
  "solid.",
  "fast.",
  "useful.",
  "reliable.",
  "unique.",
];
let wordIndex = 0;

function nextWord() {
  cycle.classList.add("out");
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    cycle.textContent = words[wordIndex];
    cycle.classList.remove("out");
  }, 200);
}

cycle.addEventListener("click", nextWord);
cycle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextWord();
  }
});

// moving background shapes, ghost words and stamps
const shapes = [...document.querySelectorAll(".shape")];
const ghosts = [...document.querySelectorAll(".ghost")];
const stampSvgs = [...document.querySelectorAll(".stamp svg")];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateLife() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const sy = window.scrollY;

  shapes.forEach((el) => {
    const size = el.offsetHeight || 40;
    const range = H + size;
    const y0 = (parseFloat(el.dataset.y) / 100) * H;
    const x = (parseFloat(el.dataset.x) / 100) * W;
    const drift = reduceMotion ? 0 : sy * parseFloat(el.dataset.speed);
    const y = ((((y0 - drift) % range) + range) % range) - size;
    const rot = reduceMotion ? 0 : sy * parseFloat(el.dataset.spin || 0);
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
  });

  if (!reduceMotion) {
    stampSvgs.forEach((svg) =>
      svg.style.setProperty("--r", `${(sy * 0.12).toFixed(1)}deg`),
    );
  }
}

function updateGhosts() {
  if (reduceMotion) return;
  ghosts.forEach((g) => {
    const r = g.closest(".scroll-item").getBoundingClientRect();
    const off = r.top + r.height / 2 - window.innerHeight / 2;
    g.style.transform = `translateX(${(-off * 0.18).toFixed(1)}px)`;
  });
}

// change the tab title when the tab is hidden
const baseTitle = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "Still here. Henri." : baseTitle;
});

window.addEventListener(
  "scroll",
  () => {
    updateLife();
    updateGhosts();
  },
  { passive: true },
);
window.addEventListener("resize", () => {
  updateLife();
  updateGhosts();
});
updateLife();
updateGhosts();
