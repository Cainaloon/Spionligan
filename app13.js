  /* ---------- Väggfärg som tonar de riktiga bakgrunderna ---------- */
  var WALL_H = { talt: 74, rum: 74, hus: 71, slott: 73 }; // hur långt ner väggen går, i procent
  // Fönstret i varje bakgrund (punkter i procent av bilden) som inte ska tonas
  var WINDOW_HOLE = {
    talt: [[11.8, 24], [24.6, 27], [21.5, 55], [17.2, 80.5], [5, 91], [7.5, 60]],
    rum: [[7.1, 16.5], [18.6, 20.5], [17.6, 69.5], [7.1, 72]],
    hus: [[3.2, 0], [22.2, 0], [21.8, 72.5], [3, 77]],
    slott: [[10.1, 65], [10.1, 24], [10.5, 18], [11.3, 15.3], [12.3, 14.2], [13.4, 13.8], [14.5, 14.2], [15.5, 15.3], [16.4, 18], [16.9, 24], [16.9, 65]]
  };
  // Färgtonen ritas som SVG med ett hål för fönstret (fungerar i alla webbläsare)
  function tintSvg(id, wh, color) {
    var H = wh + 4, hole = WINDOW_HOLE[id] || [];
    var d = "M0 0H100V" + H + "H0Z" + (hole.length ? " M" + hole.map(function (p) { return p[0] + " " + Math.min(H, p[1]); }).join(" L") + "Z" : "");
    return '<svg class="s-tint" style="--wh:' + wh + '%" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="tintfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '"/><stop offset="' + ((H - 5) / H).toFixed(3) + '" stop-color="' + color + '"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path fill-rule="evenodd" fill="url(#tintfade)" d="' + d + '"/></svg>';
  }
  var TINTS = ["#2b4c8c", "#5b3a8c", "#1f6b5c", "#8c3a4f", "#7a5a12", "#c2410c", "#be185d"];

  function curAgentL() { var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0] || state.agents[0]; return a ? lya(a) : null; }

  var _viewLya13 = viewLya;
  viewLya = function () {
    var h = _viewLya13(), L = curAgentL(); if (!L) return h;
    var st = stageOf(lvlIdx()), wh = WALL_H[st.id] || 72;
    // Tona väggen om en färg är vald
    if (L.tint && /^#[0-9a-f]{6}$/i.test(L.tint)) h = h.replace(/(<div class="scene[^"]*has-bg[^>]*>)/, function (m) { return m + tintSvg(st.id, wh, L.tint); });
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
    ".s-tint { position: absolute; left: 0; top: 0; width: 100%; height: calc(var(--wh) + 4%); z-index: 1; pointer-events: none; mix-blend-mode: color; opacity: .75; display: block; }" +
    ".wallpick { flex-wrap: wrap; gap: 8px; align-items: center; }" +
    ".wallpick .swatch { min-width: 44px; min-height: 44px; padding: 0; }" +
    ".wallpick .sel { outline: 3px solid var(--sun); outline-offset: 2px; }" +
    "</style>");
  render();
