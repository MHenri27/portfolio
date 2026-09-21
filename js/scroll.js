const items = document.querySelectorAll(".scroll-item");

function animateOnScroll() {
  const windowHeight = window.innerHeight;
  const viewportCenter = windowHeight / 2;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;

    // distance from the center of the screen
    // a section taller than the screen counts as centered while it covers the middle
    const extra = Math.max(0, rect.height / 2 - viewportCenter);
    const distanceFromCenter = Math.max(
      0,
      Math.abs(viewportCenter - itemCenter) - extra,
    );

    // no scaling near the center
    const plateauRadius = 180;
    const maxDistance = windowHeight / 1.1;

    let factor = 1;

    if (distanceFromCenter > plateauRadius) {
      const adjustedDistance = distanceFromCenter - plateauRadius;
      const adjustedMax = maxDistance - plateauRadius;
      factor = 1 - adjustedDistance / adjustedMax;
    }

    factor = Math.max(0, Math.min(1, factor));

    const scale = 0.85 + 0.15 * factor;
    const opacity = factor ** 1.2;

    item.style.transform = `scale(${scale.toFixed(3)})`;
    item.style.opacity = opacity.toFixed(3);
  });

  updateFolio();
}

// page name in the header and the progress bar
const folioName = document.getElementById("folioName");
const progress = document.getElementById("progress");
let currentPage = -1;

function updateFolio() {
  const mid = window.innerHeight / 2;
  let best = 0;
  let bestDist = Infinity;

  items.forEach((item, i) => {
    const r = item.getBoundingClientRect();
    const d = Math.abs(mid - (r.top + r.height / 2));
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });

  if (best !== currentPage) {
    currentPage = best;
    folioName.textContent = items[best].dataset.name || "";
  }

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, p)).toFixed(4)})`;
}

// give every popping element its own tilt
document.querySelectorAll(".rv").forEach((el, i) => {
  const tilt = 3 + (i % 3) * 2;
  el.style.setProperty("--tilt", `${i % 2 ? tilt : -tilt}deg`);
});

// fade in sections when they come into view
// no threshold, so very tall sections on small screens still show up
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { rootMargin: "-10% 0px" },
  );
  items.forEach((i) => observer.observe(i));
} else {
  items.forEach((i) => i.classList.add("in"));
}

window.addEventListener("scroll", animateOnScroll, { passive: true });
window.addEventListener("resize", animateOnScroll);
document.addEventListener("DOMContentLoaded", animateOnScroll);

animateOnScroll();
