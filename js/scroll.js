const items = document.querySelectorAll(".scroll-item");

function animateOnScroll() {
  const windowHeight = window.innerHeight;
  const viewportCenter = windowHeight / 2;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;

    // distance from the middle of the screen
    // tall sections count as centered while they cover the middle
    const extra = Math.max(0, rect.height / 2 - viewportCenter);
    const dist = Math.max(0, Math.abs(viewportCenter - itemCenter) - extra);

    // no scaling close to the center
    const flat = 180;
    const maxDist = windowHeight / 1.1;

    let amount = 1;
    if (dist > flat) {
      amount = 1 - (dist - flat) / (maxDist - flat);
    }
    amount = Math.max(0, Math.min(1, amount));

    const scale = 0.85 + 0.15 * amount;
    const opacity = amount ** 1.2;

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
  let closest = 0;
  let closestDist = Infinity;

  items.forEach((item, i) => {
    const rect = item.getBoundingClientRect();
    const dist = Math.abs(mid - (rect.top + rect.height / 2));
    if (dist < closestDist) {
      closestDist = dist;
      closest = i;
    }
  });

  if (closest !== currentPage) {
    currentPage = closest;
    folioName.textContent = items[closest].dataset.name || "";
  }

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const done = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, done)).toFixed(4)})`;
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
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { rootMargin: "-10% 0px" },
  );
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("in"));
}

window.addEventListener("scroll", animateOnScroll, { passive: true });
window.addEventListener("resize", animateOnScroll);
document.addEventListener("DOMContentLoaded", animateOnScroll);

animateOnScroll();
