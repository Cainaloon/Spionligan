  function canContinue(mid) {
    var d = sess(mid).data;
    if (mid === "reg") return d.agents.length > 0 && d.agents.every(function (a) { return a.name.trim() && a.age && a.codename.trim() && a.power; });
    if (mid === "regnbage") return COLORS.every(function (c) { return got(d, "regnbage:" + c.k) || d.skip[c.k]; });
    if (mid === "kassaskap") {
      var ans = d.math ? d.math.ans : d.stars;
      return d.d.d1 != null && d.d.d2 === ans && d.d.d3 != null;
    }
    if (HUNTS[mid]) { var hc = 0; HUNTS[mid].items.forEach(function (it) { if (got(d, mid + ":" + it.k)) hc++; }); return hc >= (HUNTS[mid].quiz ? 3 : 4); }
    var c = 0; for (var n = 1; n <= 5; n++) if (got(d, "ora:" + n)) c++;
    return c >= 3;
  }

  function report(m, s) {
    var d = s.data, h = '<section class="panel"><h2>Rapport till Chefen</h2><p class="muted">Den här delen är för Chefen.</p><p><b>' + esc(m.check) + "</b></p></section>";
    if (m.id === "reg") {
      h += '<div class="agents">' + state.agents.map(function (a) { return '<div class="agent">' + face(a) + '<div class="code">' + esc(agentLabel(a)) + '</div><div class="small muted">' + esc(a.name) + " · " + esc(a.age) + " år · " + esc(a.power) + "</div></div>"; }).join("") + "</div>";
    } else if (m.id === "regnbage") {
      h += '<div class="slots">' + COLORS.concat(team().map(function (a) { return { k: "extra-" + a.id, name: "Extra: " + agentLabel(a), hex: "#19b9d6" }; })).map(function (c) {
        var key = "regnbage:" + c.k; if (!got(d, key) && !d.skip[c.k]) return "";
        return '<div class="slot"><div class="slot-head"><span class="swatch" style="background:' + c.hex + '"></span>' + c.name + "</div>" +
          (urls[key] ? '<div class="preview"><img src="' + urls[key] + '" alt=""></div>' : '<div class="preview">' + (d.skip[c.k] ? "Hittade ingen" : d.media[key] ? "Hämtar…" : "✓ Hittad (ingen bild)") + "</div>") +
          (d.text[c.k] ? "<p><b>" + esc(d.text[c.k]) + "</b></p>" : "") + "</div>";
      }).join("") + "</div>";
    } else if (m.id === "kassaskap") {
      h += '<div class="slots"><div class="slot"><div class="slot-head">Fönster: ' + d.d.d1 + '</div><div class="preview">' + (urls["kassaskap:f"] ? '<img src="' + urls["kassaskap:f"] + '" alt="">' : "Ingen bild") + "</div></div>" +
        '<div class="slot"><div class="slot-head">Stolar: ' + d.d.d3 + '</div><div class="preview">' + (urls["kassaskap:s"] ? '<img src="' + urls["kassaskap:s"] + '" alt="">' : "Ingen bild") + "</div></div></div>" +
        '<section class="panel"><p>Ledtråd 2 löstes rätt: ' + (d.math ? d.math.terms.join(" + ") + " = " + d.math.ans : d.stars + " stjärnor") + '</p><div class="code-big">' + d.d.d1 + d.d.d2 + d.d.d3 + "</div></section>";
    } else if (m.type === "hunt") {
      h += '<div class="slots">' + m.items.map(function (it) {
        var key = m.id + ":" + it.k; if (!got(d, key)) return "";
        var rev = !m.quiz || ui.reveal[it.k], u = urls[key];
        return '<div class="slot"><div class="slot-head">' + esc(it.label) + '</div><div class="preview">' + (u ? '<img src="' + u + '" alt="">' : d.media[key] ? "Hämtar…" : "✓ Hittad (ingen bild)") + "</div>" +
          (m.quiz ? '<button type="button" class="ghost" data-a="reveal" data-i="' + it.k + '">' + (ui.reveal[it.k] ? "Dölj" : "Visa svaret") + "</button>" : "") +
          (rev && d.text[it.k] ? '<div class="answer">' + esc(d.text[it.k]) + "</div>" : "") + (m.quiz && rev && !d.text[it.k] ? '<div class="answer">Fråga agenterna!</div>' : "") + "</div>";
      }).join("") + "</div>";
    } else {
      h += '<div class="slots">';
      for (var n = 1; n <= 5; n++) {
        var k = "ora:" + n; if (!got(d, k)) continue;
        if (!d.media[k]) { h += '<div class="quiz"><div class="slot-head">Hemligt ljud ' + n + '</div><p>Agenterna gör ljudet nu! Chefen blundar och gissar.</p><div class="row"><button type="button" class="ghost" data-a="reveal" data-i="' + n + '">' + (ui.reveal[n] ? "Dölj" : "Visa svaret") + "</button></div>" + (ui.reveal[n] && d.text[n] ? '<div class="answer">' + esc(d.text[n]) + "</div>" : "") + "</div>"; continue; }
        var rev = ui.reveal[n];
        h += '<div class="quiz"><div class="slot-head">Hemligt ljud ' + n + '</div><div class="vidwrap' + (rev ? "" : " covered") + '">' +
          (urls[k] ? '<video id="v' + n + '" src="' + urls[k] + '" playsinline preload="auto"' + (rev ? " controls" : "") + "></video>" : "") + '<div class="cover">?</div></div>' +
          '<div class="row"><button type="button" data-a="play" data-i="' + n + '">▶ Spela ljudet</button><button type="button" class="ghost" data-a="reveal" data-i="' + n + '">' + (rev ? "Dölj" : "Visa svaret") + "</button></div>" +
          (rev && d.text[n] ? '<div class="answer">' + esc(d.text[n]) + "</div>" : "") + "</div>";
      }
      h += "</div>";
    }
    h += '<button type="button" class="' + (d.bonus ? "sel" : "ghost") + '" data-a="bonus">⭐ ' + (d.bonus ? "Bonusstjärna för samarbete – vald!" : "Ge en bonusstjärna för bra samarbete") + "</button>";
    if (ui.showPad) {
      h += keypad("Chefskod", "Godkänn rapporten med din kod.");
      h += '<button type="button" class="link" data-a="hidepad">Avbryt</button>';
    } else {
      h += '<button type="button" class="primary" data-a="showpad">Godkänn med chefskod</button>';
      h += '<button type="button" class="ghost" data-a="go" data-s="tasks">Inte klart än – tillbaka till uppdraget</button>';
    }
    return h;
  }

  function reward(m) {
    var h = '<section class="panel reward"><div class="badge-big" style="background:' + m.color + '">' + m.badge + "</div><h2>Uppdraget är godkänt!</h2>" +
      (ui.lastGain ? "<p><b>+" + ui.lastGain.p + " poäng" + (ui.lastGain.blitz ? " (med blixtbonus ⚡)" : "") + (sess(m.id).data.bonus ? " (med bonusstjärna ⭐)" : "") + "</b></p>" + (sess(m.id).data.bonus ? '<p class="owlsays">🦉 Bonusstjärnan gav också 5 mynt till skattkistan!</p>' : "") + "<p><span class=\"coins\">🪙 +" + ui.lastGain.p + " agentmynt till varje agent</span></p>" + '<button type="button" data-a="lya">🏠 Handla till agentlyan</button>' + (ui.lastGain.up ? '<p class="owlsays">🦉 Ny nivå! Ni är nu ' + esc(ui.lastGain.up) + "!</p>" : "") : "") +
      "<p>Varje agent får en stämpel på sitt agentkort och ett märke att skriva ut.</p>" + levelBox() + "</section>";
    h += '<section class="panel"><h2>Rapportkort till mormor och morfar</h2><p>Skapa en bild med uppdraget och agenternas bilder som ni kan skicka i Meddelanden.</p>' +
      (ui.reportPrev && ui.reportPrev[m.id] ? '<img class="cert-prev" src="' + ui.reportPrev[m.id] + '" alt="Rapportkort">' + (downloads ? "" : '<p class="small muted">Håll fingret på bilden för att spara eller dela den.</p>') : "") +
      '<button type="button" data-a="rcard" data-mid="' + m.id + '">💌 ' + (downloads ? "Skapa och dela rapportkort" : "Skapa rapportkort") + "</button></section>";
    h += '<section class="stack"><h2>Märken</h2>' + certButtons("badge", m.id) + "</section>";
    if (allOpsDone()) h += viewDiplomas();
    h += '<button type="button" class="primary" data-a="home">Tillbaka till Högkvarteret</button>';
    return h;
  }

  function viewTrophy() {
    var n = doneCount();
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Trofeskåpet</h1>';
    h += chefSays(n === 0 ? "Trofeskåpet är tomt än så länge. Klara ett uppdrag så får ni ert första märke!"
      : "Här står alla era märken, agenter. Ni har " + n + " av " + visibleMissions().length + " märken" + (allOpsDone() ? " och har klarat alla tre operationerna!" : ". Fortsätt så!"), "trophy");
    h += '<section class="panel">' + levelBox() + "</section>";
    var items = visibleMissions().map(function (m) { return { kind: "badge", mid: m.id, title: m.title + (state.bonus[m.id] ? " ⭐" : ""), badge: m.badge, color: m.color, date: state.done[m.id] }; });
    if (state.chest.log.length) items.push({ kind: "none", mid: "", title: "Hjärteagent ×" + state.chest.log.length, badge: "💛", color: "#be123c", date: state.chest.log[state.chest.log.length - 1].date });
    items.push({ kind: "diploma", mid: "master", title: "Mästeragent", badge: "🏅", color: "#b45309", date: allOpsDone() ? OPS.map(function (id) { return state.done[id]; }).sort().pop() : null });
    state.agents.forEach(function (a) {
      h += '<section class="panel"><div class="row">' + face(a, 72) + '<div><h2>' + esc(agentLabel(a)) + '</h2><p class="small muted">' + esc(a.name) + " · " + esc(a.age) + " år · Superkraft: " + esc(a.power) + "</p></div></div>";
      h += '<div class="shelf">' + items.map(function (it) {
        var got = !!it.date;
        return '<div class="trophy' + (got ? "" : " locked") + '"><div class="badge-sm" style="background:' + it.color + '">' + (got ? it.badge : "?") + "</div><b>" + esc(it.title) + "</b>" +
          '<span class="small muted">' + (got ? new Date(it.date).toLocaleDateString("sv-SE") : it.kind === "diploma" ? "Klara alla tre operationer" : "Inte klart än") + "</span>" +
          (got && it.kind !== "none" ? '<button type="button" data-a="cert" data-kind="' + it.kind + '" data-mid="' + it.mid + '" data-aid="' + a.id + '">Skriv ut</button>' : "") + "</div>";
      }).join("") + "</div>";
      var last = ui.lastCert && ui.lastCert.indexOf(":" + a.id) > 0 ? ui.certs[ui.lastCert] : null;
      if (last) h += '<div class="stack" style="align-items:center"><img class="cert-prev" src="' + last + '" alt="Märke att skriva ut">' + (downloads ? "" : '<p class="small muted">Håll fingret på bilden och välj Spara, eller ta en skärmdump.</p>') + "</div>";
      h += "</section>";
    });
    return h;
  }

  function viewAlbum() {
    var items = [];
    visibleMissions().forEach(function (m) {
      var s = state.sessions[m.id]; if (!s || !s.data || !s.data.media) return;
      Object.keys(s.data.media).forEach(function (k) { if (k.indexOf("ora:") !== 0) items.push({ k: k, m: m }); });
    });
    ensureMedia(items.map(function (x) { return x.k; }));
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Agentalbum</h1>';
    h += '<div class="agents">' + state.agents.map(function (a) { return '<div class="agent">' + face(a) + '<div class="code">' + esc(agentLabel(a)) + "</div></div>"; }).join("") + "</div>";
    var shown = items.filter(function (x) { return urls[x.k]; });
    if (!shown.length) return h + chefSays("Albumet är tomt än så länge. Ta bilder i uppdragen så hamnar de här!", null);
    h += chefSays("Här är alla era agentbilder. " + shown.length + " stycken! Vilken är er favorit?", null);
    h += '<div class="album">' + shown.map(function (x) { return '<figure><img src="' + urls[x.k] + '" alt="Bild från ' + esc(x.m.title) + '"><figcaption>' + x.m.badge + " " + esc(x.m.title) + "</figcaption></figure>"; }).join("") + "</div>";
    return h;
  }

  function viewLya() {
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Agentlyan</h1>';
    if (!state.agents.length) return h + chefSays("Registrera er som agenter först, så får ni varsin agentlya!", null);
    var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0] || state.agents[0]; ui.lyaAgent = a.id;
    var L = lya(a);
    h += '<div class="tabs">' + state.agents.map(function (x) { return '<button type="button" class="' + (x.id === a.id ? "sel" : "") + '" data-a="lyaagent" data-aid="' + x.id + '">' + esc(agentLabel(x)) + "</button>"; }).join("") + "</div>";
    h += '<section class="panel"><div class="row between"><div class="row">' + face(a, 84) + "<div><h2>" + esc(agentLabel(a)) + 's lya</h2><span class="coins">🪙 ' + L.coins + " agentmynt</span></div></div></div>";
    function cells(list, kind) {
      var out = ""; for (var i = 0; i < 4; i++) { var it = list[i] ? shopItem(list[i]) : null;
        out += '<button type="button" class="cellbtn' + (it ? " full" : "") + '" data-a="unplace" data-kind="' + kind + '" data-i="' + i + '" aria-label="' + (it ? "Ta bort " + esc(it.name) : "Tom plats") + '"' + (it ? "" : " disabled") + ">" + (it ? it.em : "") + "</button>"; }
      return out;
    }
    h += '<div class="room"><div class="wall" style="background:' + L.color + '">' + cells(L.wall, "wall") + '</div><div class="floor">' + cells(L.floor, "floor") + "</div></div>";
    h += '<p class="small muted">Tryck på en sak i rummet för att plocka bort den.</p><div class="row"><b>Väggfärg:</b>' + WALLS.map(function (c) { return '<button type="button" data-a="wallc" data-c="' + c + '" aria-label="Väggfärg" style="background:' + c + ";min-width:48px;" + (L.color === c ? "outline:3px solid var(--sun)" : "") + '">&nbsp;</button>'; }).join("") + "</div></section>";
    h += '<section class="panel"><h3>💛 Skattkistan</h3><p>Ge några av dina mynt till skattkistan. När den är full skänker familjen riktiga pengar till ' + esc(chestCause().cause.name.toLowerCase()) + ".</p>" +
      '<div class="row">' + [5, 10].map(function (n) { return '<button type="button" data-a="give" data-n="' + n + '"' + (L.coins >= n ? "" : " disabled") + ">Ge " + n + " mynt</button>"; }).join("") +
      '<span class="small muted">Du har gett ' + (state.chest.by[a.id] || 0) + " mynt hittills.</span></div></section>";
    var inv = L.owned.filter(function (id) { return L.wall.indexOf(id) < 0 && L.floor.indexOf(id) < 0; });
    h += '<section class="stack"><h2>Mina saker</h2>' + (L.owned.length ? '<div class="shop">' + L.owned.map(function (id) {
      var it = shopItem(id), wearable = it.kind === "hat" || it.kind === "eyes" || it.kind === "cape", placed = inv.indexOf(id) < 0;
      var btn = wearable ? '<button type="button" class="' + (L.wear === id ? "sel" : "") + '" data-a="wear" data-id="' + id + '">' + (L.wear === id ? "Ta av" : "Ta på") + "</button>"
        : placed ? '<button type="button" disabled>I rummet</button>' : '<button type="button" data-a="place" data-id="' + id + '">Ställ i rummet</button>';
      return '<div class="item"><span class="em">' + it.em + "</span><b>" + esc(it.name) + "</b>" + btn + "</div>";
    }).join("") + "</div>" : '<p class="muted">Inga saker än. Köp något i agentbutiken!</p>') + "</section>";
    h += '<section class="stack"><h2>Agentbutiken</h2><div class="shop">' + SHOP.filter(function (it) { return L.owned.indexOf(it.id) < 0; }).map(function (it) {
      return '<div class="item"><span class="em">' + it.em + "</span><b>" + esc(it.name) + '</b><span class="small muted">' + ({ hat: "Till avataren", eyes: "Till avataren", cape: "Till avataren", wall: "Till väggen", floor: "Till golvet" })[it.kind] + "</span>" +
        '<button type="button" class="' + (L.coins >= it.price ? "primary" : "") + '" data-a="buy" data-id="' + it.id + '"' + (L.coins >= it.price ? "" : " disabled") + ">🪙 " + it.price + "</button></div>";
    }).join("") + "</div></section>";
    return h;
  }

  function viewChest() {
    var C = state.chest, cc = chestCause(), pct = Math.min(100, Math.round(C.coins / C.goal * 100));
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Skattkistan</h1>';
    h += chefSays(chestFull() ? "Skattkistan är full! Nu kan Chefen skänka pengarna till " + cc.cause.name.toLowerCase() + ". Bra jobbat, agenter!"
      : "Här samlar alla agenter mynt för att hjälpa andra. När kistan är full skänker familjen riktiga pengar.", "chest");
    h += '<section class="panel chest"><div class="big" aria-hidden="true">' + (chestFull() ? "💰" : "🧰") + '</div><div class="sum">' + C.coins + " / " + C.goal + ' mynt</div><div class="lvl"><div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      "<p>Det blir <b>" + Math.round(Math.min(C.coins, C.goal) * C.kr) + " kronor</b> till " + esc(cc.cause.name.toLowerCase()) + ".</p>" +
      '<p class="small muted">' + state.agents.map(function (a) { return esc(agentLabel(a)) + ": " + (C.by[a.id] || 0) + " mynt"; }).join(" · ") + "</p></section>";
    h += '<section class="stack"><h2>Vem ska få pengarna?</h2><p class="muted">Varje agent röstar. Det som har flest röster vinner.</p><div class="cause">' + CAUSES.map(function (x) {
      var voters = state.agents.filter(function (a) { return C.votes[a.id] === x.id; });
      return '<div class="item' + (cc.cause.id === x.id && voters.length ? " lead" : "") + '"><span class="em">' + x.em + "</span><b>" + esc(x.name) + '</b><span class="small muted">' + (voters.length ? voters.map(agentLabel).map(esc).join(", ") : "Inga röster än") + "</span>" +
        '<div class="row" style="justify-content:center">' + state.agents.map(function (a) { return '<button type="button" class="' + (C.votes[a.id] === x.id ? "sel" : "") + '" data-a="vote" data-aid="' + a.id + '" data-c="' + x.id + '">' + esc(a.codename || "?") + "</button>"; }).join("") + "</div></div>";
    }).join("") + "</div></section>";
    if (chestFull()) {
      if (ui.chestPad) h += keypad("Chefskod", "Bekräfta att familjen har skänkt " + Math.round(C.goal * C.kr) + " kr.") + '<button type="button" class="link" data-a="chestcancel">Avbryt</button>';
      else h += '<button type="button" class="primary" data-a="chestdone">Vi har skänkt pengarna!</button>';
    }
    if (C.log.length) h += '<section class="panel"><h3>Det har vi skänkt</h3>' + C.log.map(function (l) { return "<p>💛 " + new Date(l.date).toLocaleDateString("sv-SE") + ": " + l.kr + " kr till " + esc(l.cause.toLowerCase()) + "</p>"; }).join("") + "</section>";
    h += '<p class="small muted">Chefen: ett mynt är värt ' + C.kr + " kr och målet är " + C.goal + " mynt. Ändra det under Chefens inställningar.</p>";
    return h;
  }

  function viewSettings() {
    var h = '<div class="top"><button type="button" class="ghost" data-a="home">← Högkvarteret</button></div><h1>Chefens inställningar</h1>';
    if (!ui.settingsOpen) return h + keypad("Skriv chefskoden", null);
    if (ui.padMode === "new1" || ui.padMode === "new2") return h + keypad(ui.padMode === "new2" ? "Skriv den nya koden igen" : "Välj en ny chefskod", null);
    h += '<section class="panel"><h3>Chefskod</h3><button type="button" data-a="newcode">Byt chefskod</button></section>';
    h += '<section class="panel"><h3>Skattkistan</h3><p>Hur mycket är ett mynt värt i kronor?</p><div class="row">' + [0.5, 1, 2, 5].map(function (v) { return '<button type="button" class="' + (state.chest.kr === v ? "sel" : "") + '" data-a="chestset" data-k="kr" data-v="' + v + '">' + String(v).replace(".", ",") + " kr</button>"; }).join("") +
      '</div><p>Hur många mynt behövs för att kistan ska bli full?</p><div class="row">' + [50, 100, 200, 300].map(function (v) { return '<button type="button" class="' + (state.chest.goal === v ? "sel" : "") + '" data-a="chestset" data-k="goal" data-v="' + v + '">' + v + " mynt (" + Math.round(v * state.chest.kr) + " kr)</button>"; }).join("") + "</div></section>";
    h += '<section class="panel"><h3>Spara framsteg</h3><p>Skapa en spara-kod och för över den till en annan enhet. Agenter, poäng, märken, mynt, lyan, skattkistan och chefskoden följer med. Bilder och ljud från uppdragen följer inte med.</p>' +
      (ui.exportCode ? '<textarea class="code" id="exportbox" readonly aria-label="Spara-kod">' + esc(ui.exportCode) + '</textarea><div class="row"><button type="button" class="primary" data-a="copycode">Kopiera koden</button><button type="button" data-a="savecode">Spara som fil</button></div><p class="small muted">Koden innehåller barnens namn och bilder. Skicka den bara till dig själv.</p>'
        : '<button type="button" class="primary" data-a="makecode">Skapa spara-kod</button>') + "</section>";
    h += '<section class="panel"><h3>Ladda framsteg</h3><p>Klistra in en spara-kod eller välj en sparad fil.</p><textarea class="code" id="importbox" aria-label="Klistra in spara-kod" placeholder="SPIONLIGAN1:…"></textarea>' +
      '<div class="row"><label class="btn pick ghost">Välj fil<input type="file" accept=".txt,.json,text/plain" data-kind="savefile" aria-label="Välj sparad fil"></label>' +
      (ui.confirmImport ? '<button type="button" style="background:var(--coral);color:#021015" data-a="doimport">Ja, ersätt allt på den här enheten</button><button type="button" class="ghost" data-a="noimport">Avbryt</button>'
        : '<button type="button" class="primary" data-a="askimport">Ladda framsteg</button>') + "</div>" +
      (ui.confirmImport ? '<p class="small muted">Det som finns på den här enheten nu skrivs över.</p>' : "") + "</section>";
    h += '<section class="panel"><h3>Börja om</h3><p class="muted">Tar bort alla agenter, uppdrag, bilder och ljud på den här enheten.</p>' +
      (ui.confirmReset ? '<div class="row"><button type="button" style="background:var(--coral);color:var(--night)" data-a="reset">Ja, ta bort allt</button><button type="button" class="ghost" data-a="noreset">Avbryt</button></div>'
        : '<button type="button" class="ghost" data-a="askreset">Börja om från början</button>') + "</section>";
    return h;
  }

  function render() {
    var app = document.getElementById("app");
    app.innerHTML = ui.view === "setup" ? viewSetup() : ui.view === "settings" ? viewSettings() : ui.view === "trophy" ? viewTrophy() : ui.view === "album" ? viewAlbum() : ui.view === "lya" ? viewLya() : ui.view === "chest" ? viewChest() : ui.view === "mission" ? viewMission() : viewHome();
  }
  function goto(view) { ui.view = view; ui.msg = ""; ui.pad = ""; render(); window.scrollTo(0, 0); }

  /* ---------- Rapportkort ---------- */
  function makeReportCard(mid) {
    var m = mission(mid), s = state.sessions[mid], keys = [];
    if (s && s.data && s.data.media) keys = Object.keys(s.data.media).filter(function (k) { return k.indexOf("ora:") !== 0 && urls[k]; }).slice(0, 4);
    var W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H; var c = cv.getContext("2d");
    return (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      return Promise.all(keys.map(function (k) { return loadImg(urls[k]); }).concat(state.agents.map(function (a) { return loadImg(a.selfie); })));
    }).then(function (imgs) {
      var photos = imgs.slice(0, keys.length), faces = imgs.slice(keys.length);
      c.fillStyle = "#06222b"; c.fillRect(0, 0, W, H);
      c.textAlign = "center"; c.fillStyle = "#19b9d6"; c.font = '800 70px "Oxanium", sans-serif'; c.fillText("Rapport från Spionligan", W / 2, 110);
      c.fillStyle = "#f8f3e6"; c.font = '800 54px "Oxanium", sans-serif'; c.fillText(m.badge + " " + m.title + " – klart!", W / 2, 190);
      var n = state.agents.length || 1, gap = W / (n + 1);
      state.agents.forEach(function (a, i) {
        var x = gap * (i + 1), y = 320;
        c.save(); c.beginPath(); c.arc(x, y, 90, 0, Math.PI * 2); c.closePath();
        if (faces[i]) { c.clip(); c.drawImage(faces[i], x - 90, y - 90, 180, 180); } else { c.fillStyle = "#26407a"; c.fill(); c.fillStyle = "#19b9d6"; c.font = '800 90px "Oxanium", sans-serif'; c.textBaseline = "middle"; c.fillText((a.codename || "?").charAt(0).toUpperCase(), x, y + 6); c.textBaseline = "alphabetic"; }
        c.restore(); c.beginPath(); c.arc(x, y, 90, 0, Math.PI * 2); c.lineWidth = 8; c.strokeStyle = "#19b9d6"; c.stroke();
        c.fillStyle = "#f8f3e6"; c.font = '800 38px "Oxanium", sans-serif'; c.fillText(agentLabel(a), x, y + 140);
      });
      var top = 520, cell = 440, pad = 40, x0 = (W - (cell * 2 + pad)) / 2;
      photos.forEach(function (img, i) {
        if (!img) return;
        var x = x0 + (i % 2) * (cell + pad), y = top + Math.floor(i / 2) * (cell * 0.75 + pad), w = cell, h = cell * 0.75;
        var r = Math.max(w / img.width, h / img.height), sw = w / r, sh = h / r;
        c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h); c.restore();
        c.lineWidth = 6; c.strokeStyle = "#f8f3e6"; c.strokeRect(x, y, w, h);
      });
      if (!photos.length) { c.fillStyle = "#b8c2dc"; c.font = '700 40px "Exo 2", sans-serif'; c.fillText("Uppdraget är godkänt av Chefen!", W / 2, 750); }
      c.fillStyle = "#b8c2dc"; c.font = '700 34px "Exo 2", sans-serif';
      c.fillText(new Date(state.done[mid] || Date.now()).toLocaleDateString("sv-SE") + " · Nivå: " + level().name + " · " + (state.pts || 0) + " poäng", W / 2, H - 70);
      return new Promise(function (res) { cv.toBlob(res, "image/png"); });
    });
  }

  /* ---------- Certifikat ---------- */
  function loadImg(src) { return new Promise(function (res) { if (!src) return res(null); var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
  function makeCert(kind, mid, a) {
    var m = kind === "diploma" ? { title: "Alla uppdrag", badge: "🏅", color: "#b45309" } : mission(mid);
    var W = 1240, H = 1754, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var c = cv.getContext("2d");
    return (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { return loadImg(a.selfie); }).then(function (img) {
      c.fillStyle = "#fffdf6"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "#06222b"; c.lineWidth = 28; c.strokeRect(50, 50, W - 100, H - 100);
      c.strokeStyle = "#19b9d6"; c.lineWidth = 8; c.strokeRect(92, 92, W - 184, H - 184);
      c.textAlign = "center"; c.fillStyle = "#06222b";
      c.font = '800 96px "Oxanium", sans-serif'; c.fillText("SPIONLIGAN", W / 2, 250);
      c.font = '700 54px "Exo 2", sans-serif'; c.fillStyle = "#555"; c.fillText(kind === "diploma" ? "Diplom" : "Märke", W / 2, 330);
      // märke
      c.beginPath(); c.arc(W / 2, 640, 230, 0, Math.PI * 2); c.fillStyle = m.color; c.fill();
      c.lineWidth = 26; c.strokeStyle = "#19b9d6"; c.stroke();
      c.font = '240px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; c.textBaseline = "middle"; c.fillText(m.badge, W / 2, 655); c.textBaseline = "alphabetic";
      // selfie
      var y = 1020;
      c.save(); c.beginPath(); c.arc(W / 2, y, 135, 0, Math.PI * 2); c.closePath();
      if (img) { c.clip(); c.drawImage(img, W / 2 - 135, y - 135, 270, 270); }
      else { c.fillStyle = "#26407a"; c.fill(); c.fillStyle = "#19b9d6"; c.font = '800 140px "Oxanium", sans-serif'; c.textBaseline = "middle"; c.fillText((a.codename || "?").charAt(0).toUpperCase(), W / 2, y + 10); c.textBaseline = "alphabetic"; }
      c.restore();
      c.beginPath(); c.arc(W / 2, y, 135, 0, Math.PI * 2); c.lineWidth = 12; c.strokeStyle = "#06222b"; c.stroke();
      c.fillStyle = "#06222b"; c.font = '800 92px "Oxanium", sans-serif'; c.fillText(agentLabel(a), W / 2, 1250);
      c.font = '700 46px "Exo 2", sans-serif'; c.fillStyle = "#444"; c.fillText(a.name + ", " + a.age + " år", W / 2, 1320);
      c.fillStyle = "#06222b"; c.font = '700 50px "Exo 2", sans-serif';
      if (kind === "diploma") { c.fillText("är utnämnd till", W / 2, 1420); c.font = '800 96px "Oxanium", sans-serif'; c.fillText("MÄSTERAGENT", W / 2, 1520); }
      else { c.fillText("har klarat", W / 2, 1420); c.font = '800 80px "Oxanium", sans-serif'; c.fillText(m.title, W / 2, 1510); }
      var dt = new Date(state.done[mid] || Date.now());
      c.font = '700 38px "Exo 2", sans-serif'; c.fillStyle = "#555"; c.textAlign = "left";
      c.fillText(dt.toLocaleDateString("sv-SE"), 150, 1620); c.fillText("Godkänt av Chefen", 150, 1668);
      // stämpel
      c.save(); c.translate(W - 290, 1610); c.rotate(-0.25); c.textAlign = "center";
      c.beginPath(); c.arc(0, 0, 110, 0, Math.PI * 2); c.lineWidth = 10; c.strokeStyle = "#e23d3d"; c.stroke();
      c.fillStyle = "#e23d3d"; c.font = '800 46px "Oxanium", sans-serif'; c.textBaseline = "middle"; c.fillText("GODKÄND", 0, 4); c.restore();
      return new Promise(function (res) { cv.toBlob(res, "image/png"); });
    });
  }

