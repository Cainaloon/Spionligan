  /* ---------- Riktiga bakgrunder i agentlyan ---------- */
  // Tomma bakgrunder (lya-*.webp) används i första hand, annars de första uppladdade bilderna
  var LYA_FILES = { talt: ["lya-talt.webp", "1795274756442.jpg"], rum: ["lya-rum.webp", "1795274789304.jpg"], hus: ["lya-hus.webp", "1795274838491.jpg"], slott: ["lya-slott.webp", "1795274915632.jpg"] };
  var LYA_SRC = {};
  // Var tavlorna hänger i varje bakgrund, så att de inte hamnar över fönster och banér
  var BG_WALL_SPOTS = {
    rum: [[33, 40], [48, 36], [63, 36], [77, 40]],
    hus: [[44, 57], [57, 57], [70, 57], [57, 22]],
    slott: [[45, 42], [57, 36], [69, 36], [80, 42]]
  };
  Object.keys(LYA_FILES).forEach(function (id) {
    (function tryLoad(k) {
      var src = LYA_FILES[id][k]; if (!src) return;
      var im = new Image();
      im.onload = function () {
        LYA_SRC[id] = src; LYA_BG[id] = true;
        var st = document.getElementById("lya-bg-" + id); if (st) st.remove();
        document.head.insertAdjacentHTML("beforeend", '<style id="lya-bg-' + id + '">.scene.st-' + id + ".has-bg { background-image: url(" + src + "); }</style>");
        if (ui.view === "lya") render();
      };
      im.onerror = function () { tryLoad(k + 1); };
      im.src = src;
    })(0);
  });

  var _lyaScene12 = lyaScene;
  lyaScene = function (a, L) {
    var st = stageOf(lvlIdx()), keep = WALL_SPOTS;
    if (LYA_BG[st.id] && /^lya-/.test(LYA_SRC[st.id]) && BG_WALL_SPOTS[st.id]) WALL_SPOTS = BG_WALL_SPOTS[st.id];
    try { return _lyaScene12(a, L); } finally { WALL_SPOTS = keep; }
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".scene.has-bg .s-neon { top: 3%; left: 30%; right: 30%; font-size: clamp(11px, 2.6vw, 22px); }" +
    ".scene.has-bg .s-light { display: none; }" +
    ".scene.has-bg .s-slot .frame { width: clamp(34px, 9vw, 74px); font-size: clamp(18px, 5.4vw, 44px); }" +
    ".scene.has-bg .s-slot .frame.empty { border-color: rgba(255,255,255,.3); }" +
    "</style>");
  render();
