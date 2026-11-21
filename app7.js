  /* ---------- Agentlyan: rum med riktig grafik ---------- */
  var WALL_SPOTS = [[37, 33], [55, 28], [73, 33], [89, 40]];
  var FLOOR_SPOTS = [[13, 93], [31, 99], [70, 99], [88, 93]];
  var STARS = [[12, 18], [30, 10], [55, 26], [22, 46], [70, 50], [40, 62], [82, 14], [60, 8]];

  function lyaScene(a, L) {
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
    FLOOR_SPOTS.forEach(function (p, i) {
      var it = L.floor[i] ? shopItem(L.floor[i]) : null, pos = 'style="left:' + p[0] + "%;top:" + p[1] + '%"';
      h += it ? '<button type="button" class="s-slot fs" ' + pos + ' data-a="unplace" data-kind="floor" data-i="' + i + '" aria-label="Ta bort ' + esc(it.name) + '"><span class="obj">' + it.em + '</span><span class="shadow"></span></button>'
        : '<div class="s-slot fs" ' + pos + ' aria-hidden="true"><span class="spot"></span></div>';
    });
    h += '<div class="s-me">' + face(a, 70) + "</div>";
    return h + "</div>";
  }

  var _viewLya7 = viewLya;
  viewLya = function () {
    var h = _viewLya7();
    if (!state.agents.length) return h;
    var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0] || state.agents[0], L = lya(a);
    var s = h.indexOf('<div class="room">'), e = h.indexOf('<p class="small muted">Tryck på en sak');
    if (s < 0 || e < 0) return h;
    return h.slice(0, s) + lyaScene(a, L) + h.slice(e);
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".scene { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border: 1px solid var(--sun); box-shadow: 0 0 24px rgba(63,230,255,.2); background: #000; }" +
    ".s-wall { position: absolute; left: 0; right: 0; top: 0; bottom: 34%; background: repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 44px), linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,0) 45%, rgba(0,0,0,.3)), var(--wall); }" +
    ".s-light { position: absolute; inset: 0; pointer-events: none; z-index: 3; background: radial-gradient(55% 45% at 55% 0%, rgba(255,236,190,.28), transparent 70%); }" +
    ".s-window { position: absolute; left: 4%; top: 12%; width: 19%; height: 40%; border: 6px solid #2a1d14; border-radius: 3px; background: linear-gradient(#060b26, #1b2a6e); overflow: hidden; box-shadow: inset 0 0 18px rgba(0,0,0,.6), 0 4px 10px rgba(0,0,0,.4); }" +
    ".s-window::before, .s-window::after { content: ''; position: absolute; background: #2a1d14; z-index: 1; }" +
    ".s-window::before { left: 50%; top: 0; bottom: 0; width: 5px; transform: translateX(-50%); }" +
    ".s-window::after { top: 50%; left: 0; right: 0; height: 5px; transform: translateY(-50%); }" +
    ".s-window i { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fff; box-shadow: 0 0 4px #fff; }" +
    ".s-moon { position: absolute; right: 12%; top: 10%; width: 26%; aspect-ratio: 1; border-radius: 50%; background: #fff3c4; box-shadow: 0 0 16px #fff3c4; }" +
    ".s-neon { position: absolute; left: 28%; right: 3%; top: 6%; text-align: center; font: 800 clamp(13px, 3.4vw, 30px) var(--display); color: #fff; letter-spacing: .1em; text-transform: uppercase; text-shadow: 0 0 4px #fff, 0 0 10px var(--coral), 0 0 22px var(--coral), 0 0 40px var(--coral); z-index: 2; }" +
    ".s-base { position: absolute; left: 0; right: 0; bottom: 33%; height: 2.5%; background: #1b1410; box-shadow: 0 -1px 0 rgba(255,255,255,.12); z-index: 1; }" +
    ".s-floor { position: absolute; left: 0; right: 0; bottom: 0; height: 33.5%; background: linear-gradient(180deg, rgba(0,0,0,.4), rgba(0,0,0,0) 55%), repeating-linear-gradient(90deg, #8e5d35 0 8.6%, #6e4524 8.6% 9%, #9a6a3f 9% 17.6%, #6e4524 17.6% 18%); }" +
    ".s-rug { position: absolute; left: 31%; right: 31%; bottom: 4%; height: 17%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(63,230,255,.35), #0f4552 55%, #0a3039); border: 3px solid rgba(63,230,255,.55); box-shadow: 0 0 18px rgba(63,230,255,.3); }" +
    ".s-slot { position: absolute; z-index: 2; width: max-content; background: none !important; border: 0 !important; padding: 0; min-height: 0; clip-path: none !important; box-shadow: none; filter: none; text-transform: none; letter-spacing: 0; }" +
    ".s-slot.ws { transform: translate(-50%, -50%); }" +
    ".s-slot.fs { transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; }" +
    ".s-slot .frame { width: clamp(40px, 11vw, 88px); aspect-ratio: 1; display: grid; place-items: center; background: radial-gradient(circle at 50% 40%, #16323a, #071419); border: 5px solid #c9a227; border-radius: 2px; box-shadow: 0 6px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.6); font-size: clamp(22px, 6.4vw, 52px); line-height: 1; }" +
    ".s-slot .frame.empty { border: 2px dashed rgba(255,255,255,.22); background: transparent; box-shadow: none; }" +
    ".s-slot .obj { font-size: clamp(30px, 9vw, 72px); line-height: 1; filter: drop-shadow(0 4px 3px rgba(0,0,0,.45)); position: relative; z-index: 1; }" +
    ".s-slot .shadow { width: 70%; height: 9px; margin-top: -6px; border-radius: 50%; background: radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%); }" +
    ".s-slot .spot { display: block; width: clamp(26px, 7vw, 52px); height: clamp(8px, 2vw, 14px); border-radius: 50%; border: 2px dashed rgba(255,255,255,.25); }" +
    "button.s-slot:hover .frame, button.s-slot:hover .obj { transform: scale(1.06); }" +
    "button.s-slot:focus-visible { outline: 3px solid var(--sun); outline-offset: 4px; }" +
    ".s-me { position: absolute; left: 50%; bottom: 9%; transform: translateX(-50%); z-index: 2; }" +
    ".s-me .face { width: clamp(40px, 9vw, 70px) !important; height: clamp(40px, 9vw, 70px) !important; font-size: clamp(18px, 5vw, 34px); box-shadow: 0 0 16px rgba(63,230,255,.6), 0 10px 14px rgba(0,0,0,.5); }" +
    ".shop .item .em { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; font-size: 2.4rem; background: radial-gradient(circle at 50% 35%, rgba(63,230,255,.25), rgba(3,20,26,.9) 70%); box-shadow: 0 0 0 2px rgba(63,230,255,.35), 0 8px 14px rgba(0,0,0,.4); }" +
    "</style>");
  render();
