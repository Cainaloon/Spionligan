  /* ---------- Riktiga bakgrunder i agentlyan (filnamnen från uppladdningen) ---------- */
  var LYA_FILES = { talt: "1795274756442.jpg", rum: "1795274789304.jpg", hus: "1795274838491.jpg", slott: "1795274915632.jpg" };
  Object.keys(LYA_FILES).forEach(function (id) {
    var im = new Image(); im.onload = function () { LYA_BG[id] = true; if (ui.view === "lya") render(); }; im.src = LYA_FILES[id];
  });
  document.head.insertAdjacentHTML("beforeend", "<style>" +
    Object.keys(LYA_FILES).map(function (id) { return ".scene.st-" + id + ".has-bg { background-image: url(" + LYA_FILES[id] + "); }"; }).join("") +
    ".scene.has-bg .s-neon { top: 4%; font-size: clamp(11px, 2.6vw, 22px); }" +
    ".scene.has-bg .s-light { display: none; }" +
    "</style>");
  render();
