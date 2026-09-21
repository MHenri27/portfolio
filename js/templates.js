const ILLUSTRATIONS = {
  shops: () => {
    const shop = (x) => {
      let o = "";
      for (let i = 0; i < 6; i++) {
        const c = i % 2 === 0 ? "#d94657" : "#faf6f0";
        o += `<rect x="${x + i * 25}" y="6" width="25" height="34" fill="${c}"/><circle cx="${x + 12.5 + i * 25}" cy="40" r="12.5" fill="${c}"/>`;
      }
      return (
        o +
        `<rect x="${x + 8}" y="58" width="134" height="66" fill="#e9ded4"/><rect x="${x + 18}" y="70" width="60" height="38" fill="#faf6f0"/><rect x="${x + 92}" y="70" width="38" height="54" fill="#672a31"/>`
      );
    };
    return `<svg viewBox="0 0 320 130" role="img" aria-label="Two shopfronts">${shop(5)}${shop(165)}</svg>`;
  },
  network:
    () => `<svg viewBox="0 0 320 110" role="img" aria-label="Proxy, backend, API and engines connected in a chain">
    <g stroke="#241b1b" stroke-width="3" class="flow"><line x1="58" y1="42" x2="86" y2="42"/><line x1="146" y1="42" x2="174" y2="42"/><line x1="234" y1="42" x2="262" y2="42"/></g>
    <rect x="0" y="14" width="56" height="56" fill="#241b1b"/><rect x="88" y="14" width="56" height="56" fill="#d94657"/><rect x="176" y="14" width="56" height="56" fill="#672a31"/><rect x="264" y="14" width="56" height="56" fill="#d94657"/>
    <g font-family="Azeret Mono, monospace" font-size="11" fill="#241b1b" text-anchor="middle"><text x="28" y="94">Proxy</text><text x="116" y="94">Backend</text><text x="204" y="94">API</text><text x="292" y="94">Engines</text></g></svg>`,
  hanger:
    () => `<svg viewBox="0 0 320 130" role="img" aria-label="A shirt on a hanger with a resale tag">
    <path d="M160 40 V31 a9 9 0 1 0 -9 -9" fill="none" stroke="#241b1b" stroke-width="4" stroke-linecap="round"/>
    <path d="M160 40 L96 64 H224 Z" fill="none" stroke="#241b1b" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="118,64 146,60 174,60 202,64 232,86 214,100 198,90 198,128 122,128 122,90 106,100 88,86" fill="#d94657"/>
    <g transform="rotate(10 272 40)"><rect x="238" y="26" width="72" height="26" fill="#672a31"/><text x="274" y="43" fill="#faf6f0" font-family="Azeret Mono, monospace" font-size="11" text-anchor="middle">Resale</text></g></svg>`,
  blocks: () =>
    `<svg viewBox="0 0 320 110" role="img" aria-label="Abstract blocks"><rect x="10" y="40" width="70" height="60" fill="#d94657"/><rect x="92" y="14" width="70" height="86" fill="#241b1b"/><rect x="174" y="52" width="70" height="48" fill="#672a31"/><rect x="256" y="28" width="54" height="72" fill="#d94657"/></svg>`,
};

// custom svg strings come from projects.js, so only put your own markup there
function illustration(p) {
  const raw =
    p.illustration && p.illustration.trim().startsWith("<svg")
      ? p.illustration
      : (ILLUSTRATIONS[p.illustration] || ILLUSTRATIONS.blocks)();
  return raw.replace("<svg", '<svg class="illus rv" style="--i: 0"');
}

