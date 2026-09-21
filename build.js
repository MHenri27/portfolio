// Puts the project content straight into index.html so search engines and
// crawlers that do not run javascript can read it.
// run it with: node build.js
const fs = require("fs");
const vm = require("vm");

// helpers.js asks the browser about motion settings, so give it a stand-in
const context = { matchMedia: () => ({ matches: false }) };
vm.createContext(context);

// the same files the browser loads
for (const file of ["helpers", "projects", "templates"]) {
  vm.runInContext(fs.readFileSync(`js/${file}.js`, "utf8"), context, {
    filename: file,
  });
}

const parts = vm.runInContext(
  `({
    projects: PROJECTS.map(projectSection).join(""),
    contents: contentsHtml(),
    tools: toolListHtml(),
    labels: matrixLabelsHtml(),
    matrix: matrixHtml(),
    more: moreToolsHtml(),
  })`,
  context,
);

let html = fs.readFileSync("index.html", "utf8");

for (const [name, content] of Object.entries(parts)) {
  const pattern = new RegExp(
    `(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`,
  );
  if (!pattern.test(html)) throw new Error(`marker missing: ${name}`);
  html = html.replace(pattern, () => `<!-- build:${name} -->${content}<!-- /build:${name} -->`);
}

fs.writeFileSync("index.html", html);
console.log("index.html updated");
