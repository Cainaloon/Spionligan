  /* ---------- Riktiga bilder på sakerna i agentlyan (items.webp) ---------- */
  var SPR_W = 1200, SPR_H = 776;
  var SPR = { akvarium: [0, 0, 184, 240], labb: [188, 0, 260, 230], skrivbord: [452, 0, 360, 224], raket: [816, 0, 113, 200], skold: [933, 0, 172, 200],
    kula: [0, 244, 155, 200], stormkok: [159, 244, 111, 200], nalle: [274, 244, 161, 200], vaxt: [439, 244, 152, 200], kikare: [595, 244, 151, 200],
    sang: [750, 244, 360, 183], karta: [0, 448, 240, 182], pokal: [244, 448, 240, 177], dator: [488, 448, 220, 174], panel: [712, 448, 240, 147],
    sovsack: [0, 634, 360, 142], ufo: [364, 634, 200, 110] };
  // Bredd i rummet, i procent av rummets bredd
  var SPR_SIZE = { nalle: 9, stormkok: 8, vaxt: 8.5, kikare: 9, akvarium: 11, labb: 13, raket: 7, panel: 13, kula: 8.5, dator: 12,
    karta: 11, ufo: 12, pokal: 13, skold: 7.5 };
  var SPR_OK = false, sprImg = new Image();
  sprImg.onload = function () { SPR_OK = true; render(); };
  sprImg.src = "items.webp";

  function spr(id) { return '<i class="spr spr-' + id + '" aria-hidden="true"></i>'; }

  var _viewLya14 = viewLya;
  viewLya = function () {
    var h = _viewLya14(); if (!SPR_OK) return h;
    h = h.split(BED_SVG).join(spr("sang")).split(DESK_SVG).join(spr("skrivbord")).split(SLEEP_SVG).join(spr("sovsack"));
    Object.keys(SPR).forEach(function (id) {
      var it = shopItem(id); if (!it) return; var em = it.em;
      h = h.split('<span class="em">' + em + "</span>").join('<span class="em">' + spr(id) + "</span>");
      h = h.split('<span class="obj">' + em + "</span>").join('<span class="obj">' + spr(id) + "</span>");
      h = h.split('<span class="frame">' + em + "</span>").join('<span class="wobj">' + spr(id) + "</span>");
      h = h.replace(new RegExp('(data-kind="desk" data-i="\\d+" aria-label="Ta bort ' + it.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '">)' + em + "</button>", "g"), "$1" + spr(id) + "</button>");
    });
    return h;
  };

  var css = ".spr { display: block; background-image: url(items.webp); background-repeat: no-repeat; }" +
    ".scene { container-type: inline-size; }" +
    ".s-big .spr { width: 100%; }" +
    ".s-slot.fs .obj { filter: drop-shadow(0 6px 4px rgba(0,0,0,.45)); }" +
    ".s-slot .wobj { display: block; filter: drop-shadow(0 6px 6px rgba(0,0,0,.5)); }" +
    ".s-desk .on-desk { left: 8%; right: 8%; bottom: 86%; }" +
    ".on-desk .spr { width: 11cqw; } .on-desk button + button .spr, .on-desk button:has(+ button) .spr { width: 8cqw; }" +
    ".shop .item .em .spr { margin: auto; }";
  Object.keys(SPR).forEach(function (id) {
    var p = SPR[id], x = p[0], y = p[1], w = p[2], hh = p[3];
    var shopW = Math.round(w >= hh ? 60 : 60 * w / hh);
    css += ".spr-" + id + " { aspect-ratio: " + w + " / " + hh + "; background-size: " + (SPR_W / w * 100).toFixed(2) + "% " + (SPR_H / hh * 100).toFixed(2) + "%;" +
      " background-position: " + (x / (SPR_W - w) * 100).toFixed(3) + "% " + (y / (SPR_H - hh) * 100).toFixed(3) + "%; }" +
      ".shop .em .spr-" + id + " { width: " + shopW + "px; }";
    if (SPR_SIZE[id]) css += ".s-slot .spr-" + id + " { width: " + (SPR_SIZE[id] * 8) + "px; width: " + SPR_SIZE[id] + "cqw; }";
  });
  document.head.insertAdjacentHTML("beforeend", "<style>" + css + "</style>");
  render();