function projectSection(p) {
  let desc = esc(p.desc);
  (p.highlights || []).forEach((h) => {
    const e = esc(h);
    desc = desc.replace(e, () => `<mark class="hl">${e}</mark>`);
  });
  const arrow =
    '<svg viewBox="0 0 40 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M38 22 C 26 24, 14 18, 5 7"/><path d="M4 15 L4 6 L13 7"/></svg>';
  const built = (p.builtWith || []).map(esc).join(" · ");
  return `
<section class="scroll-item" id="${esc(p.id)}" data-name="${esc(oneLine(p.title))}" aria-label="${esc(oneLine(p.title))}">
  <div class="content-canvas">
    ${p.ghost ? `<span class="ghost" aria-hidden="true">${esc(p.ghost)}</span>` : ""}
    <div class="project-grid">
      <div class="project-narrative">
        ${p.sticker ? `<span class="sticker">${esc(p.sticker)}</span>` : ""}
        <div class="title-row">
          <h2 class="project-title rv">${esc(p.title).replace(/\n/g, "<br />")}</h2>
          ${p.note ? `<p class="note rv" style="--i: 2">${arrow}<span>${esc(p.note)}</span></p>` : ""}
        </div>
        <p class="project-desc rv" style="--i: 1">${desc}</p>
        ${p.scope && p.scope.length ? `<ul class="scope rv" style="--i: 2">${p.scope.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${built ? `<div class="project-tools rv" style="--i: 3"><span>Built with</span>${built}</div>` : ""}
        ${p.link ? `<a href="${esc(safeUrl(p.link[1]))}" class="editorial-link rv" style="--i: 4">${esc(p.link[0])}</a>` : ""}
      </div>
      <div class="project-specs">
        ${illustration(p)}
        <div class="spec-list">
          ${(p.specs || []).map(([k, v], n) => `<div class="spec-row rv" style="--i: ${n + 1}"><span class="spec-key">${esc(k)}</span><span class="spec-val">${esc(v)}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function contentsHtml() {
  return (
    PROJECTS.map(
      (p) =>
        `<li><a href="#${esc(p.id)}"><span class="c-title">${esc(oneLine(p.title))}</span><span class="c-note">${esc(p.short || "")}</span></a></li>`,
    ).join("") +
    `<li><a href="#stack"><span class="c-title">The stack</span><span class="c-note">Skills</span></a></li>` +
    `<li><a href="#contact"><span class="c-title">Contact</span><span class="c-note">Get in touch</span></a></li>`
  );
}

// every tool from all projects, no duplicates
function toolListHtml() {
  const allTools = [];
  PROJECTS.forEach((p) =>
    [...(p.builtWith || []), ...(p.extraTools || [])].forEach((t) => {
      if (!allTools.includes(t)) allTools.push(t);
    }),
  );
  return allTools.map((t) => `<button type="button">${esc(t)}</button>`).join("");
}

// only the layers that at least one project uses
function stackLayers() {
  return STACK_LAYERS.filter(([key]) =>
    PROJECTS.some((p) => p.stack && p.stack[key]),
  );
}

function matrixLabelsHtml() {
  return (
    `<span class="m-row head"></span>` +
    stackLayers()
      .map(([, label]) => `<span class="m-row">${esc(label)}</span>`)
      .join("")
  );
}

// stack matrix, one column per project and one row per layer
function matrixHtml() {
  let h = PROJECTS.map(
    (p, i) =>
      `<span class="m-col" data-c="${i + 1}">${esc(oneLine(p.title))}</span>`,
  ).join("");
  stackLayers().forEach(([key]) => {
    PROJECTS.forEach((p, i) => {
      const v = p.stack && p.stack[key];
      h += `<span class="m-cell${v ? "" : " none"}" data-c="${i + 1}" data-name="${esc(oneLine(p.title))}">${esc(v || "Not applicable")}</span>`;
    });
  });
  return h;
}

// wider toolkit, grouped by kind
function moreToolsHtml() {
  return MORE_TOOLS.map(
    ([label, tools]) =>
      `<div><dt>${esc(label)}</dt><dd>${tools.map((t) => `<span>${esc(t)}</span>`).join("")}</dd></div>`,
  ).join("");
}
