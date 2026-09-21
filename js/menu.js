// dropdown menu for small screens, built from the sections on the page
const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");

document.getElementById("menuList").innerHTML = [
  ...document.querySelectorAll(".scroll-item"),
]
  .map(
    (section, i) =>
      `<li style="--i: ${i}"><a href="#${esc(section.id)}"><span class="menu-num">${String(i + 1).padStart(2, "0")}</span>${esc(section.dataset.name)}</a></li>`,
  )
  .join("");

function setMenu(open) {
  document.documentElement.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});

// close after picking a section
menuPanel.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

// close with escape or a tap outside
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("header")) setMenu(false);
});

// the menu is only for small screens
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) setMenu(false);
});
