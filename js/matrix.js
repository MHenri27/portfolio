// hovering a cell dims the other projects
const matrix = document.getElementById("matrix");
function isolate(col) {
  matrix
    .querySelectorAll("[data-c]")
    .forEach((el) =>
      el.classList.toggle("dim", col !== null && el.dataset.c !== col),
    );
}
matrix.querySelectorAll("[data-c]").forEach((el) => {
  el.addEventListener("mouseenter", () => isolate(el.dataset.c));
});
matrix.addEventListener("mouseleave", () => isolate(null));

// sideways scroll with a custom bar
(function () {
  const wrap = document.getElementById("matrixWrap");
  const scroller = document.getElementById("mxScroll");
  const bar = document.getElementById("mxBar");
  const thumb = document.getElementById("mxThumb");
  if (!wrap || !scroller) return;

  function update() {
    const max = scroller.scrollWidth - scroller.clientWidth;
    const scrollable = max > 2;
    wrap.classList.toggle("no-scroll", !scrollable);
    const edge = "4.5rem";
    scroller.style.setProperty("--fl", scrollable && scroller.scrollLeft > 2 ? edge : "0px");
    scroller.style.setProperty("--fr", scrollable && scroller.scrollLeft < max - 2 ? edge : "0px");
    if (!scrollable) return;
    const track = bar.clientWidth;
    const thumbW = Math.max(56, (scroller.clientWidth / scroller.scrollWidth) * track);
    thumb.style.width = thumbW + "px";
    thumb.style.left = (scroller.scrollLeft / max) * (track - thumbW) + "px";
  }

  scroller.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  if (window.ResizeObserver) new ResizeObserver(update).observe(scroller);
  update();

  // drag the thumb
  let dragging = false;
  let grab = 0;
  function scrollToThumb(clientX) {
    const box = bar.getBoundingClientRect();
    const thumbW = thumb.offsetWidth;
    const x = Math.min(Math.max(clientX - box.left - grab, 0), box.width - thumbW);
    const max = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollTo({ left: (x / (box.width - thumbW)) * max, behavior: "instant" });
  }
  thumb.addEventListener("pointerdown", (e) => {
    dragging = true;
    grab = e.clientX - thumb.getBoundingClientRect().left;
    thumb.classList.add("drag");
    thumb.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
  thumb.addEventListener("pointermove", (e) => dragging && scrollToThumb(e.clientX));
  const end = () => {
    dragging = false;
    thumb.classList.remove("drag");
  };
  thumb.addEventListener("pointerup", end);
  thumb.addEventListener("pointercancel", end);

  // click the bar to scroll there
  bar.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const box = bar.getBoundingClientRect();
    const max = scroller.scrollWidth - scroller.clientWidth;
    const ratio = (e.clientX - box.left - thumb.offsetWidth / 2) / (box.width - thumb.offsetWidth);
    scroller.scrollTo({ left: Math.min(1, Math.max(0, ratio)) * max, behavior: "smooth" });
  });
})();

// hovering a tool highlights it in the matrix
const toolBtns = document.querySelectorAll("#toolList button");
const cells = [...matrix.querySelectorAll(".m-cell")];

function showTool(name) {
  const pattern = new RegExp(
    "(^|[^A-Za-z0-9])" +
      name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "($|[^A-Za-z0-9])",
    "i",
  );
  isolate(null);
  matrix.classList.add("tooling");
  cells.forEach((cell) => cell.classList.toggle("hit", pattern.test(cell.textContent)));
}

function clearTool() {
  matrix.classList.remove("tooling");
  cells.forEach((cell) => cell.classList.remove("hit"));
}

toolBtns.forEach((btn) => {
  btn.addEventListener("mouseenter", () => showTool(btn.textContent));
  btn.addEventListener("focus", () => showTool(btn.textContent));
  btn.addEventListener("mouseleave", clearTool);
  btn.addEventListener("blur", clearTool);
});
