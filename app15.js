  /* ---------- Buggfixar från genomspelningen 2026-11-21 ---------- */

  // 1. Två agenter får inte ha samma agentnamn (annars blir det "Agent Blixt" och "Agent Blixt" överallt)
  function codeKey(s) { return String(s || "").trim().toLowerCase(); }
  function dupCodenames(agents) {
    var seen = {}, dup = false;
    agents.forEach(function (a) { var k = codeKey(a.codename); if (!k) return; if (seen[k]) dup = true; seen[k] = true; });
    return dup;
  }
  var _canContinue15 = canContinue;
  canContinue = function (mid) {
    if (mid === "reg" && dupCodenames(sess("reg").data.agents)) return false;
    return _canContinue15(mid);
  };
  var _tasks15 = tasks;
  tasks = function (m, s) {
    var h = _tasks15(m, s);
    if (m.id !== "reg") return h;
    var ag = s.data.agents;
    ag.forEach(function (a, i) {
      ag.forEach(function (b, j) {
        if (i === j || !codeKey(b.codename)) return;
        CODENAMES.forEach(function (c) {
          if (codeKey(c) !== codeKey(b.codename)) return;
          h = h.split('data-f="agents.' + i + '.codename" data-v="' + c + '" class="').join('data-f="agents.' + i + '.codename" data-v="' + c + '" disabled title="Upptaget" class="taken ');
        });
      });
    });
    h += '<p class="small dupwarn" id="dupwarn"' + (dupCodenames(ag) ? "" : " hidden") + '>⚠️ Två agenter kan inte ha samma agentnamn. Välj ett annat namn till en av er.</p>';
    return h;
  };
  document.addEventListener("input", function (e) {
    var el = e.target; if (!el.dataset || !el.dataset.f || ui.mission !== "reg") return;
    var w = document.getElementById("dupwarn"); if (w) w.hidden = !dupCodenames(sess("reg").data.agents);
  });

  // 2. Rätt svenska i agentalbumet
  var _viewAlbum15 = viewAlbum;
  viewAlbum = function () {
    return _viewAlbum15().split("Här är alla era agentbilder. 1 stycken! Vilken är er favorit?").join("Här är er första agentbild! Fler kommer när ni gör uppdrag.");
  };

  // 3. Mobil: långa rubriker och Högkvarteret-rutan får inte gå utanför skärmen
  document.head.insertAdjacentHTML("beforeend", "<style>" +
    "h1 { font-size: clamp(1.45rem, 7vw, 2.3rem); overflow-wrap: anywhere; hyphens: auto; }" +
    ".hq .lbl { display: inline-block; max-width: 100%; font-size: clamp(1.05rem, 5.6vw, 2.2rem); letter-spacing: .06em; padding: 6px 14px; overflow-wrap: anywhere; }" +
    ".dupwarn { color: var(--coral); font-weight: 700; margin-top: 8px; }" +
    "button.taken { opacity: .35; text-decoration: line-through; }" +
    "</style>");
  render();
