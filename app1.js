
  /* ---------- Innehåll ---------- */
  var MISSIONS = [
    { id: "reg", title: "Agentregistrering", badge: "🪪", color: "#3a6fd8",
      brief: "Välkomna till Spionligan! Jag är Kapten Uggla. Innan ni får ert första uppdrag måste ni registreras som agenter. Varje agent behöver en agentselfie, ett agentnamn och en superkraft.",
      field: "Bra jobbat, agenter! Lägg nu paddan i Högkvarteret. Rita ert agentkort på ett papper: en teckning av dig själv, ditt agentnamn, din ålder, din superkraft och fyra tomma rutor för stämplar. Hämta Chefen när korten är klara.",
      check: "Titta på agentkorten som barnen har ritat. Har varje kort agentnamn, ålder, superkraft och rutor för stämplar?" },
    { id: "regnbage", title: "Operation Regnbåge", badge: "🌈", color: "#c2410c",
      brief: "Agenter! En busig trollkarl har stulit alla färger i huset. Ni måste hitta och fotografera en sak i varje färg innan han kommer tillbaka.",
      field: "Färgerna är räddade! Lägg paddan i Högkvarteret. Hämta de riktiga sakerna ni fotade och lägg dem på rad i regnbågens ordning på köksbordet. Hämta sedan Chefen.",
      check: "Ligger sakerna på rad på bordet? Stämmer de med bilderna?" },
    { id: "kassaskap", title: "Operation Kassaskåp", badge: "🔐", color: "#0f766e",
      brief: "Agenter! Chefen har låst in en hemlig belöning. Koden är gömd i tre ledtrådar. Lös ledtrådarna, så visar jag koden.",
      field: "Ni har knäckt koden! Lägg paddan i Högkvarteret. Skriv koden på ett papper och ge den till Chefen. Chefen bestämmer vad koden låser upp, till exempel kvällens saga eller efterrätten.",
      check: "Stämmer koden på papperet med koden här? Räkna gärna fönstren och stolarna själv. Låt sedan barnen välja belöningen." },
    { id: "ora", title: "Operation Öra", badge: "👂", color: "#7c3aed",
      brief: "Agenter! Vi behöver hemliga ljud till vårt ljudarkiv. Filma fem ljud i huset utan att Chefen ser vad det är. I kväll ska Chefen försöka gissa.",
      field: "Ljuden är inspelade! Lägg paddan i Högkvarteret fram till middagen. Säg ingenting till Chefen! Vid middagen hämtar ni paddan och Chefen får gissa.",
      check: "Tryck på Spela ljudet och försök gissa vad det är. Tryck sedan på Visa svaret." }
  ];
  var HUNTS = {
    formjakt: { title: "Operation Formjakt", badge: "🔷", color: "#0369a1",
      brief: "Agenter! Formtjuven har gömt sig bland sakerna i huset. Hitta en sak för varje form och fota den.",
      field: "Formerna är hittade! Lägg paddan i Högkvarteret. Bygg en robot eller ett djur av sakerna på golvet. Hämta sedan Chefen.",
      check: "Titta på figuren som agenterna har byggt. Vad föreställer den?",
      items: [
        { k: "rund", label: "Rund", young: "Hitta något runt.", hard: "Hitta något runt som kan rulla." },
        { k: "fyrkant", label: "Fyrkantig", young: "Hitta något fyrkantigt.", hard: "Hitta något fyrkantigt som man kan öppna." },
        { k: "trekant", label: "Trekantig", young: "Hitta något som har en trekant.", hard: "Hitta något trekantigt som inte är ritat." },
        { k: "lang", label: "Avlång", young: "Hitta något långt och smalt.", hard: "Hitta något avlångt som är längre än din arm." },
        { k: "hjarta", label: "Hjärta", young: "Hitta ett hjärta.", hard: "Hitta ett hjärta som inte är ritat på papper." }] },
    narbild: { title: "Operation Närbild", badge: "🔍", color: "#be185d", quiz: true,
      brief: "Agenter! Chefen tror att hen känner igen allt i huset. Bevisa motsatsen! Fota fem saker jättenära, så nära att det blir svårt att se vad det är.",
      field: "Lägg tillbaka sakerna och lägg paddan i Högkvarteret. Hämta sedan Chefen. Kan Chefen gissa vad det är?",
      check: "Titta på närbilderna en i taget och gissa vad det är. Tryck sedan på Visa svaret.",
      items: [1, 2, 3, 4, 5].map(function (i) { return { k: "n" + i, label: "Närbild " + i, young: "Fota något jättenära.", hard: "Fota något jättenära som Chefen nästan aldrig tittar på." }; }) },
    blixt: { title: "Operation Blixt", badge: "⚡", color: "#b45309", timed: 180,
      brief: "Agenter! Blixtlarm! Ni har bara några minuter på er att hitta fem saker. Dela upp jobbet och hjälp varandra!",
      field: "Puh, bra jobbat! Lägg paddan i Högkvarteret. Lägg sakerna på rad på bordet och hämta Chefen.",
      check: "Titta på sakerna på bordet. Hann agenterna innan tiden tog slut?",
      items: [
        { k: "mjuk", label: "Mjukt", young: "Hitta något mjukt.", hard: "Hitta något mjukt som inte är ett gosedjur." },
        { k: "kall", label: "Kallt", young: "Hitta något kallt.", hard: "Hitta något kallt som inte finns i kylskåpet." },
        { k: "siffra", label: "Siffror", young: "Hitta något med siffror på.", hard: "Hitta något med siffran 7 på." },
        { k: "ljud", label: "Låter", young: "Hitta något som låter.", hard: "Hitta något som låter utan batterier." },
        { k: "rund", label: "Runt", young: "Hitta något runt.", hard: "Hitta något runt som är mindre än din tumme." }] },
    julagent: { title: "Operation Julagent", badge: "🎄", color: "#15803d", season: [10, 11],
      brief: "Agenter! Tomtens verkstad behöver hjälp. Hitta fem julsaker i huset innan julafton!",
      field: "Lägg paddan i Högkvarteret. Ställ sakerna ni hittade i en liten julutställning i fönstret eller på bordet. Hämta sedan Chefen.",
      check: "Titta på julutställningen. Stämmer den med bilderna?",
      items: [
        { k: "glitter", label: "Glitter", young: "Hitta något som glittrar.", hard: "Hitta något som glittrar och inte är julpynt." },
        { k: "rodvit", label: "Rött och vitt", young: "Hitta något rött och vitt.", hard: "Hitta något rött och vitt som går att äta." },
        { k: "stjarna", label: "Stjärna", young: "Hitta en stjärna.", hard: "Hitta en stjärna som inte sitter i ett fönster." },
        { k: "doft", label: "Luktar jul", young: "Hitta något som luktar jul.", hard: "Hitta en krydda som luktar jul." },
        { k: "mjuk", label: "Mjukt och varmt", young: "Hitta något mjukt och varmt.", hard: "Hitta något mjukt och varmt som man har på sig." }] }
  };
  Object.keys(HUNTS).forEach(function (id) { var x = HUNTS[id]; x.id = id; x.type = "hunt"; MISSIONS.push(x); });
  function inSeason(m) { return !m.season || m.season.indexOf(new Date().getMonth()) >= 0 || !!state.done[m.id]; }
  function visibleMissions() { return MISSIONS.filter(inSeason); }
  var SIGNS = ["👊 Knytnävsbump", "🤫 Hemligt pssst", "🦉 Uggleljud", "🫡 Honnör", "🌀 Snurra ett varv", "🤝 Hemlig handskakning"];
  var LEVELS = [[0, "Rekryt"], [20, "Agent"], [50, "Specialagent"], [90, "Superagent"], [140, "Mästeragent"]];
  var NEUT = { rod: "rött", gul: "gult", gron: "grönt", bla: "blått", svart: "svart" };
  var OPS = ["regnbage", "kassaskap", "ora"];
  var SHOP = [
    { id: "sang", em: "🛏️", name: "Agentsäng", price: 10, kind: "floor" },
    { id: "vaxt", em: "🪴", name: "Hemlig växt", price: 10, kind: "floor" },
    { id: "nalle", em: "🧸", name: "Spionnalle", price: 10, kind: "floor" },
    { id: "karta", em: "🗺️", name: "Hemlig karta", price: 15, kind: "wall" },
    { id: "uggla", em: "🦉", name: "Uggleporträtt", price: 20, kind: "wall" },
    { id: "kikare", em: "🔭", name: "Kikare", price: 20, kind: "floor" },
    { id: "dator", em: "🖥️", name: "Spaningsdator", price: 25, kind: "floor" },
    { id: "akvarium", em: "🐠", name: "Akvarium", price: 25, kind: "floor" },
    { id: "labb", em: "🧪", name: "Agentlabb", price: 30, kind: "floor" },
    { id: "ufo", em: "🛸", name: "UFO-lampa", price: 30, kind: "wall" },
    { id: "raket", em: "🚀", name: "Raketmodell", price: 35, kind: "floor" },
    { id: "panel", em: "🕹️", name: "Kontrollpanel", price: 40, kind: "floor" },
    { id: "pokal", em: "🏆", name: "Pokalhylla", price: 50, kind: "wall" },
    { id: "keps", em: "🧢", name: "Agentkeps", price: 10, kind: "hat" },
    { id: "glas", em: "🕶️", name: "Spionglasögon", price: 15, kind: "eyes" },
    { id: "hatt", em: "🎩", name: "Detektivhatt", price: 20, kind: "hat" },
    { id: "mantel", em: "🦸", name: "Superagentmärke", price: 30, kind: "cape" },
    { id: "krona", em: "👑", name: "Mästarkrona", price: 60, kind: "hat" }
  ];
  var WALLS = ["#2b4c8c", "#5b3a8c", "#1f6b5c", "#8c3a4f", "#7a5a12"];
  var CAUSES = [
    { id: "sjuka", em: "🏥", name: "Barn som är sjuka" },
    { id: "skola", em: "🎒", name: "Barn som behöver skolsaker" },
    { id: "djur", em: "🐾", name: "Djur som behöver hjälp" }
  ];
  function shopItem(id) { return SHOP.filter(function (x) { return x.id === id; })[0]; }
  var COLORS = [
    { k: "rod", name: "Röd", hex: "#e63946" },
    { k: "gul", name: "Gul", hex: "#ffd23f" },
    { k: "gron", name: "Grön", hex: "#3bb273" },
    { k: "bla", name: "Blå", hex: "#3a86ff" },
    { k: "svart", name: "Svart", hex: "#111111" }
  ];
  var POWERS = ["Snabb", "Stark", "Smart", "Osynlig"];
  var CODENAMES = ["Blixt", "Tiger", "Skugga", "Raket", "Räv", "Stjärna", "Ninja", "Drake"];
  var STEPS = [["brief", "Uppdraget"], ["tasks", "Leta"], ["field", "Fält"], ["report", "Rapport"]];

  /* ---------- Lagring ---------- */
  var LS = "agentbyran-v1";
  function blank() { return { chef: null, agents: [], done: {}, sessions: {}, bonus: {}, pts: 0 }; }
  var state = blank();
  try { var raw = localStorage.getItem(LS); if (raw) state = Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
  if (state.pts == null || (!state.pts && Object.keys(state.done).length)) state.pts = Object.keys(state.done).length * 10;
  if (!state.bonus) state.bonus = {};
  if (!state.lya) state.lya = {};
  if (!state.chest) state.chest = { coins: 0, kr: 1, goal: 100, by: {}, votes: {}, log: [] };
  function chestCause() {
    var c = {}; Object.keys(state.chest.votes).forEach(function (aid) { var v = state.chest.votes[aid]; c[v] = (c[v] || 0) + 1; });
    var best = CAUSES[0], n = -1; CAUSES.forEach(function (x) { if ((c[x.id] || 0) > n) { n = c[x.id] || 0; best = x; } });
    return { cause: best, counts: c };
  }
  function chestFull() { return state.chest.coins >= state.chest.goal; }
  function lya(a) {
    var L = state.lya[a.id];
    if (!L) L = state.lya[a.id] = { coins: 0, owned: [], wall: [], floor: [], wear: null, color: WALLS[0] };
    return L;
  }
  state.agents.forEach(function (a) { if (!state.lya[a.id]) lya(a).coins = Object.keys(state.done).length * 10; });
  function save() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {} }

  var dbp = null;
  function idb() {
    if (dbp) return dbp;
    dbp = new Promise(function (res) {
      try {
        var r = indexedDB.open("agentbyran", 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("m"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
    return dbp;
  }
  function idbTx(mode, fn) {
    return idb().then(function (db) {
      if (!db) return null;
      return new Promise(function (res) {
        try {
          var tx = db.transaction("m", mode); var out = fn(tx.objectStore("m"));
          tx.oncomplete = function () { res(out && "result" in out ? out.result : null); };
          tx.onerror = tx.onabort = function () { res(null); };
        } catch (e) { res(null); }
      });
    });
  }
  function idbPut(k, v) { return idbTx("readwrite", function (s) { s.put(v, k); }); }
  function idbGet(k) { return idbTx("readonly", function (s) { return s.get(k); }); }
  function idbDelPrefix(p) {
    return idbTx("readwrite", function (s) {
      var r = s.openCursor();
      r.onsuccess = function () { var c = r.result; if (!c) return; if (String(c.key).indexOf(p) === 0) c.delete(); c.continue(); };
    });
  }
  function idbClear() { return idbTx("readwrite", function (s) { s.clear(); }); }

  var urls = {}, blobs = {}, tried = {};
  function getBlob(key) { return blobs[key] ? Promise.resolve(blobs[key]) : idbGet(key); }
  function putMedia(key, blob) {
    blobs[key] = blob;
    if (urls[key]) URL.revokeObjectURL(urls[key]);
    urls[key] = URL.createObjectURL(blob);
    return idbPut(key, blob);
  }
  function ensureMedia(keys) {
    var missing = keys.filter(function (k) { return !urls[k] && !tried[k]; });
    if (!missing.length) return;
    missing.forEach(function (k) { tried[k] = true; });
    Promise.all(missing.map(function (k) {
      return idbGet(k).then(function (b) { if (b) urls[k] = URL.createObjectURL(b); });
    })).then(render);
  }
  function dropMedia(prefix) {
    Object.keys(urls).forEach(function (k) { if (k.indexOf(prefix) === 0) { URL.revokeObjectURL(urls[k]); delete urls[k]; delete blobs[k]; delete tried[k]; } });
    return idbDelPrefix(prefix);
  }

  /* ---------- Röst och nedladdning ---------- */
  var tts = null, downloads = null, sampleFn = null, aiOK = false;
  var hasSynth = typeof window.speechSynthesis !== "undefined";
  try {
    if (window.claude && window.claude.use) {
      window.claude.use("tts").then(function (t) { tts = t; render(); }).catch(function () {});
      window.claude.use("downloads").then(function (d) { downloads = d; render(); }).catch(function () {});
      window.claude.use("sample").then(function (fn) {
        sampleFn = fn; if (!fn) return;
        fn.limits().then(function (l) { aiOK = !!(l && l.images); render(); }).catch(function () {});
      }).catch(function () {});
    }
  } catch (e) {}
  function canSpeak() { return !!tts || hasSynth; }
  function speak(text) {
    if (tts) { tts.speak(text, { language: "sv", rate: 0.95 }).catch(function () {}); return; }
    if (hasSynth) {
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text); u.lang = "sv-SE"; u.rate = 0.95;
        var v = speechSynthesis.getVoices().filter(function (x) { return /^sv/i.test(x.lang); })[0];
        if (v) u.voice = v;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  /* ---------- Hjälpare ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function mission(id) { return MISSIONS.filter(function (m) { return m.id === id; })[0]; }
  function agentLabel(a) { return "Agent " + (a.codename || "?"); }
  function toast(t) { var el = document.getElementById("toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 3200); }
  function newAgent() { return { id: "a" + Date.now().toString(36) + rand(100, 999), name: "", age: null, codename: "", power: null, selfie: null }; }
  function roles() {
    var ag = state.agents.slice().sort(function (a, b) { return (a.age || 0) - (b.age || 0); });
    var young = ag.filter(function (a) { return a.age <= 6; });
    var readers = ag.filter(function (a) { return a.age >= 7; });
    return { spanare: young[0] || ag[0] || null, reader: readers[readers.length - 1] || null };
  }
  function team() { return state.agents.slice().sort(function (a, b) { return (a.age || 0) - (b.age || 0); }); }
  function who(i) { var t = team(); return t.length ? t[i % t.length] : null; }
  function big(a) { return a && a.age >= 7; }
  var TAGC = ["#3fe6ff", "#7dffb2", "#ff7ad9", "#ffd166"];
  function tag(a) { if (!a) return ""; var i = team().indexOf(a); return '<span class="tag" style="background:' + TAGC[i % 4] + '">' + esc(agentLabel(a)) + "s tur</span>"; }
  var HARD = { rod: "Hitta något rött som är mindre än din tumme.", gul: "Hitta något gult som går att äta.", gron: "Hitta något grönt som inte är en växt.", bla: "Hitta något blått i badrummet.", svart: "Hitta något svart som har knappar." };
  function genMath() {
    var r = roles().reader; if (!r) return null;
    if (r.age >= 8) { var a = rand(1, 3), b = rand(1, 3), c = rand(1, 9 - a - b > 3 ? 3 : 9 - a - b); return { terms: [a, b, c], ans: a + b + c }; }
    var x = rand(1, 5), y = rand(1, 9 - x); return { terms: [x, y], ans: x + y };
  }
  function initData(mid) {
    if (mid === "reg") return { agents: state.agents.length ? JSON.parse(JSON.stringify(state.agents)) : [newAgent()] };
    if (mid === "regnbage") return { media: {}, text: {}, skip: {} };
    if (mid === "kassaskap") return { media: {}, d: {}, math: genMath(), stars: rand(3, 9) };
    if (HUNTS[mid]) return { media: {}, text: {}, found: {}, ai: {} };
    return { media: {}, text: {} };
  }
  function sess(mid) {
    if (!state.sessions[mid]) state.sessions[mid] = { step: "brief", data: initData(mid) };
    return state.sessions[mid];
  }
  function setPath(obj, path, val) {
    var p = path.split("."); var o = obj;
    for (var i = 0; i < p.length - 1; i++) { if (o[p[i]] == null) o[p[i]] = {}; o = o[p[i]]; }
    o[p[p.length - 1]] = val;
  }
  function shrink(file, max, square) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file); var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight, cv = document.createElement("canvas"), ctx = cv.getContext("2d");
        if (square) { var s = Math.min(w, h); cv.width = cv.height = max; ctx.drawImage(img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, max, max); }
        else { var k = Math.min(1, max / Math.max(w, h)); cv.width = Math.round(w * k); cv.height = Math.round(h * k); ctx.drawImage(img, 0, 0, cv.width, cv.height); }
        URL.revokeObjectURL(u); res(cv);
      };
      img.onerror = function () { URL.revokeObjectURL(u); rej(new Error("bild")); };
      img.src = u;
    });
  }
