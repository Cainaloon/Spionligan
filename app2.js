  function got(d, key) { return !!((d.media && d.media[key]) || (d.found && d.found[key])); }
  var SAVE_PREFIX = "SPIONLIGAN1:";
  function b64enc(str) { var bytes = new TextEncoder().encode(str), bin = ""; for (var i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192)); return btoa(bin); }
  function b64dec(b64) { var bin = atob(b64), bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
  function exportCode() { return SAVE_PREFIX + b64enc(JSON.stringify({ v: 1, at: new Date().toISOString(), state: state })); }
  function importCode(raw) {
    var t = String(raw || "").replace(/\s+/g, "");
    var i = t.indexOf(SAVE_PREFIX); if (i < 0) throw new Error("prefix");
    var obj = JSON.parse(b64dec(t.slice(i + SAVE_PREFIX.length)));
    if (!obj || !obj.state || !Array.isArray(obj.state.agents)) throw new Error("form");
    var st = Object.assign(blank(), obj.state);
    Object.keys(st.sessions || {}).forEach(function (k) { var d = st.sessions[k] && st.sessions[k].data; if (d && d.media) d.media = {}; if (d && d.ai) d.ai = {}; });
    return st;
  }
  function allOpsDone() { return OPS.every(function (id) { return state.done[id]; }); }
  function doneCount() { return MISSIONS.filter(function (m) { return state.done[m.id]; }).length; }
  function level() {
    var p = state.pts || 0, cur = LEVELS[0], next = LEVELS[1];
    LEVELS.forEach(function (l, i) { if (p >= l[0]) { cur = l; next = LEVELS[i + 1] || null; } });
    return { p: p, name: cur[1], from: cur[0], next: next };
  }
  function levelBox() {
    var l = level(), pct = l.next ? Math.round((l.p - l.from) / (l.next[0] - l.from) * 100) : 100;
    return '<div class="lvl"><span><b>' + l.name + "</b> · " + l.p + ' poäng</span><div class="bar"><i style="width:' + pct + '%"></i></div><span class="small muted">' +
      (l.next ? (l.next[0] - l.p) + " poäng kvar till " + l.next[1] : "Högsta nivån!") + "</span></div>";
  }
  function todays() {
    if (!state.done.reg) return null;
    var list = visibleMissions().filter(function (m) { return m.id !== "reg"; });
    var open = list.filter(function (m) { return !state.done[m.id]; }), pool = open.length ? open : list;
    var d = new Date(), n = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    return pool[n % pool.length];
  }
  function timeable(m) { return m.id !== "reg"; }
  function recTime(m) { if (m.timed) return m.timed; var t = team(); return t.length && t[0].age <= 6 ? 480 : 300; }
  function timeLeft(tm) { if (!tm) return null; var end = tm.finishedAt || Date.now(); return Math.max(0, tm.sec - Math.floor((end - tm.start) / 1000)); }
  function fmt(sec) { var m = Math.floor(sec / 60), x = sec % 60; return m + ":" + (x < 10 ? "0" : "") + x; }
  function aiBox(d, key, prompt) {
    if (!aiOK || !d.media || !d.media[key]) return "";
    var said = d.ai && d.ai[key];
    return said ? '<div class="owlsays">🦉 ' + esc(said) + "</div>"
      : '<button type="button" class="ghost" data-a="ai" data-k="' + key + '" data-p="' + esc(prompt) + '">🦉 Fråga Uggla om bilden</button>';
  }

  /* ---------- UI-läge ---------- */
  var ui = { view: state.chef ? "home" : "setup", mission: null, pad: "", padMode: state.chef ? null : "setup1", padFirst: null, msg: "", showPad: false, reveal: {}, certs: {}, settingsOpen: false, confirmReset: false };

  /* ---------- Komponenter ---------- */
  function chefSays(text, sayKey) {
    return '<div class="chef"><div class="owl" aria-hidden="true">🦉</div><div class="bubble"><span class="who">Kapten Uggla</span><p>' + esc(text) + "</p>" +
      (canSpeak() && sayKey ? '<button type="button" data-a="speak" data-say="' + sayKey + '">🔊 Lyssna</button>' : "") + "</div></div>";
  }
  function face(a, size) {
    var st = size ? ' style="width:' + size + "px;height:" + size + 'px"' : "";
    var w = a.id && state.lya && state.lya[a.id] && state.lya[a.id].wear ? shopItem(state.lya[a.id].wear) : null;
    var wear = w ? '<span class="wear ' + w.kind + '"' + (size ? ' style="font-size:' + Math.round(size / 2.6) + 'px"' : "") + ">" + w.em + "</span>" : "";
    return '<div class="face"' + st + ">" + (a.selfie ? '<img src="' + a.selfie + '" alt="">' : esc((a.codename || a.name || "?").charAt(0).toUpperCase())) + wear + "</div>";
  }
  function stamps() {
    var n = doneCount(), h = "";
    for (var i = 0; i < MISSIONS.length; i++) h += '<i class="' + (i < n ? "on" : "") + '"></i>';
    return '<div class="stamps" aria-label="' + n + ' stämplar">' + h + "</div>";
  }
  function keypad(title, sub) {
    var dots = ""; for (var i = 0; i < 4; i++) dots += '<i class="' + (i < ui.pad.length ? "on" : "") + '"></i>';
    var keys = ""; [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (k) { keys += '<button type="button" data-a="key" data-k="' + k + '">' + k + "</button>"; });
    keys += '<span></span><button type="button" data-a="key" data-k="0">0</button><button type="button" data-a="key" data-k="del" aria-label="Sudda">⌫</button>';
    return '<div class="pad' + (ui.msg ? " shake" : "") + '"><h3>' + esc(title) + "</h3>" + (sub ? '<p class="small">' + esc(sub) + "</p>" : "") +
      '<div class="dots">' + dots + '</div><div class="keys">' + keys + "</div>" + (ui.msg ? '<p class="err">' + esc(ui.msg) + "</p>" : "") + "</div>";
  }
  function photoSlot(s, key, opts) {
    var has = s.data.media && s.data.media[key], url = urls[key], video = opts.kind === "video", fnd = s.data.found && s.data.found[key];
    if (fnd && !has) return '<div class="preview">✓ Hittad!<br>' + (video ? "Gör ljudet för Chefen sen" : "Ingen bild behövs") + '</div><button type="button" class="link" data-a="found" data-k="' + key + '">Ångra</button>';
    var prev = url ? (video ? '<video src="' + url + '" controls playsinline preload="metadata"></video>' : '<img src="' + url + '" alt="">')
      : has ? "Hämtar…" : (video ? "🎬<br>Inget ljud än" : "📷<br>Ingen bild än");
    var btn = has ? (video ? "Filma igen" : "Ta om bilden") : (video ? "Filma ljudet" : "Ta bild");
    var acc = video ? "video/*" : "image/*", kd = video ? "video" : "image";
    return '<div class="preview">' + prev + '</div><div class="row"><label class="btn pick">' + btn +
      '<input type="file" accept="' + acc + '" capture="environment" data-m="' + key + '" data-kind="' + kd + '" aria-label="' + esc(opts.label || btn) + '"></label>' +
      '<label class="btn pick ghost">Från bilder<input type="file" accept="' + acc + '" data-m="' + key + '" data-kind="' + kd + '" aria-label="Välj från bilder"></label></div>' +
      (has ? "" : '<button type="button" class="link" data-a="found" data-k="' + key + '">Kameran funkar inte? Tryck här när ni hittat ' + (video ? "ljudet" : "saken") + "</button>");
  }
  function digitPicker(field, val) {
    var h = '<div class="digits">';
    for (var i = 0; i <= 9; i++) h += '<button type="button" data-a="digit" data-f="' + field + '" data-v="' + i + '" class="' + (val === i ? "sel" : "") + '">' + i + "</button>";
    return h + "</div>";
  }

  /* ---------- Vyer ---------- */
  function viewSetup() {
    return '<div class="brand"><svg class="logo" viewBox="0 0 200 200" aria-hidden="true"><path d="M14 98 C14 66 40 56 66 58 C86 60 94 70 100 80 C106 70 114 60 134 58 C160 56 186 66 186 98 C186 132 162 144 138 142 C116 140 106 126 100 116 C94 126 84 140 62 142 C38 144 14 132 14 98 Z" fill="#031117" stroke="#3fe6ff" stroke-width="7" stroke-linejoin="round"/><circle cx="64" cy="100" r="22" fill="none" stroke="#7dffb2" stroke-width="7"/><circle cx="136" cy="100" r="22" fill="none" stroke="#7dffb2" stroke-width="7"/><circle cx="70" cy="94" r="6" fill="#3fe6ff"/><circle cx="142" cy="94" r="6" fill="#3fe6ff"/></svg><h1>Spionligan</h1></div>' +
      chefSays("Hej Chefen! Den här skärmen är för den vuxna. Välj en fyrsiffrig chefskod. Den används när du granskar och godkänner barnens rapporter, så välj en som de inte kan.", null) +
      keypad(ui.padMode === "setup2" ? "Skriv koden en gång till" : "Välj din chefskod", ui.padMode === "setup2" ? "Så att vi vet att den blev rätt." : "Fyra siffror.");
  }

  function viewHome() {
    var r = state.done.reg;
    var h = '<div class="top"><div class="brand"><svg class="logo" viewBox="0 0 200 200" aria-hidden="true"><path d="M14 98 C14 66 40 56 66 58 C86 60 94 70 100 80 C106 70 114 60 134 58 C160 56 186 66 186 98 C186 132 162 144 138 142 C116 140 106 126 100 116 C94 126 84 140 62 142 C38 144 14 132 14 98 Z" fill="#031117" stroke="#3fe6ff" stroke-width="7" stroke-linejoin="round"/><circle cx="64" cy="100" r="22" fill="none" stroke="#7dffb2" stroke-width="7"/><circle cx="136" cy="100" r="22" fill="none" stroke="#7dffb2" stroke-width="7"/><circle cx="70" cy="94" r="6" fill="#3fe6ff"/><circle cx="142" cy="94" r="6" fill="#3fe6ff"/></svg><h1>Spionligan</h1></div><button type="button" class="link" data-a="settings">Chefens inställningar</button></div>';
    h += chefSays(!state.agents.length ? "Hej! Jag är Kapten Uggla. Börja med att registrera er som agenter. Tryck på Agentregistrering."
      : allOpsDone() ? "Fantastiskt, agenter! Ni har klarat alla uppdrag. Nu kan Chefen skriva ut era Mästeragent-diplom."
      : "Välkomna tillbaka, agenter! Välj ett uppdrag.", "home");
    var td = todays();
    if (td) h += '<section class="panel today"><div class="row"><div class="badge-sm" style="background:' + td.color + '">' + td.badge + '</div><div><span class="pill go">Dagens uppdrag</span><h2>' + esc(td.title) + "</h2></div></div>" +
      '<button type="button" class="primary" data-a="open" data-mid="' + td.id + '">' + (state.done[td.id] ? "Gör det igen" : "Starta dagens uppdrag") + "</button></section>";
    if (state.agents.length) {
      h += '<section class="stack"><h2>Agenterna</h2><div class="agents">' + state.agents.map(function (a) {
        return '<div class="agent">' + face(a) + '<div class="code">' + esc(agentLabel(a)) + '</div><div class="small muted">' + esc(a.name) + " · " + esc(a.age) + " år · " + esc(a.power) + "</div>" + '<span class="coins">🪙 ' + lya(a).coins + "</span>" + levelBox() + "</div>";
      }).join("") + '</div><div class="row"><button type="button" class="primary" data-a="trophy">🏆 Trofeskåpet</button><button type="button" data-a="album">📸 Agentalbum</button><button type="button" data-a="lya">🏠 Agentlyan</button><button type="button" data-a="chest">💛 Skattkistan · ' + state.chest.coins + "/" + state.chest.goal + "</button></div></section>";
    }
    h += '<section class="stack"><h2>Uppdrag</h2><div class="missions">' + visibleMissions().map(function (m) {
      var locked = m.id !== "reg" && !r, s = state.sessions[m.id], done = state.done[m.id];
      var pill = locked ? '<span class="pill">Låst – registrera er först</span>' : done ? '<span class="pill done">Klart ✓' + (state.bonus[m.id] ? " ⭐" : "") + (state.blitz && state.blitz[m.id] ? " ⚡" : "") + "</span>" + (m.season ? ' <span class="pill">Säsong</span>' : "") : s && s.step !== "brief" ? '<span class="pill go">Pågår</span>' : '<span class="pill">Nytt</span>';
      var act = locked ? "" : done ? '<div class="row"><button type="button" data-a="open" data-mid="' + m.id + '">Märken</button><button type="button" class="ghost" data-a="replay" data-mid="' + m.id + '">Gör igen</button></div>'
        : '<button type="button" class="primary" data-a="open" data-mid="' + m.id + '">' + (s && s.step !== "brief" ? "Fortsätt" : "Starta") + "</button>";
      return '<div class="mission' + (locked ? " locked" : "") + '"><div class="badge-sm" style="background:' + m.color + '">' + m.badge + '</div><div><h3>' + esc(m.title) + "</h3>" + pill + "</div>" + act + "</div>";
    }).join("") + "</div></section>";
    if (allOpsDone()) h += viewDiplomas();
    h += '<p class="small muted">Bilder och ljud sparas bara på den här enheten. Tips: lägg till Spionligan på hemskärmen (Dela → Lägg till på hemskärmen), så sparas framstegen säkrare.</p>';
    return h;
  }

  function viewDiplomas() {
    return '<section class="panel"><h2>Mästeragent-diplom</h2><p>Spara diplomet som bild och skriv ut det.</p>' + certButtons("diploma", "master") + "</section>";
  }

  function certButtons(kind, mid) {
    return '<div class="agents">' + state.agents.map(function (a) {
      var k = kind + ":" + mid + ":" + a.id, prev = ui.certs[k];
      return '<div class="agent">' + face(a, 72) + '<div class="code">' + esc(agentLabel(a)) + "</div>" +
        (prev ? '<img class="cert-prev" src="' + prev + '" alt="' + (kind === "diploma" ? "Diplom" : "Märke") + " för " + esc(agentLabel(a)) + '">' +
          (downloads ? "" : '<p class="small muted">Håll fingret på bilden och välj Spara, eller ta en skärmdump.</p>') : "") +
        '<button type="button" data-a="cert" data-kind="' + kind + '" data-mid="' + mid + '" data-aid="' + a.id + '">' + (downloads ? "Spara för utskrift" : "Visa för utskrift") + "</button></div>";
    }).join("") + "</div>";
  }

  function stepBar(step) {
    var idx = STEPS.map(function (x) { return x[0]; }).indexOf(step);
    return '<div class="steps">' + STEPS.map(function (x, i) { return '<span class="' + (i === idx ? "on" : i < idx || step === "reward" ? "done" : "") + '">' + x[1] + "</span>"; }).join("") + "</div>";
  }

  function viewMission() {
    var m = mission(ui.mission), s = sess(m.id);
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button>' + stepBar(s.step) + "</div>";
    h += '<div class="row"><div class="badge-sm" style="background:' + m.color + '">' + m.badge + "</div><h1>" + esc(m.title) + "</h1></div>";
    if (s.step === "brief") {
      h += chefSays(m.brief, "brief");
      if (m.id !== "reg" && state.agents.some(function (a) { return a.sign; })) {
        h += '<div class="panel"><h3>Först: hemlig hälsning!</h3>' + team().map(function (a) { return a.sign ? "<p><b>" + esc(agentLabel(a)) + ":</b> " + esc(a.sign) + "</p>" : ""; }).join("") + "</div>";
      }
      if (m.id !== "reg") {
        h += '<div class="panel"><h3>Ni turas om!</h3><p>Varje uppgift visar vems tur det är att leta och fota. De äldre agenterna får svårare jaktuppdrag.</p><div class="row">' +
          team().map(tag).join("").replace(/s tur/g, "") + "</div></div>";
      }
      if (timeable(m)) {
        var d0 = s.data, rec = recTime(m); if (d0.timeChoice === undefined) d0.timeChoice = m.timed ? m.timed : 0;
        h += '<div class="panel"><h3>⚡ Tidsutmaning</h3><p>Slå klockan tillsammans! Hinner ni får alla agenter blixtbonus. Om klockan vinner kan ni fortsätta ändå.</p><div class="row">' +
          [0, 480, 300, 180].map(function (v) { return '<button type="button" class="' + (d0.timeChoice === v ? "sel" : "") + '" data-a="timepick" data-v="' + v + '">' + (v ? fmt(v) + " min" : "Ingen tid") + (v === rec ? " ★" : "") + "</button>"; }).join("") +
          '</div><p class="small muted">★ = förslag för er trupp.</p></div>';
      }
      h += '<button type="button" class="primary" data-a="start">' + (s.data.timeChoice ? "Starta klockan!" : "Vi är redo!") + "</button>";
    } else if (s.step === "tasks") {
      if (s.data.timer) {
        var left = timeLeft(s.data.timer);
        h += '<div id="timer" class="timer' + (left === 0 ? " over" : left <= 30 ? " low" : "") + '"><span>⚡ Tid kvar</span><span class="t" id="timer-t">' + fmt(left) + "</span></div>";
        if (s.data.timer.expired) h += '<p class="owlsays">🦉 Tiden tog slut! Ni kan fortsätta uppdraget, men blixtbonusen gick förlorad den här gången.</p>';
      }
      h += tasks(m, s);
      h += '<button type="button" id="continue" class="primary" data-a="continue"' + (canContinue(m.id) ? "" : " disabled") + ">Klart! Vidare till fältuppdraget</button>";
    } else if (s.step === "field") {
      if (s.data.timer && s.data.timer.beat) h += '<p class="owlsays">⚡ Ni slog klockan med ' + fmt(timeLeft(s.data.timer)) + " kvar! Blixtbonus väntar när Chefen godkänner.</p>";
      h += chefSays(m.field, "field");
      h += '<div class="hq"><span class="lbl">HÖGKVARTERET</span><p>Paddan vilar här under fältuppdraget.</p></div>';
      h += '<button type="button" class="primary" data-a="go" data-s="report">' + (m.id === "ora" ? "Nu är det middag – hämta Chefen!" : "Fältuppdraget är klart – hämta Chefen") + "</button>";
      h += '<button type="button" class="link" data-a="go" data-s="tasks">Tillbaka och leta mer</button>';
    } else if (s.step === "report") {
      h += report(m, s);
    } else {
      h += reward(m);
    }
    return h;
  }

  function tasks(m, s) {
    var d = s.data, r = roles(), h = "";
    if (m.id === "reg") {
      h += d.agents.map(function (a, i) {
        return '<section class="panel"><div class="row between"><h2>Agent ' + (i + 1) + "</h2>" +
          (d.agents.length > 1 ? '<button type="button" class="link" data-a="rmagent" data-i="' + i + '">Ta bort</button>' : "") + "</div>" +
          '<div class="row">' + face(a) + '<label class="btn pick">' + (a.selfie ? "Ta en ny agentselfie" : "Ta agentselfie") +
          '<input type="file" accept="image/*" capture="user" data-m="selfie" data-kind="selfie" data-i="' + i + '" aria-label="Agentselfie"></label>' +
          '<label class="btn pick ghost">Från bilder<input type="file" accept="image/*" data-m="selfie" data-kind="selfie" data-i="' + i + '" aria-label="Välj selfie från bilder"></label></div>' +
          '<p class="small muted">Selfien är frivillig. Startar inte kameran? Ta bilden med Kamera-appen och välj den sedan under Från bilder.</p>' +
          '<label class="field">Riktigt namn<input type="text" id="name-' + i + '" data-f="agents.' + i + '.name" value="' + esc(a.name) + '" autocomplete="off"></label>' +
          '<div class="stack"><b>Ålder</b><div class="row">' + [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (n) {
            return '<button type="button" data-a="pick" data-f="agents.' + i + '.age" data-v="' + n + '" data-num="1" class="' + (a.age === n ? "sel" : "") + '">' + n + "</button>";
          }).join("") + "</div></div>" +
          '<label class="field">Agentnamn<input type="text" id="code-' + i + '" data-f="agents.' + i + '.codename" value="' + esc(a.codename) + '" autocomplete="off" placeholder="Till exempel Blixt"></label>' +
          '<div class="row">' + CODENAMES.map(function (c) { return '<button type="button" data-a="pick" data-f="agents.' + i + '.codename" data-v="' + c + '" class="' + (a.codename === c ? "sel" : "") + '">' + c + "</button>"; }).join("") + "</div>" +
          '<div class="stack"><b>Superkraft</b><div class="row">' + POWERS.map(function (p) { return '<button type="button" data-a="pick" data-f="agents.' + i + '.power" data-v="' + p + '" class="' + (a.power === p ? "sel" : "") + '">' + p + "</button>"; }).join("") + "</div></div>" +
          '<div class="stack"><b>Hemlig hälsning</b><p class="small muted">Görs innan varje uppdrag. Bara agenterna vet vad den betyder!</p><div class="row">' + SIGNS.map(function (g) { return '<button type="button" data-a="pick" data-f="agents.' + i + '.sign" data-v="' + g + '" class="' + (a.sign === g ? "sel" : "") + '">' + g + "</button>"; }).join("") + "</div></div></section>";
      }).join("");
      if (d.agents.length < 4) h += '<button type="button" class="ghost" data-a="addagent">+ Lägg till en agent</button>';
      return h;
    }
    if (m.id === "regnbage") {
      h += '<p class="muted">Hitta en sak i varje färg och fota den. Ni turas om!</p>';
      h += '<div class="slots">' + COLORS.map(function (c, ci) {
        var key = "regnbage:" + c.k, ok = got(d, key), sk = d.skip[c.k], a = who(ci), pr = big(a) ? HARD[c.k] : "Hitta något " + NEUT[c.k] + ".";
        return '<div class="slot' + (ok ? " ok" : sk ? " skipped" : "") + '"><div class="slot-head"><span class="swatch" style="background:' + c.hex + '"></span>' + c.name + "</div>" + tag(a) +
          "<p>" + esc(pr) + "</p>" +
          photoSlot(s, key, { label: "Foto: " + c.name }) + aiBox(d, key, pr) +
          (big(a) ? '<input type="text" data-f="text.' + c.k + '" value="' + esc(d.text[c.k]) + '" placeholder="Vad är det? (om du vill)" aria-label="Vad är det för ' + c.name.toLowerCase() + ' sak?">' : "") +
          (!ok ? '<button type="button" class="link" data-a="skip" data-k="' + c.k + '">' + (sk ? "Vi letar igen" : "Hittar ingen") + "</button>" : "") + "</div>";
      }).join("");
      team().forEach(function (a) {
        var L = (a.name || "?").charAt(0).toUpperCase(), key = "regnbage:extra-" + a.id;
        h += '<div class="slot' + (got(d, key) ? " ok" : "") + '"><div class="slot-head">Extrauppdrag</div>' + tag(a) + "<p>Hitta något som börjar på <b>" + esc(L) + "</b>, som ditt namn" + (big(a) ? ", och som är större än en stol" : "") + ".</p>" +
          photoSlot(s, key, { label: "Extrauppdrag" }) + "</div>";
      });
      return h + "</div>";
    }
    if (m.id === "kassaskap") {
      var t = team(), sp = t[0], rd = t.length ? t[t.length - 1] : null; if (!big(rd)) rd = null;
      h += '<section class="panel"><h2>Ledtråd 1</h2>' + tag(sp) + "<p>Räkna hur många fönster det finns i vardagsrummet. Fota dem och tryck på rätt siffra.</p>" +
        '<div class="slots"><div class="slot' + (got(d, "kassaskap:f") ? " ok" : "") + '">' + photoSlot(s, "kassaskap:f", { label: "Foto på fönstren" }) + "</div></div>" + digitPicker("d.d1", d.d.d1) + "</section>";
      if (rd && d.math) {
        var ok2 = d.d.d2 != null && d.d.d2 === d.math.ans;
        h += '<section class="panel"><h2>Ledtråd 2</h2>' + tag(rd) + "<p>Vad är <b>" + d.math.terms.join(" + ") + "</b>?</p>" + digitPicker("d.d2", d.d.d2) +
          (d.d.d2 != null ? '<p class="feedback ' + (ok2 ? "good" : "bad") + '">' + (ok2 ? "Rätt! Bra räknat." : "Inte riktigt. Räkna igen!") + "</p>" : "") + "</section>";
      } else {
        var ok3 = d.d.d2 != null && d.d.d2 === d.stars, st = ""; for (var i = 0; i < d.stars; i++) st += "★";
        h += '<section class="panel"><h2>Ledtråd 2</h2>' + tag(t[t.length - 1]) + '<p>Räkna stjärnorna.</p><div class="stars" aria-label="Stjärnor att räkna">' + st + "</div>" + digitPicker("d.d2", d.d.d2) +
          (d.d.d2 != null ? '<p class="feedback ' + (ok3 ? "good" : "bad") + '">' + (ok3 ? "Rätt! Bra räknat." : "Inte riktigt. Räkna igen!") + "</p>" : "") + "</section>";
      }
      h += '<section class="panel"><h2>Ledtråd 3</h2>' + tag(t[t.length - 1]) + '<p>Hur många stolar står runt köksbordet? Fota dem och tryck på rätt siffra.</p>' +
        '<div class="slots"><div class="slot' + (got(d, "kassaskap:s") ? " ok" : "") + '">' + photoSlot(s, "kassaskap:s", { label: "Foto på stolarna" }) + "</div></div>" + digitPicker("d.d3", d.d.d3) + "</section>";
      if (canContinue("kassaskap")) h += '<section class="panel"><h2>Koden är</h2><div class="code-big">' + d.d.d1 + d.d.d2 + d.d.d3 + "</div><p>Skriv koden på ett papper.</p></section>";
      return h;
    }
    if (m.type === "hunt") {
      h += '<div class="slots">' + m.items.map(function (it, ii) {
        var key = m.id + ":" + it.k, a = who(ii), pr = big(a) ? it.hard : it.young;
        return '<div class="slot' + (got(d, key) ? " ok" : "") + '"><div class="slot-head">' + esc(it.label) + "</div>" + tag(a) + "<p>" + esc(pr) + "</p>" +
          photoSlot(s, key, { label: it.label }) + (m.quiz ? "" : aiBox(d, key, pr)) +
          (big(a) ? '<input type="text" data-f="text.' + it.k + '" value="' + esc(d.text[it.k]) + '" placeholder="' + (m.quiz ? "Vad är det? (hemligt!)" : "Vad är det? (om du vill)") + '" aria-label="Vad är det?">' : "") + "</div>";
      }).join("") + '</div><p class="small muted">Minst ' + (m.quiz ? 3 : 4) + " behövs.</p>";
      return h;
    }
    // ora
    h += '<p class="muted">Filma fem hemliga ljud. Rikta kameran mot golvet, så att Chefen inte ser vad det är! Idéer: vattenkranen, en dörr som stängs, kylskåpet, nycklar, en tandborste.</p><div class="slots">';
    for (var n = 1; n <= 5; n++) {
      var k = "ora:" + n;
      var a = who(n - 1);
      h += '<div class="slot' + (got(d, k) ? " ok" : "") + '"><div class="slot-head">Hemligt ljud ' + n + "</div>" + tag(a) + photoSlot(s, k, { kind: "video", label: "Ljud " + n }) +
        (big(a) ? '<input type="text" data-f="text.' + n + '" value="' + esc(d.text[n]) + '" placeholder="Svaret (om du vill, hemligt!)" aria-label="Svar för ljud ' + n + '">' : "") + "</div>";
    }
    return h + '</div><p class="small muted">Minst tre ljud behövs.</p>';
  }

