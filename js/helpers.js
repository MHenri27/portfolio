// make text safe to put inside html
const esc = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// turn line breaks into spaces
const oneLine = (text) => String(text).replace(/\n/g, " ");

// pseudo random number between 0 and 1, always the same for the same input
const hash = (n) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// points of an octagon, used for the low-poly shapes
const octagon = (cx, cy, r) =>
  [...Array(8)]
    .map((_, i) => {
      const a = (Math.PI / 4) * i + Math.PI / 8;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");
