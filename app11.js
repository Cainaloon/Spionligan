  /* ---------- Agentlyan växer: tält → rum → hus → slott, saker låses upp med nivån ---------- */
  var LYA_STAGES = [
    { id: "talt", em: "⛺", name: "Agenttältet", lvl: 0 },
    { id: "rum", em: "🚪", name: "Agentrummet", lvl: 1 },
    { id: "hus", em: "🏠", name: "Agenthuset", lvl: 2 },
    { id: "slott", em: "🏰", name: "Agentslottet", lvl: 4 }
  ];
  SHOP.unshift(
    { id: "sovsack", em: "💤", name: "Sovsäck", price: 5, kind: "floor" },
    { id: "stormkok", em: "🍲", name: "Stormkök", price: 10, kind: "floor" }
  );
  SHOP.push(
    { id: "skold", em: "🛡️", name: "Riddarsköld", price: 60, kind: "wall" },
    { id: "kula", em: "🔮", name: "Kristallkula", price: 70, kind: "floor" }
  );
  var ITEM_LVL = { sovsack: 0, stormkok: 0, nalle: 0, keps: 0, glas: 0,
    sang: 1, skrivbord: 1, vaxt: 1, dator: 1, karta: 1, uggla: 1, kikare: 1, hatt: 1,
    akvarium: 2, labb: 2, ufo: 2, raket: 2, mantel: 2,
    panel: 3, pokal: 3,
    krona: 4, skold: 4, kula: 4 };
  shopItem("nalle").name = "Gosedjur";

  function lvlIdx() { var p = state.pts || 0, i = 0; LEVELS.forEach(function (l, k) { if (p >= l[0]) i = k; }); return i; }
  function stageOf(i) { var s = LYA_STAGES[0]; LYA_STAGES.forEach(function (x) { if (i >= x.lvl) s = x; }); return s; }
  function nextStage(i) { return LYA_STAGES.filter(function (x) { return x.lvl > i; })[0] || null; }
  function unlocked(id) { return (ITEM_LVL[id] || 0) <= lvlIdx(); }
  function lockText(id) { return "🔒 " + LEVELS[ITEM_LVL[id] || 0][1]; }
  // Saker som inte passar på nuvarande nivå plockas undan (de finns kvar bland Mina saker)
  function tidyLya(L) {
    L.floor = L.floor.filter(unlocked); L.wall = L.wall.filter(unlocked);
    if (L.desk) L.desk = L.desk.filter(unlocked);
    if (L.wear && !unlocked(L.wear)) L.wear = null;
  }

  var SLEEP_SVG = '<svg viewBox="0 0 240 90" aria-hidden="true">' +
    '<rect x="6" y="40" width="228" height="44" rx="22" fill="#0f5b6b"/>' +
    '<rect x="6" y="40" width="228" height="12" rx="6" fill="#3fe6ff" opacity=".55"/>' +
    '<path d="M70 46 L226 46" stroke="#ffd166" stroke-width="3" stroke-dasharray="6 5"/>' +
    '<rect x="12" y="30" width="62" height="30" rx="15" fill="#e8eef3"/>' +
    '<rect x="12" y="62" width="222" height="22" rx="11" fill="#0a4250"/></svg>';
  var BIG = { sang: { cls: "s-bed", svg: function () { return BED_SVG; } }, sovsack: { cls: "s-bed s-sleep", svg: function () { return SLEEP_SVG; } } };

  lyaScene = function (a, L) {
    var desk = deskOf(L), st = stageOf(lvlIdx());
    var hasBed = L.floor.some(function (x) { return BIG[x]; }), hasDesk = L.floor.indexOf("skrivbord") >= 0;
    var h = '<div class="scene st-' + st.id + '" style="--wall:' + esc(L.color) + '">';
    h += '<div class="s-wall"></div><div class="s-light"></div>';
    h += '<div class="s-window" aria-hidden="true"><div class="s-moon"></div>' + STARS.map(function (p) { return '<i style="left:' + p[0] + "%;top:" + p[1] + '%"></i>'; }).join("") + "</div>";
    h += '<div class="s-neon" aria-hidden="true">' + esc(agentLabel(a)) + "</div>";
    h += '<div class="s-base"></div><div class="s-floor"></div><div class="s-rug"></div>';
    if (st.id !== "talt") WALL_SPOTS.forEach(function (p, i) {
      var it = L.wall[i] ? shopItem(L.wall[i]) : null, pos = 'style="left:' + p[0] + "%;top:" + p[1] + '%"';
      h += it ? '<button type="button" class="s-slot ws" ' + pos + ' data-a="unplace" data-kind="wall" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '"><span class="frame">' + it.em + "</span></button>"
        : '<div class="s-slot ws" ' + pos + ' aria-hidden="true"><span class="frame empty"></span></div>';
    });
    var spots = hasBed && hasDesk ? [38, 63] : hasBed ? [38, 70, 88] : hasDesk ? [13, 31, 63] : [13, 31, 70, 88], n = 0;
    L.floor.forEach(function (id, i) {
      var it = shopItem(id); if (!it) return;
      if (BIG[id]) { h += '<button type="button" class="s-big ' + BIG[id].cls + '" data-a="unplace" data-kind="floor" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '">' + BIG[id].svg() + "</button>"; return; }
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

  // Riktiga bakgrundsbilder (lya-talt.webp osv.) används när de finns i repot
  var LYA_BG = {};
  LYA_STAGES.forEach(function (s) { var im = new Image(); im.onload = function () { LYA_BG[s.id] = true; if (ui.view === "lya") render(); }; im.src = "lya-" + s.id + ".webp"; });

  var _viewLya11 = viewLya;
  viewLya = function () {
    var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0] || state.agents[0];
    if (a) tidyLya(lya(a));
    var h = _viewLya11(); if (!a) return h;
    var L = lya(a), i = lvlIdx(), st = stageOf(i), nx = nextStage(i);
    if (LYA_BG[st.id]) h = h.replace('<div class="scene st-' + st.id + '"', '<div class="scene st-' + st.id + ' has-bg" ');
    h = h.replace('<div class="scene', '<div class="stagebar"><b>' + st.em + " " + st.name + "</b>" +
      (nx ? '<span class="small muted">Nästa: ' + nx.em + " " + nx.name + " när ni blir " + LEVELS[nx.lvl][1] + " (" + Math.max(0, LEVELS[nx.lvl][0] - (state.pts || 0)) + " poäng kvar)</span>"
        : '<span class="small muted">Högsta nivån! Ni bor i ett slott.</span>') + '</div><div class="scene');
    // Låsta saker i butiken och bland Mina saker
    SHOP.forEach(function (it) {
      if (unlocked(it.id)) return;
      h = h.split('data-a="buy" data-id="' + it.id + '"').join('data-a="buy" data-id="' + it.id + '" data-locked="1" disabled');
      h = h.split('data-a="place" data-id="' + it.id + '">Ställ i rummet</button>').join('disabled>' + lockText(it.id) + "</button>");
      h = h.split('data-a="wear" data-id="' + it.id + '">Ta på</button>').join('disabled>' + lockText(it.id) + "</button>");
    });
    h = h.split('<span class="em">💤</span>').join('<span class="em svg">' + SLEEP_SVG + "</span>");
    h = h.replace(/(<button type="button" class="[^"]*" data-a="buy" data-id="([a-z]+)" data-locked="1" disabled(?: disabled)?>)🪙 \d+/g, function (m, pre, id) { return pre + lockText(id); });
    return h;
  };

  // Shoppen sorteras efter nivå så att det man kan köpa nu kommer först
  SHOP.sort(function (x, y) { return (ITEM_LVL[x.id] || 0) - (ITEM_LVL[y.id] || 0); });

  // Säng och sovsäck får inte stå i rummet samtidigt: den nya ersätter den gamla
  function oneBed(id) {
    var other = id === "sang" ? "sovsack" : id === "sovsack" ? "sang" : null; if (!other) return;
    var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]; if (!a) return;
    var L = lya(a); if (L.floor.indexOf(id) < 0 || L.floor.indexOf(other) < 0) return;
    L.floor.splice(L.floor.indexOf(other), 1); save(); render();
  }
  var _buy11 = actions.buy, _place11 = actions.place, _wear11 = actions.wear;
  function lockedToast(id) { toast("🔒 " + shopItem(id).name + " låses upp när ni blir " + LEVELS[ITEM_LVL[id] || 0][1] + "."); }
  Object.assign(actions, {
    buy: function (el) { if (!unlocked(el.dataset.id)) return lockedToast(el.dataset.id); _buy11(el); oneBed(el.dataset.id); },
    place: function (el) { if (!unlocked(el.dataset.id)) return lockedToast(el.dataset.id); _place11(el); oneBed(el.dataset.id); },
    wear: function (el) { if (!unlocked(el.dataset.id)) return lockedToast(el.dataset.id); _wear11(el); }
  });

  // Firar när lyan blir större
  var _render11 = render;
  render = function () {
    var st = LYA_STAGES.indexOf(stageOf(lvlIdx()));
    if (state.lyaStage == null) state.lyaStage = st;
    if (st > state.lyaStage) { state.lyaStage = st; save(); setTimeout(function () { toast("🎉 Ni har flyttat till " + LYA_STAGES[st].name + "! Nya saker finns i butiken."); }, 300); }
    _render11.apply(this, arguments);
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    "button[data-locked], .item button[disabled] { font-size: .78rem; letter-spacing: .02em; }" +
    ".stagebar { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; margin: 8px 0; }" +
    ".stagebar b { font-family: var(--display); font-size: 1.15rem; color: var(--sun); }" +
    /* Tältet */
    ".st-talt .s-wall { bottom: 30%; background: linear-gradient(115deg, transparent 49.6%, rgba(0,0,0,.35) 50%, transparent 50.4%), linear-gradient(65deg, transparent 49.6%, rgba(0,0,0,.35) 50%, transparent 50.4%), repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 3px, transparent 3px 60px), radial-gradient(120% 90% at 50% 100%, #1d6b78, #0d3a47 60%, #061d26); }" +
    ".st-talt .s-wall::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 100%; background: linear-gradient(90deg, rgba(0,0,0,.45), transparent 18%, transparent 82%, rgba(0,0,0,.45)); }" +
    ".st-talt .s-window { left: 3%; top: 18%; width: 17%; height: 52%; border: 0; border-radius: 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); box-shadow: none; }" +
    ".st-talt .s-window::before, .st-talt .s-window::after { display: none; }" +
    ".st-talt .s-base { display: none; }" +
    ".st-talt .s-floor { height: 30%; background: radial-gradient(70% 90% at 50% 0%, rgba(255,209,102,.12), transparent 70%), repeating-linear-gradient(0deg, #2d4a2a 0 6px, #34552f 6px 12px); }" +
    ".st-talt .s-rug { background: radial-gradient(ellipse at center, #8c3a4f, #5b2234 70%); border-color: rgba(255,209,102,.55); box-shadow: 0 0 14px rgba(255,209,102,.25); }" +
    ".st-talt .s-light { background: radial-gradient(45% 40% at 50% 8%, rgba(255,209,102,.35), transparent 70%); }" +
    ".s-sleep { width: 30%; bottom: 3%; }" +
    /* Huset och slottet (tillfälligt utseende tills bilderna finns) */
    ".st-hus .s-wall { background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 64px), linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,0) 45%, rgba(0,0,0,.3)), var(--wall); }" +
    ".st-hus .s-window { width: 22%; height: 46%; }" +
    ".st-slott .s-wall { background: repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 3px, transparent 3px 36px), repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 3px, transparent 3px 72px), linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,.1)), #5d6470; }" +
    ".st-slott .s-window { border-radius: 50% 50% 0 0 / 30% 30% 0 0; border-color: #3b3f46; height: 48%; }" +
    ".st-slott .s-floor { background: repeating-linear-gradient(90deg, #4a4f57 0 12%, #3a3e45 12% 12.4%), #4a4f57; }" +
    ".st-slott .s-rug { left: 36%; right: 36%; height: 30%; bottom: 0; border-radius: 0; background: linear-gradient(#a3243b, #7a1529); border: 0; border-left: 4px solid #ffd166; border-right: 4px solid #ffd166; }" +
    /* Riktig bakgrundsbild */
    ".scene.has-bg { aspect-ratio: 16 / 9; background-size: cover; background-position: center; }" +
    ".scene.has-bg > .s-wall, .scene.has-bg > .s-window, .scene.has-bg > .s-base, .scene.has-bg > .s-floor, .scene.has-bg > .s-rug { display: none; }" +
    ".scene.st-talt.has-bg { background-image: url(lya-talt.webp); } .scene.st-rum.has-bg { background-image: url(lya-rum.webp); }" +
    ".scene.st-hus.has-bg { background-image: url(lya-hus.webp); } .scene.st-slott.has-bg { background-image: url(lya-slott.webp); }" +
    "</style>");
  render();
