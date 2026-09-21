// puts the templates on the page
document.getElementById("projects").innerHTML =
  PROJECTS.map(projectSection).join("");
document.getElementById("contents").innerHTML = contentsHtml();
document.getElementById("toolList").innerHTML = toolListHtml();
document.getElementById("mxLabels").innerHTML = matrixLabelsHtml();
document.getElementById("matrix").innerHTML = matrixHtml();
document.getElementById("moreTools").innerHTML = moreToolsHtml();

// the matrix css needs the number of rows and columns
document.getElementById("matrixWrap").style.setProperty("--rows", stackLayers().length);
document.getElementById("matrix").style.setProperty("--n", PROJECTS.length);

if (PROJECTS.length) {
  const workLink = document.querySelector('.nav-links a[href="#work"]');
  if (workLink) workLink.setAttribute("href", "#" + PROJECTS[0].id);
}
