  /* ---------- Fler uppdrag (samarbete) ---------- */
  var MORE_HUNTS = {
    kojan: { title: "Operation Kojan", badge: "🏕️", color: "#7c2d12",
      brief: "Agenter! Spionligan behöver ett hemligt högkvarter. Samla byggmaterial tillsammans och bygg en koja. Ingen kan bygga den ensam!",
      field: "Lägg paddan i Högkvarteret. Bygg kojan tillsammans: en håller, en bygger, och sedan byter ni. Sätt upp skylten och bjud in Chefen.",
      check: "Krypa in i kojan! Hjälptes agenterna åt att bygga den?",
      items: [
        { k: "filt", label: "Taket", young: "Hitta en stor filt.", hard: "Hitta en filt som räcker till ett helt tak." },
        { k: "kudde", label: "Väggarna", young: "Hitta två kuddar.", hard: "Hitta fyra kuddar som inte kommer från din säng." },
        { k: "lampa", label: "Ljuset", young: "Hitta en ficklampa.", hard: "Hitta en lampa som fungerar utan sladd." },
        { k: "skylt", label: "Skylten", young: "Hitta papper och en penna.", hard: "Hitta papper, penna och tejp till en skylt." },
        { k: "fika", label: "Fikat", young: "Hitta en frukt.", hard: "Hitta en frukt som går att dela lika mellan alla agenter." }] },
    tvilling: { title: "Operation Tvillingar", badge: "🧦", color: "#4d7c0f",
      brief: "Agenter! Allt i huset har tappat sin tvilling. Hitta saker som hör ihop två och två, och hjälp varandra att leta!",
      field: "Lägg paddan i Högkvarteret. Lägg alla tvillingar på rad på golvet, två och två. Hämta sedan Chefen.",
      check: "Ligger alla tvillingar i par på golvet?",
      items: [
        { k: "strumpa", label: "Strumpor", young: "Hitta två strumpor som hör ihop.", hard: "Hitta två strumpor som hör ihop och som inte är dina." },
        { k: "skor", label: "Skor", young: "Hitta ett par skor.", hard: "Hitta det minsta paret skor i huset." },
        { k: "storliten", label: "Stor och liten", young: "Hitta en stor och en liten sked.", hard: "Hitta en stor och en liten av samma sak, men inte skedar." },
        { k: "farg", label: "Samma färg", young: "Hitta två saker med samma färg.", hard: "Hitta två saker med samma färg i olika rum." },
        { k: "par", label: "Alltid i par", young: "Hitta två vantar som hör ihop.", hard: "Hitta något annat som alltid kommer i par." }] },
    bokstav: { title: "Operation Bokstavsjakt", badge: "🔤", color: "#1d4ed8", quiz: true,
      brief: "Agenter! En kodknäckare har gömt bokstäver i huset. Hitta saker som börjar på rätt bokstav. Viska till varandra om ni behöver hjälp!",
      field: "Lägg paddan i Högkvarteret. Säg sakerna högt för Chefen, men säg inte bokstaven. Kan Chefen gissa vilka bokstäverna var?",
      check: "Titta på bilderna en i taget. Vilken bokstav börjar saken på? Tryck på Visa svaret.",
      items: ["B", "S", "K", "M", "T"].map(function (L) { return { k: "b" + L, label: "Bokstaven " + L, young: "Hitta något som börjar på " + L + ".", hard: "Hitta något som börjar på " + L + " och som har minst två stavelser." }; }) },
    natur: { title: "Operation Naturspanarna", badge: "🍂", color: "#166534",
      brief: "Agenter! Uppdraget är ute i naturen. Gå ut tillsammans och leta. Ingen agent går iväg ensam!",
      field: "Gör en naturtavla av det ni hittat, på marken eller på bordet. Hämta sedan Chefen.",
      check: "Titta på naturtavlan. Vad tyckte agenterna var roligast att hitta?",
      items: [
        { k: "lov", label: "Löv", young: "Hitta ett löv.", hard: "Hitta tre olika sorters löv." },
        { k: "sten", label: "Sten", young: "Hitta en sten.", hard: "Hitta en sten som är helt platt." },
        { k: "pinne", label: "Pinne", young: "Hitta en pinne.", hard: "Hitta en pinne som ser ut som ett Y." },
        { k: "spar", label: "Djurspår", young: "Hitta spår av ett djur.", hard: "Hitta två olika spår av djur, till exempel fotspår eller ett hål." },
        { k: "moln", label: "Himlen", young: "Fota himlen.", hard: "Fota ett moln som liknar ett djur." }] },
    present: { title: "Operation Hemlig present", badge: "🎁", color: "#9d174d",
      brief: "Agenter! Chefen har jobbat hårt. Gör en hemlig present tillsammans, utan att Chefen märker något!",
      field: "Lägg paddan i Högkvarteret. Gör presenten tillsammans, till exempel ett kort där alla agenter ritar. Göm den och ge Chefen en ledtråd!",
      check: "Leta upp presenten! Gjorde agenterna den tillsammans?",
      items: [
        { k: "papper", label: "Material", young: "Hitta papper och pennor.", hard: "Hitta papper, pennor och tejp." },
        { k: "glitter", label: "Dekoration", young: "Hitta något som glittrar.", hard: "Hitta något fint att dekorera presenten med." },
        { k: "lada", label: "Förpackning", young: "Hitta en påse.", hard: "Hitta en låda som presenten får plats i." },
        { k: "favorit", label: "Chefens favorit", young: "Hitta något i Chefens favoritfärg.", hard: "Hitta något som Chefen tycker mycket om." },
        { k: "gomstalle", label: "Gömställe", young: "Hitta ett bra gömställe.", hard: "Hitta ett gömställe där Chefen nästan aldrig tittar." }] }
  };
  Object.keys(MORE_HUNTS).forEach(function (id) { var x = MORE_HUNTS[id]; x.id = id; x.type = "hunt"; HUNTS[id] = x; MISSIONS.push(x); });

  /* ---------- Vardagsuppdrag ---------- */
  var CHORES = [
    { id: "tander", em: "🪥", name: "Borsta tänderna", coins: 1, max: 2, note: "Morgon och kväll" },
    { id: "har", em: "💇", name: "Borsta håret", coins: 1, max: 1 },
    { id: "sang", em: "🛏️", name: "Bädda sängen", coins: 1, max: 1 },
    { id: "klader", em: "👕", name: "Klä på dig själv", coins: 1, max: 1 },
    { id: "jacka", em: "🧥", name: "Häng upp jackan", coins: 1, max: 1 },
    { id: "duka", em: "🍽️", name: "Duka bordet", coins: 2, max: 1 },
    { id: "rum", em: "🧹", name: "Städa rummet", coins: 3, max: 1 }
  ];
  var CHORE_ACH = [
    { id: "forsta", em: "🌟", name: "Första sysslan", goal: "Klara en syssla", test: function (s) { return s.total >= 1; } },
    { id: "morgon", em: "🌅", name: "Morgonhjälte", goal: "Tänder, hår, säng och kläder samma dag", test: function (s) { return s.morning; } },
    { id: "har5", em: "💇", name: "Hårstylist", goal: "Borsta håret 5 dagar i rad", test: function (s) { return (s.best.har || 0) >= 5; } },
    { id: "tander7", em: "🦷", name: "Blänkande tänder", goal: "Borsta tänderna 7 dagar i rad", test: function (s) { return (s.best.tander || 0) >= 7; } },
    { id: "vecka", em: "🔥", name: "Veckoagent", goal: "Minst en syssla 7 dagar i rad", test: function (s) { return s.bestAny >= 7; } },
    { id: "lag5", em: "🤝", name: "Lagspelare", goal: "Få lagbonus 5 gånger", test: function (s) { return s.team >= 5; } },
    { id: "rum10", em: "🧹", name: "Städproffs", goal: "Städa rummet 10 gånger", test: function (s) { return (s.count.rum || 0) >= 10; } },
    { id: "manad", em: "🏅", name: "Månadsagent", goal: "Minst en syssla 30 dagar i rad", test: function (s) { return s.bestAny >= 30; } },
    { id: "hundra", em: "💯", name: "Hundra sysslor", goal: "Klara 100 sysslor", test: function (s) { return s.total >= 100; } }
  ];
  function chore(id) { return CHORES.filter(function (c) { return c.id === id; })[0]; }
  function CH() { if (!state.chores) state.chores = { days: {}, ach: {}, team: {}, teamDays: {} }; return state.chores; }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function dayNum(k) { var p = k.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function choreRec(aid, id, create) {
    var c = CH(), t = dayKey();
    if (!create) return ((c.days[t] || {})[aid] || {})[id] || { done: 0, ok: 0 };
    if (!c.days[t]) c.days[t] = {};
    if (!c.days[t][aid]) c.days[t][aid] = {};
    if (!c.days[t][aid][id]) c.days[t][aid][id] = { done: 0, ok: 0 };
    return c.days[t][aid][id];
  }
  function runs(nums, today) {
    // nums: sorterade dagnummer med minst en godkänd syssla
    var best = 0, run = 0, prev = null;
    nums.forEach(function (n) { run = prev !== null && n === prev + 1 ? run + 1 : 1; prev = n; if (run > best) best = run; });
    var cur = 0;
    if (nums.length) {
      var last = nums[nums.length - 1];
      if (last === today || last === today - 1) { cur = 1; for (var i = nums.length - 2; i >= 0 && nums[i] === nums[i + 1] - 1; i--) cur++; }
    }
    return { best: best, cur: cur };
  }
  function choreStats(aid) {
    var c = CH(), keys = Object.keys(c.days).sort(), today = dayNum(dayKey());
    var s = { total: 0, count: {}, best: {}, cur: {}, bestAny: 0, curAny: 0, morning: false, team: c.team[aid] || 0 };
    var per = {}, any = [];
    keys.forEach(function (k) {
      var e = (c.days[k] || {})[aid]; if (!e) return;
      var n = dayNum(k), hasAny = false;
      Object.keys(e).forEach(function (id) {
        var ok = e[id].ok || 0; if (!ok) return;
        s.total += ok; s.count[id] = (s.count[id] || 0) + ok; hasAny = true;
        (per[id] = per[id] || []).push(n);
      });
      if (hasAny) any.push(n);
      if (["tander", "har", "sang", "klader"].every(function (id) { return e[id] && e[id].ok > 0; })) s.morning = true;
    });
    Object.keys(per).forEach(function (id) { var r = runs(per[id], today); s.best[id] = r.best; s.cur[id] = r.cur; });
    var ra = runs(any, today); s.bestAny = ra.best; s.curAny = ra.cur;
    return s;
  }
  function pendingChores() {
    var day = CH().days[dayKey()] || {}, n = 0;
    Object.keys(day).forEach(function (aid) { Object.keys(day[aid]).forEach(function (id) { n += Math.max(0, day[aid][id].done - day[aid][id].ok); }); });
    return n;
  }
  function approveChores() {
    var c = CH(), t = dayKey(), day = c.days[t] || {}, gained = {}, teamN = 0, newAch = [];
    state.agents.forEach(function (a) {
      var e = day[a.id] || {};
      Object.keys(e).forEach(function (id) {
        var r = e[id], ch = chore(id), diff = r.done - r.ok;
        if (ch && diff > 0) { lya(a).coins += diff * ch.coins; gained[a.id] = (gained[a.id] || 0) + diff * ch.coins; r.ok = r.done; }
      });
    });
    if (state.agents.length > 1) {
      CHORES.forEach(function (ch) {
        var key = t + ":" + ch.id;
        var all = state.agents.every(function (a) { return day[a.id] && day[a.id][ch.id] && day[a.id][ch.id].ok > 0; });
        if (all && !c.teamDays[key]) {
          c.teamDays[key] = true; teamN++;
          state.agents.forEach(function (a) { lya(a).coins += 1; gained[a.id] = (gained[a.id] || 0) + 1; c.team[a.id] = (c.team[a.id] || 0) + 1; });
        }
      });
    }
    state.agents.forEach(function (a) {
      var st = choreStats(a.id); if (!c.ach[a.id]) c.ach[a.id] = {};
      CHORE_ACH.forEach(function (x) { if (!c.ach[a.id][x.id] && x.test(st)) { c.ach[a.id][x.id] = new Date().toISOString(); newAch.push({ a: a, x: x }); } });
    });
    ui.choreResult = { gained: gained, teamN: teamN, newAch: newAch };
    save();
  }
  function achShelf(a) {
    var got = (CH().ach[a.id] || {});
    return '<div class="shelf">' + CHORE_ACH.map(function (x) {
      var d = got[x.id];
      return '<div class="trophy' + (d ? "" : " locked") + '"><div class="badge-sm" style="background:#0f4552">' + (d ? x.em : "?") + "</div><b>" + esc(x.name) + '</b><span class="small muted">' + (d ? new Date(d).toLocaleDateString("sv-SE") : esc(x.goal)) + "</span></div>";
    }).join("") + "</div>";
  }
  function viewChores() {
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Vardagsuppdrag</h1>';
    if (!state.agents.length) return h + chefSays("Registrera er som agenter först, så får ni vardagsuppdrag!", null);
    h += chefSays("Små uppdrag varje dag! Tryck när du har gjort något. När Chefen godkänner får du agentmynt. Gör alla agenter samma syssla samma dag blir det lagbonus!", "chores");
    var R = ui.choreResult;
    if (R) {
      h += '<section class="panel today"><h2>Godkänt!</h2>' + state.agents.map(function (a) { return R.gained[a.id] ? '<p><span class="coins">🪙 +' + R.gained[a.id] + "</span> " + esc(agentLabel(a)) + "</p>" : ""; }).join("") +
        (R.teamN ? '<p class="owlsays">🤝 Lagbonus! Ni gjorde ' + R.teamN + (R.teamN === 1 ? " syssla" : " sysslor") + " tillsammans och fick 1 extra mynt var för varje.</p>" : "") +
        R.newAch.map(function (n) { return '<p class="owlsays">🏆 Ny utmärkelse: ' + esc(agentLabel(n.a)) + " fick " + n.x.em + " " + esc(n.x.name) + "!</p>"; }).join("") + "</section>";
    }
    state.agents.forEach(function (a) {
      var st = choreStats(a.id);
      h += '<section class="panel"><div class="row">' + face(a, 64) + "<div><h2>" + esc(agentLabel(a)) + '</h2><div class="row"><span class="coins">🪙 ' + lya(a).coins + "</span>" +
        (st.curAny ? '<span class="pill go">🔥 ' + st.curAny + (st.curAny === 1 ? " dag" : " dagar") + " i rad</span>" : "") + "</div></div></div>";
      h += '<div class="chores">' + CHORES.map(function (ch) {
        var r = choreRec(a.id, ch.id), pend = r.done > r.ok, full = r.done >= ch.max, cur = st.cur[ch.id] || 0;
        return '<div class="chore' + (full && !pend ? " ok" : pend ? " pend" : "") + '"><button type="button" data-a="choretap" data-aid="' + a.id + '" data-c="' + ch.id + '"' + (full ? " disabled" : "") + ">" +
          '<span class="em">' + ch.em + "</span><span>" + esc(ch.name) + (ch.max > 1 ? " " + r.done + "/" + ch.max : "") + "</span></button>" +
          '<div class="small muted">' + (ch.note ? esc(ch.note) + " · " : "") + "🪙 " + ch.coins + (cur ? " · 🔥 " + cur : "") + (pend ? " · Väntar på Chefen" : full ? " · Klart!" : "") + "</div>" +
          (pend ? '<button type="button" class="link" data-a="choreundo" data-aid="' + a.id + '" data-c="' + ch.id + '">Ångra</button>' : "") + "</div>";
      }).join("") + "</div>";
      h += "<h3>Utmärkelser</h3>" + achShelf(a) + "</section>";
    });
    var p = pendingChores();
    if (p) {
      if (ui.choresPad) h += keypad("Chefskod", "Godkänn " + p + (p === 1 ? " syssla" : " sysslor") + " från i dag.") + '<button type="button" class="link" data-a="chorecancel">Avbryt</button>';
      else h += '<button type="button" class="primary" data-a="choreapprove">Chefen: godkänn ' + p + (p === 1 ? " syssla" : " sysslor") + "</button>";
    }
    h += '<p class="small muted">Sysslorna godkänns samma dag. En streak räknas när minst en syssla är godkänd varje dag.</p>';
    return h;
  }

  /* ---------- Kopplingar till resten av appen ---------- */
  document.head.insertAdjacentHTML("beforeend", "<style>" +
    ".chores { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }" +
    ".chore { display: flex; flex-direction: column; gap: 6px; }" +
    ".chore > button { flex-direction: column; min-height: 104px; width: 100%; text-transform: none; letter-spacing: 0; font-size: 1rem; }" +
    ".chore > button .em { font-size: 2.2rem; line-height: 1; }" +
    ".chore.pend > button { background: rgba(255,209,102,.18); border-color: var(--gold); }" +
    ".chore.ok > button { background: rgba(125,255,178,.18); border-color: var(--mint); opacity: 1; }" +
    "</style>");

  var _render = render;
  render = function () {
    if (ui.view === "chores") { document.getElementById("app").innerHTML = viewChores(); return; }
    _render();
  };
  var _viewHome = viewHome;
  viewHome = function () {
    var h = _viewHome();
    if (!state.agents.length) return h;
    var p = pendingChores(), done = 0, day = CH().days[dayKey()] || {};
    Object.keys(day).forEach(function (aid) { Object.keys(day[aid]).forEach(function (id) { done += day[aid][id].ok; }); });
    var box = '<section class="panel"><div class="row between"><div><h2>Vardagsuppdrag</h2><p class="small muted">' + done + " godkända i dag" + (p ? " · " + p + " väntar på Chefen" : "") + '</p></div><button type="button" class="primary" data-a="chores">🪥 Dagens sysslor</button></div></section>';
    var mark = '<section class="stack"><h2>Uppdrag</h2>';
    return h.indexOf(mark) >= 0 ? h.replace(mark, box + mark) : h + box;
  };
  var _viewTrophy = viewTrophy;
  viewTrophy = function () {
    var h = _viewTrophy();
    if (!state.agents.length) return h;
    return h + '<section class="stack"><h2>Vardagsmärken</h2>' + state.agents.map(function (a) {
      return '<section class="panel"><div class="row">' + face(a, 56) + "<h3>" + esc(agentLabel(a)) + "</h3></div>" + achShelf(a) + "</section>";
    }).join("") + "</section>";
  };
  var _padDone = padDone;
  padDone = function () {
    if (ui.padMode !== "chores") return _padDone();
    var p = ui.pad; ui.pad = "";
    if (p === state.chef) { approveChores(); ui.choresPad = false; ui.padMode = null; window.scrollTo(0, 0); }
    else ui.msg = "Fel kod. Bara Chefen kan godkänna.";
    render();
  };
  Object.assign(actions, {
    chores: function () { ui.choreResult = null; ui.choresPad = false; goto("chores"); },
    choretap: function (el) {
      var ch = chore(el.dataset.c), r = choreRec(el.dataset.aid, el.dataset.c, true);
      if (!ch || r.done >= ch.max) return;
      r.done++; ui.choreResult = null; save(); render(); toast(ch.em + " Bra jobbat! Chefen godkänner sen.");
    },
    choreundo: function (el) { var r = choreRec(el.dataset.aid, el.dataset.c, true); if (r.done > r.ok) r.done--; save(); render(); },
    choreapprove: function () { ui.choresPad = true; ui.padMode = "chores"; ui.pad = ""; ui.msg = ""; render(); },
    chorecancel: function () { ui.choresPad = false; ui.padMode = null; ui.pad = ""; ui.msg = ""; render(); }
  });
  render();
