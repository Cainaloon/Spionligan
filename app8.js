  /* ---------- Agentlyan: stor säng, skrivbord och saker på skrivbordet ---------- */
  SHOP.splice(1, 0, { id: "skrivbord", em: "🪑", name: "Agentskrivbord", price: 20, kind: "floor" });
  var DESKTOP = ["dator", "panel", "labb"], DESK_MAX = 2;

  var BED_SVG = '<svg viewBox="0 0 240 130" aria-hidden="true">' +
    '<rect x="22" y="112" width="10" height="16" fill="#3d2615"/><rect x="208" y="112" width="10" height="16" fill="#3d2615"/>' +
    '<rect x="4" y="8" width="26" height="118" rx="7" fill="#5a3a22"/><rect x="8" y="14" width="18" height="40" rx="5" fill="#7b4f2c"/>' +
    '<rect x="210" y="52" width="24" height="74" rx="6" fill="#5a3a22"/>' +
    '<rect x="24" y="88" width="192" height="24" rx="4" fill="#7b4f2c"/><rect x="24" y="88" width="192" height="4" fill="#9a6a3f"/>' +
    '<rect x="28" y="64" width="186" height="28" rx="9" fill="#e8eef3"/>' +
    '<ellipse cx="58" cy="64" rx="27" ry="12" fill="#fff"/><ellipse cx="58" cy="61" rx="20" ry="6" fill="#f3f7fa"/>' +
    '<path d="M84 58 Q150 50 214 60 L214 98 Q150 104 84 98 Z" fill="#123b52"/>' +
    '<path d="M84 70 Q150 62 214 72 L214 78 Q150 68 84 76 Z" fill="#3fe6ff" opacity=".85"/>' +
    '<path d="M84 84 Q150 78 214 86 L214 90 Q150 83 84 88 Z" fill="#ff4fa3" opacity=".8"/>' +
    '<path d="M84 58 L84 98" stroke="#0b2838" stroke-width="3"/></svg>';

  var DESK_SVG = '<svg viewBox="0 0 200 120" aria-hidden="true">' +
    '<rect x="12" y="40" width="12" height="78" fill="#2c1f16"/>' +
    '<rect x="128" y="40" width="62" height="78" rx="3" fill="#3a2a1f"/>' +
    '<rect x="134" y="48" width="50" height="30" rx="3" fill="#4a3627"/><rect x="134" y="82" width="50" height="30" rx="3" fill="#4a3627"/>' +
    '<rect x="152" y="60" width="14" height="5" rx="2" fill="#ffd166"/><rect x="152" y="94" width="14" height="5" rx="2" fill="#ffd166"/>' +
    '<rect x="0" y="28" width="200" height="14" rx="3" fill="#4d3626"/><rect x="0" y="28" width="200" height="3" rx="1.5" fill="#3fe6ff" opacity=".7"/></svg>';

  function deskOf(L) {
    if (!L.desk) L.desk = [];
    if (L.floor.indexOf("skrivbord") < 0 && L.desk.length) L.desk = [];
    return L.desk;
  }

  lyaScene = function (a, L) {
    var desk = deskOf(L), hasBed = L.floor.indexOf("sang") >= 0, hasDesk = L.floor.indexOf("skrivbord") >= 0;
    var h = '<div class="scene" style="--wall:' + esc(L.color) + '">';
    h += '<div class="s-wall"></div><div class="s-light"></div>';
    h += '<div class="s-window" aria-hidden="true"><div class="s-moon"></div>' + STARS.map(function (p) { return '<i style="left:' + p[0] + "%;top:" + p[1] + '%"></i>'; }).join("") + "</div>";
    h += '<div class="s-neon" aria-hidden="true">' + esc(agentLabel(a)) + "</div>";
    h += '<div class="s-base"></div><div class="s-floor"></div><div class="s-rug"></div>';
    WALL_SPOTS.forEach(function (p, i) {
      var it = L.wall[i] ? shopItem(L.wall[i]) : null, pos = 'style="left:' + p[0] + "%;top:" + p[1] + '%"';
      h += it ? '<button type="button" class="s-slot ws" ' + pos + ' data-a="unplace" data-kind="wall" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '"><span class="frame">' + it.em + "</span></button>"
        : '<div class="s-slot ws" ' + pos + ' aria-hidden="true"><span class="frame empty"></span></div>';
    });
    var spots = hasBed && hasDesk ? [38, 63] : hasBed ? [38, 70, 88] : hasDesk ? [13, 31, 63] : [13, 31, 70, 88], n = 0;
    L.floor.forEach(function (id, i) {
      var it = shopItem(id); if (!it) return;
      if (id === "sang") { h += '<button type="button" class="s-big s-bed" data-a="unplace" data-kind="floor" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '">' + BED_SVG + "</button>"; return; }
      if (id === "skrivbord") {
        h += '<div class="s-big s-desk"><button type="button" class="s-deskbtn" data-a="unplace" data-kind="floor" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '">' + DESK_SVG + '</button><div class="on-desk">' +
          desk.map(function (d, j) { var t = shopItem(d); return '<button type="button" data-a="unplace" data-kind="desk" data-i="' + j + '" aria-label="Ta bort ' + esc(t.name) + '">' + t.em + "</button>"; }).join("") + "</div></div>";
        return;
      }
      var x = spots[n++]; if (x == null) return;
      h += '<button type="button" class="s-slot fs" style="left:' + x + '%;top:99%" data-a="unplace" data-kind="floor" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '"><span class="obj">' + it.em + '</span><span class="shadow"></span></button>';
    });
    for (; n < spots.length; n++) h += '<div class="s-slot fs" style="left:' + spots[n] + '%;top:99%" aria-hidden="true"><span class="spot"></span></div>';
    h += '<div class="s-me">' + face(a, 70) + "</div>";
    return h + "</div>";
  };

  function curLya() { var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]; return a ? lya(a) : null; }
  // Lägg datorn (och andra skrivbordssaker) på skrivbordet om det står i rummet
  function toDesk(L, id) {
    var desk = deskOf(L);
    if (DESKTOP.indexOf(id) < 0 || L.floor.indexOf("skrivbord") < 0 || desk.indexOf(id) >= 0 || desk.length >= DESK_MAX) return false;
    var k = L.floor.indexOf(id); if (k >= 0) L.floor.splice(k, 1);
    desk.push(id); return true;
  }
  function afterPlace(id) {
    var L = curLya(); if (!L) return;
    var moved = false;
    if (id === "skrivbord" && L.floor.indexOf("skrivbord") >= 0) L.floor.slice().forEach(function (x) { if (toDesk(L, x)) moved = true; });
    else if (L.owned.indexOf(id) >= 0) moved = toDesk(L, id);
    if (moved) { save(); render(); toast(id === "skrivbord" ? "Skrivbordet är på plats!" : shopItem(id).em + " står nu på skrivbordet!"); }
  }
  var _buy8 = actions.buy, _place8 = actions.place, _unplace8 = actions.unplace;
  Object.assign(actions, {
    buy: function (el) { _buy8(el); afterPlace(el.dataset.id); },
    place: function (el) {
      var L = curLya(), id = el.dataset.id;
      if (L && toDesk(L, id)) { save(); render(); toast(shopItem(id).em + " står nu på skrivbordet!"); return; }
      _place8(el); afterPlace(id);
    },
    unplace: function (el) {
      var L = curLya(); if (!L) return;
      if (el.dataset.kind === "desk") { deskOf(L).splice(Number(el.dataset.i), 1); save(); render(); return; }
      if (el.dataset.kind === "floor" && L.floor[Number(el.dataset.i)] === "skrivbord") L.desk = [];
      _unplace8(el);
    }
  });

  var _viewLya8 = viewLya;
  viewLya = function () {
    var h = _viewLya8(), L = curLya();
    if (L) deskOf(L).forEach(function (id) {
      h = h.split('data-a="place" data-id="' + id + '">Ställ i rummet</button>').join('disabled>På skrivbordet</button>');
    });
    h = h.split('<span class="em">🛏️</span>').join('<span class="em svg">' + BED_SVG + "</span>");
    h = h.split('<span class="em">🪑</span>').join('<span class="em svg">' + DESK_SVG + "</span>");
    return h;
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".s-big { position: absolute; z-index: 2; bottom: 2%; background: none !important; border: 0 !important; padding: 0; min-height: 0; clip-path: none !important; box-shadow: none; filter: drop-shadow(0 8px 6px rgba(0,0,0,.45)); }" +
    ".s-big svg { display: block; width: 100%; height: auto; }" +
    ".s-bed { left: 1%; width: 31%; }" +
    ".s-desk { right: 1%; width: 27%; }" +
    ".s-deskbtn { display: block; width: 100%; background: none !important; border: 0 !important; padding: 0; min-height: 0; clip-path: none !important; box-shadow: none; }" +
    ".on-desk { position: absolute; left: 4%; right: 36%; bottom: 74%; display: flex; justify-content: center; align-items: flex-end; gap: 2px; }" +
    ".on-desk button { background: none !important; border: 0 !important; padding: 0; min-height: 0; clip-path: none !important; box-shadow: none; font-size: clamp(24px, 6.6vw, 56px); line-height: 1; filter: drop-shadow(0 3px 2px rgba(0,0,0,.5)); }" +
    ".on-desk button:first-child:last-child { font-size: clamp(30px, 8vw, 66px); }" +
    "button.s-big:hover svg, .s-deskbtn:hover svg, .on-desk button:hover { transform: scale(1.04); }" +
    ".s-big:focus-visible, .s-deskbtn:focus-visible, .on-desk button:focus-visible { outline: 3px solid var(--sun); outline-offset: 3px; }" +
    ".shop .item .em.svg svg { width: 54px; height: auto; }" +
    "</style>");
  render();
