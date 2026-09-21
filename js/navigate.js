// smooth scrolling to a section, the car follows because it moves with the scroll
let scrollFrame = null;

function targetTop(section) {
  let top = section.offsetTop;
  const height = section.offsetHeight;
  // because my stack section is so big, i want it to start at the very top
  if (section === document.querySelector("#stack")) top += 50;
  // center small sections, start tall ones at the top
  if (height >= window.innerHeight) return top;
  return top + height / 2 - window.innerHeight / 2;
}

function scrollToY(y) {
  cancelAnimationFrame(scrollFrame);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(max, y));
  const start = window.scrollY;
  const distance = end - start;

  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo(0, end);
    return;
  }

  const duration = Math.min(2200, Math.max(700, Math.abs(distance) * 0.5));
  const startTime = performance.now();

  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    window.scrollTo(0, start + distance * eased);
    if (t < 1) scrollFrame = requestAnimationFrame(step);
  }
  scrollFrame = requestAnimationFrame(step);
}

function goTo(href) {
  if (href === "#top") {
    scrollToY(0);
    return;
  }
  const section = document.querySelector(href);
  if (section) scrollToY(targetTop(section));
}

// links to sections
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || link.getAttribute("href") === "#") return;
  e.preventDefault();
  goTo(link.getAttribute("href"));
});

// signs on the road
roadSvg.addEventListener("click", (e) => {
  if (skipClick) return;
  const sign = e.target.closest(".road-sign");
  if (sign) goTo(sign.dataset.href);
});

// stop the animation when the user scrolls by hand
["wheel", "touchstart", "keydown"].forEach((name) =>
  window.addEventListener(name, () => cancelAnimationFrame(scrollFrame), {
    passive: true,
  }),
);
