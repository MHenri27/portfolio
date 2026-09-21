// copy buttons
document.querySelectorAll(".copy").forEach((btn) => {
  const label = btn.textContent;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copied";
    } catch (err) {
      // no clipboard access, just show the text
      btn.textContent = btn.dataset.copy;
    }
    setTimeout(() => (btn.textContent = label), 1600);
  });
});
