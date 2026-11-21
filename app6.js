  /* ---------- Operation Budbäraren: delade ledtrådar ---------- */
  var SECRETS = [
    ["🥄", "Sked"], ["🧦", "Strumpa"], ["📚", "Bok"], ["🍎", "Äpple"], ["🪥", "Tandborste"], ["👟", "Sko"],
    ["🔑", "Nyckel"], ["🧸", "Gosedjur"], ["🥛", "Glas"], ["✏️", "Penna"], ["🧻", "Toapapper"], ["🪴", "Blomma"],
    ["⏰", "Klocka"], ["🧤", "Vante"], ["🍽️", "Tallrik"], ["🧴", "Tvål"], ["📺", "Fjärrkontroll"], ["🛋️", "Kudde"],
    ["🧢", "Mössa"], ["🍌", "Banan"], ["🧽", "Disksvamp"], ["🎒", "Ryggsäck"]
  ];
  var SECRET_M = { id: "budbarare", type: "secret", title: "Operation Budbäraren", badge: "📡", color: "#0e7490",
    brief: "Agenter! En agent får se en hemlig sak på skärmen, och den andra måste hitta den. Men ni får inte säga vad saken heter! Beskriv färg, storlek och var den brukar finnas. Ni byter roller varje runda.",
    field: "Lägg paddan i Högkvarteret. Ställ alla saker ni hittade på bordet. Hämta sedan Chefen och berätta hur ni beskrev dem.",
    check: "Fråga agenterna hur de beskrev sakerna. Vilken beskrivning var bäst?" };
  MISSIONS.push(SECRET_M);

  function genRounds() {
    var t = team(), pool = SECRETS.map(function (x, i) { return i; }), out = [];
    for (var r = 0; r < 4; r++) {
      var j = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      var desc = t.length > 1 ? t[(r + 1) % t.length] : null, find = t.length ? t[r % t.length] : null;
      if (t.length > 1 && desc === find) desc = t[(r + 2) % t.length];
      out.push({ t: j, desc: desc ? desc.id : null, find: find ? find.id : null, shown: false, peek: false, done: false });
    }
    return out;
  }
  function agentById(id) { return state.agents.filter(function (a) { return a.id === id; })[0] || null; }
  function who2(id) { var a = agentById(id); return a ? agentLabel(a) : "Chefen"; }

  var _initData6 = initData;
  initData = function (mid) {
    if (mid === "budbarare") return { media: {}, found: {}, rounds: genRounds(), cur: 0 };
    return _initData6(mid);
  };
  var _canContinue6 = canContinue;
  canContinue = function (mid) {
    if (mid === "budbarare") { var d = sess(mid).data; return d.cur >= d.rounds.length; }
    return _canContinue6(mid);
  };
  var _tasks6 = tasks;
  tasks = function (m, s) {
    if (m.id !== "budbarare") return _tasks6(m, s);
    var d = s.data, h = "";
    if (state.agents.length < 2) h += '<p class="owlsays">🦉 Ni är bara en agent, så Chefen får vara den som beskriver.</p>';
    h += '<div class="slots">' + d.rounds.map(function (r, i) {
      var sec = SECRETS[r.t], da = agentById(r.desc), fa = agentById(r.find);
      if (i < d.cur) return '<div class="slot ok"><div class="slot-head">Runda ' + (i + 1) + ' ✓</div><p>' + sec[0] + " " + esc(sec[1]) + "</p><p class=\"small muted\">" + esc(who2(r.desc)) + " beskrev, " + esc(who2(r.find)) + " hittade.</p></div>";
      if (i > d.cur) return '<div class="slot skipped"><div class="slot-head">Runda ' + (i + 1) + '</div><p class="small muted">Kommer snart…</p></div>';
      return "";
    }).join("") + "</div>";
    if (d.cur >= d.rounds.length) return h + '<section class="panel today"><h2>Alla rundor klara!</h2><p>Bra samarbete, agenter. Gå vidare till fältuppdraget.</p></section>';
    var r = d.rounds[d.cur], sec = SECRETS[r.t], da = agentById(r.desc), fa = agentById(r.find), key = "budbarare:r" + d.cur;
    h += '<section class="panel"><h2>Runda ' + (d.cur + 1) + " av " + d.rounds.length + "</h2>" +
      '<div class="row">' + (da ? tag(da).replace("s tur", " beskriver") : '<span class="tag" style="background:#ffd166">Chefen beskriver</span>') +
      (fa ? tag(fa).replace("s tur", " letar") : "") + "</div>";
    if (!r.shown) {
      if (r.peek) {
        h += '<div class="secret"><div class="em">' + sec[0] + '</div><div class="word">' + esc(sec[1]) + "</div></div>" +
          "<p><b>Säg inte ordet!</b> Berätta färg, storlek, vad man gör med den och var den brukar finnas.</p>" +
          '<button type="button" class="primary" data-a="sechide">Jag har sett den – göm hemligheten</button>';
      } else {
        h += '<p class="owlsays">🙈 ' + esc(who2(r.find)) + ": blunda eller vänd dig bort!</p>" +
          '<button type="button" class="primary" data-a="secpeek">' + esc(who2(r.desc)) + ": visa hemligheten</button>";
      }
    } else {
      h += "<p><b>" + esc(who2(r.desc)) + "</b> beskriver. <b>" + esc(who2(r.find)) + "</b> lyssnar, frågar och letar. Fota saken när du hittat den!</p>" +
        photoSlot(s, key, { label: "Foto på saken" }) +
        '<div class="row"><button type="button" class="primary" data-a="secnext">Rätt sak hittad! Nästa runda</button>' +
        '<button type="button" class="ghost" data-a="secswap">För svår? Byt hemlighet</button></div>';
    }
    return h + "</section>";
  };
  var _report6 = report;
  report = function (m, s) {
    if (m.id !== "budbarare") return _report6(m, s);
    var h = _report6({ id: "__none", check: m.check }, s), d = s.data;
    var list = '<div class="slots">' + d.rounds.map(function (r, i) {
      var sec = SECRETS[r.t], u = urls["budbarare:r" + i];
      return '<div class="slot"><div class="slot-head">' + sec[0] + " " + esc(sec[1]) + "</div>" + (u ? '<div class="preview"><img src="' + u + '" alt=""></div>' : "") +
        '<p class="small muted">' + esc(who2(r.desc)) + " beskrev, " + esc(who2(r.find)) + " hittade.</p></div>";
    }).join("") + "</div>";
    var cut = h.indexOf("</section>") + "</section>".length;
    return h.slice(0, cut) + list + h.slice(cut);
  };

  /* ---------- Hjälparstjärnor ---------- */
  function helpPanel(s) {
    var hs = s.data.helpers || {};
    return '<section class="panel"><h3>⭐ Hjälparstjärnor</h3><p>Kapten Uggla undrar: <b>Vem hjälpte någon annan i dag, och hur?</b> Låt agenterna berätta för varandra. Den som hjälpt till får en hjälparstjärna och 3 mynt.</p><div class="row">' +
      state.agents.map(function (a) { return '<button type="button" class="' + (hs[a.id] ? "sel" : "") + '" data-a="helpstar" data-aid="' + a.id + '">' + (hs[a.id] ? "⭐ " : "") + esc(agentLabel(a)) + " hjälpte till</button>"; }).join("") + "</div></section>";
  }
  var _report6b = report;
  report = function (m, s) {
    var h = _report6b(m, s);
    var i = h.indexOf('data-a="bonus"'); if (i < 0) return h + helpPanel(s);
    var j = h.lastIndexOf("<button", i);
    return h.slice(0, j) + helpPanel(s) + h.slice(j);
  };
  var _reward6 = reward;
  reward = function (m) {
    var h = _reward6(m), s = sess(m.id), hs = s.data.helpers || {};
    var names = state.agents.filter(function (a) { return hs[a.id]; }).map(agentLabel);
    if (!names.length) return h;
    var note = '<section class="panel"><p class="owlsays">⭐ Hjälparstjärna till ' + esc(names.join(" och ")) + "! +3 mynt var för att ni hjälpte varandra.</p></section>";
    var cut = h.indexOf("</section>") + "</section>".length;
    return h.slice(0, cut) + note + h.slice(cut);
  };
  var _padDone6 = padDone;
  padDone = function () {
    var mid = ui.mission, wasApprove = ui.padMode === "approve";
    _padDone6();
    if (!wasApprove || !mid) return;
    var s = state.sessions[mid];
    if (s && s.step === "reward" && s.data.helpers && !s.data.helpPaid) {
      if (!state.helpStars) state.helpStars = {};
      state.agents.forEach(function (a) { if (s.data.helpers[a.id]) { lya(a).coins += 3; state.helpStars[a.id] = (state.helpStars[a.id] || 0) + 1; } });
      s.data.helpPaid = true; save(); render();
    }
  };
  var _viewTrophy6 = viewTrophy;
  viewTrophy = function () {
    var h = _viewTrophy6();
    if (!state.agents.length) return h;
    var hs = state.helpStars || {};
    return h + '<section class="panel"><h2>Hjälparstjärnor</h2><div class="agents">' + state.agents.map(function (a) {
      var n = hs[a.id] || 0;
      return '<div class="agent">' + face(a, 56) + '<div class="code">' + esc(agentLabel(a)) + '</div><div class="stars">' + (n ? "⭐".repeat(Math.min(n, 10)) : "☆") + '</div><span class="small muted">' + n + (n === 1 ? " stjärna" : " stjärnor") + " för att ha hjälpt andra</span></div>";
    }).join("") + "</div></section>";
  };

  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".secret { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px; border: 2px dashed var(--gold); background: rgba(255,209,102,.08); }" +
    ".secret .em { font-size: 6rem; line-height: 1; }" +
    ".secret .word { font: 800 2.4rem var(--display); text-transform: uppercase; letter-spacing: .08em; color: var(--gold); }" +
    "</style>");

  Object.assign(actions, {
    secpeek: function () { var d = sess(ui.mission).data; d.rounds[d.cur].peek = true; save(); render(); },
    sechide: function () { var d = sess(ui.mission).data, r = d.rounds[d.cur]; r.peek = false; r.shown = true; save(); render(); window.scrollTo(0, 0); },
    secnext: function () {
      var d = sess(ui.mission).data; d.rounds[d.cur].done = true; d.cur++; save(); render();
      var b = document.getElementById("continue"); if (b) b.disabled = !canContinue(ui.mission);
      toast(d.cur >= d.rounds.length ? "📡 Alla rundor klara!" : "📡 Bra! Nu byter ni roller.");
    },
    secswap: function () {
      var d = sess(ui.mission).data, used = d.rounds.map(function (r) { return r.t; }), free = SECRETS.map(function (x, i) { return i; }).filter(function (i) { return used.indexOf(i) < 0; });
      var r = d.rounds[d.cur]; r.t = free[Math.floor(Math.random() * free.length)]; r.shown = false; r.peek = false; save(); render();
    },
    helpstar: function (el) { var d = sess(ui.mission).data; if (!d.helpers) d.helpers = {}; d.helpers[el.dataset.aid] = !d.helpers[el.dataset.aid]; save(); render(); }
  });
  render();
