  /* ---------- Väggfärg som tonar de riktiga bakgrunderna ---------- */
  var WALL_H = { talt: 74, rum: 74, hus: 71, slott: 73 }; // hur långt ner väggen går, i procent
  var TINTS = ["#2b4c8c", "#5b3a8c", "#1f6b5c", "#8c3a4f", "#7a5a12", "#c2410c", "#be185d"];

  function curAgentL() { var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0] || state.agents[0]; return a ? lya(a) : null; }

  var _viewLya13 = viewLya;
  viewLya = function () {
    var h = _viewLya13(), L = curAgentL(); if (!L) return h;
    var st = stageOf(lvlIdx()), wh = WALL_H[st.id] || 72;
    // Tona väggen om en färg är vald
    if (L.tint) h = h.replace(/(<div class="scene[^"]*has-bg[^>]*>)/, '$1<div class="s-tint" style="--tint:' + esc(L.tint) + ";--wh:" + wh + '%"></div>');
    // Ny väljare: Original plus färger
    var picker = '<div class="row wallpick"><b>Väggfärg:</b>' +
      '<button type="button" data-a="wallc" data-c="" class="' + (L.tint ? "" : "sel") + '">Original</button>' +
      TINTS.map(function (c) { return '<button type="button" data-a="wallc" data-c="' + c + '" aria-label="Väggfärg" class="swatch' + (L.tint === c ? " sel" : "") + '" style="background:' + c + '">&nbsp;</button>'; }).join("") + "</div>";
    h = h.replace(/<div class="row"><b>Väggfärg:<\/b>[\s\S]*?<\/div>/, picker);
    return h;
  };

  Object.assign(actions, {
    wallc: function (el) {
      var L = curAgentL(); if (!L) return;
      L.tint = el.dataset.c || null; L.color = el.dataset.c || WALLS[0];
      save(); render();
    }
  });

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".s-tint { position: absolute; left: 0; right: 0; top: 0; height: calc(var(--wh) + 4%); z-index: 1; pointer-events: none; mix-blend-mode: color; opacity: .75;" +
    " background: linear-gradient(180deg, var(--tint) 0, var(--tint) calc(100% - 5%), transparent 100%); }" +
    ".wallpick { flex-wrap: wrap; gap: 8px; align-items: center; }" +
    ".wallpick .swatch { min-width: 44px; min-height: 44px; padding: 0; }" +
    ".wallpick .sel { outline: 3px solid var(--sun); outline-offset: 2px; }" +
    "</style>");
  render();
