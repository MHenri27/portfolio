// copy buttons
document.querySelectorAll(".copy").forEach((b) => {
  const original = b.textContent;
  b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = "Copied";
    } catch (e) {
      b.textContent = b.dataset.copy;
    }
    setTimeout(() => (b.textContent = original), 1600);
  });
});
