  /* ---------- Händelser ---------- */
  var actions = {
    speak: function (el) {
      var key = el.dataset.say, m = ui.mission && mission(ui.mission);
      var t = key === "brief" ? m.brief : key === "field" ? m.field : el.parentNode.querySelector("p").textContent;
      speak(t);
    },
    key: function (el) {
      var k = el.dataset.k; ui.msg = "";
      if (k === "del") ui.pad = ui.pad.slice(0, -1); else if (ui.pad.length < 4) ui.pad += k;
      render();
      if (ui.pad.length === 4) setTimeout(padDone, 160);
    },
    open: function (el) {
      var mid = el.dataset.mid; ui.mission = mid; ui.showPad = false; ui.reveal = {}; ui.lastGain = null;
      var s = sess(mid); save();
      if (s.data.media) ensureMedia(Object.keys(s.data.media));
      goto("mission");
    },
    replay: function (el) {
      var mid = el.dataset.mid; delete state.sessions[mid]; save();
      dropMedia(mid + ":").then(function () { actions.open(el); });
    },
    home: function () { ui.showPad = false; goto("home"); },
    trophy: function () { ui.lastCert = null; goto("trophy"); },
    album: function () { goto("album"); },
    lya: function () { goto("lya"); },
    chest: function () { ui.chestPad = false; goto("chest"); },
    give: function (el) {
      var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]; if (!a) return;
      var L = lya(a), n = Number(el.dataset.n); if (L.coins < n) return;
      L.coins -= n; state.chest.coins += n; state.chest.by[a.id] = (state.chest.by[a.id] || 0) + n;
      save(); render(); toast("💛 Tack, " + agentLabel(a) + "! " + n + " mynt i skattkistan.");
    },
    vote: function (el) { state.chest.votes[el.dataset.aid] = el.dataset.c; save(); render(); },
    chestdone: function () { ui.chestPad = true; ui.padMode = "chest"; ui.pad = ""; ui.msg = ""; render(); },
    chestcancel: function () { ui.chestPad = false; ui.pad = ""; ui.msg = ""; render(); },
    chestset: function (el) { state.chest[el.dataset.k] = Number(el.dataset.v); save(); render(); },
    lyaagent: function (el) { ui.lyaAgent = el.dataset.aid; render(); },
    buy: function (el) {
      var a = state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]; if (!a) return;
      var L = lya(a), it = shopItem(el.dataset.id); if (!it || L.coins < it.price || L.owned.indexOf(it.id) >= 0) return;
      L.coins -= it.price; L.owned.push(it.id);
      if (it.kind === "wall" && L.wall.length < 4) L.wall.push(it.id);
      else if (it.kind === "floor" && L.floor.length < 4) L.floor.push(it.id);
      else if (it.kind === "hat" || it.kind === "eyes" || it.kind === "cape") L.wear = it.id;
      save(); render(); toast(it.em + " " + it.name + " är din!");
    },
    place: function (el) {
      var L = lya(state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]), it = shopItem(el.dataset.id);
      var list = it.kind === "wall" ? L.wall : L.floor;
      if (list.length >= 4) { toast("Rummet är fullt där. Plocka bort något först."); return; }
      list.push(it.id); save(); render();
    },
    unplace: function (el) {
      var L = lya(state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]);
      (el.dataset.kind === "wall" ? L.wall : L.floor).splice(Number(el.dataset.i), 1); save(); render();
    },
    wear: function (el) { var L = lya(state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]); L.wear = L.wear === el.dataset.id ? null : el.dataset.id; save(); render(); },
    wallc: function (el) { var L = lya(state.agents.filter(function (x) { return x.id === ui.lyaAgent; })[0]); L.color = el.dataset.c; save(); render(); },
    timepick: function (el) { sess(ui.mission).data.timeChoice = Number(el.dataset.v); save(); render(); },
    start: function () {
      var s = sess(ui.mission);
      if (s.data.timeChoice) s.data.timer = { sec: s.data.timeChoice, start: Date.now() }; else delete s.data.timer;
      s.step = "tasks"; save(); goto("mission");
    },
    bonus: function () { var d = sess(ui.mission).data; d.bonus = !d.bonus; save(); render(); },
    ai: function (el) {
      var key = el.dataset.k, pr = el.dataset.p, d = sess(ui.mission).data;
      if (!sampleFn) return;
      el.disabled = true; el.textContent = "🦉 Uggla tittar…";
      getBlob(key).then(function (b) {
        if (!b) throw { code: "no_image" };
        return sampleFn('Du är Kapten Uggla, en snäll uggla i en agentlek för barn som är 5–10 år. Barnet fick uppdraget: "' + pr + '". Titta på bilden. Svara med EN kort och glad mening på enkel svenska, högst 15 ord, riktad direkt till barnet. Om saken stämmer med uppdraget: beröm och nämn vad du ser. Om den inte stämmer eller du är osäker: ge en vänlig ledtråd. Beskriv inte personer på bilden.', { images: [b], modelTier: "quick" });
      }).then(function (r) { if (!d.ai) d.ai = {}; d.ai[key] = r.text.trim(); save(); render(); })
        .catch(function (e) {
          var c = e && e.code;
          if (c === "not_granted" || c === "images_unavailable" || c === "sampling_disabled" || c === "not_declared") aiOK = false;
          toast(c === "rate_limited" ? "Uggla behöver vila en stund. Försök igen snart." : "Uggla kunde inte titta på bilden just nu.");
          render();
        });
    },
    rcard: function (el) {
      var mid = el.dataset.mid; el.disabled = true; el.textContent = "Skapar…";
      makeReportCard(mid).then(function (blob) {
        if (!blob) throw new Error("bild");
        if (!ui.reportPrev) ui.reportPrev = {};
        if (ui.reportPrev[mid]) URL.revokeObjectURL(ui.reportPrev[mid]);
        ui.reportPrev[mid] = URL.createObjectURL(blob); render();
        if (downloads) return downloads.save({ filename: "rapport-" + mid + ".png", data: blob }).catch(function (e) {
          if (e && e.code === "declined") return; toast("Det gick inte att dela. Håll fingret på bilden i stället.");
        });
      }).catch(function () { toast("Det gick inte att skapa rapportkortet."); render(); });
    },
    settings: function () { ui.settingsOpen = false; ui.confirmReset = false; ui.exportCode = null; ui.confirmImport = false; ui.padMode = "settings"; goto("settings"); },
    go: function (el) { var s = sess(ui.mission); s.step = el.dataset.s; ui.showPad = false; save(); goto("mission"); },
    continue: function () {
      if (!canContinue(ui.mission)) return;
      var s = sess(ui.mission);
      if (ui.mission === "reg") {
        state.agents = s.data.agents.map(function (a) { return Object.assign({}, a, { name: a.name.trim(), codename: a.codename.trim() }); });
        // nya roller ger nya mattetal nästa gång
        if (state.sessions.kassaskap && state.sessions.kassaskap.step === "brief") delete state.sessions.kassaskap;
      }
      if (s.data.timer && !s.data.timer.finishedAt) { s.data.timer.finishedAt = Date.now(); s.data.timer.beat = timeLeft(s.data.timer) > 0; }
      s.step = "field"; save(); goto("mission");
    },
    pick: function (el) {
      var v = el.dataset.num ? Number(el.dataset.v) : el.dataset.v;
      setPath(sess(ui.mission).data, el.dataset.f, v); save(); render();
    },
    digit: function (el) { setPath(sess(ui.mission).data, el.dataset.f, Number(el.dataset.v)); save(); render(); },
    found: function (el) { var d = sess(ui.mission).data; if (!d.found) d.found = {}; d.found[el.dataset.k] = !d.found[el.dataset.k]; save(); render(); },
    skip: function (el) { var d = sess(ui.mission).data; d.skip[el.dataset.k] = !d.skip[el.dataset.k]; save(); render(); },
    addagent: function () { sess("reg").data.agents.push(newAgent()); save(); render(); },
    rmagent: function (el) { sess("reg").data.agents.splice(Number(el.dataset.i), 1); save(); render(); },
    showpad: function () { ui.showPad = true; ui.padMode = "approve"; ui.pad = ""; ui.msg = ""; render(); },
    hidepad: function () { ui.showPad = false; ui.pad = ""; ui.msg = ""; render(); },
    play: function (el) {
      var v = document.getElementById("v" + el.dataset.i); if (!v) return;
      try { v.currentTime = 0; } catch (e) {}
      var p = v.play(); if (p && p.catch) p.catch(function () { toast("Ljudet gick inte att spela. Tryck på Visa svaret och spela där."); });
    },
    reveal: function (el) { var i = el.dataset.i; ui.reveal[i] = !ui.reveal[i]; render(); },
    cert: function (el) {
      var a = state.agents.filter(function (x) { return x.id === el.dataset.aid; })[0]; if (!a) return;
      var kind = el.dataset.kind, mid = el.dataset.mid, key = kind + ":" + mid + ":" + a.id;
      el.disabled = true; el.textContent = "Skapar…";
      makeCert(kind, mid, a).then(function (blob) {
        if (!blob) throw new Error("bild");
        if (ui.certs[key]) URL.revokeObjectURL(ui.certs[key]);
        ui.certs[key] = URL.createObjectURL(blob); ui.lastCert = key; render();
        if (downloads) {
          var name = (kind === "diploma" ? "diplom-mastaragent-" : "marke-" + mid + "-") + (a.codename || "agent").toLowerCase().replace(/[^a-z0-9åäö]+/g, "-") + ".png";
          return downloads.save({ filename: name, data: blob }).then(function () { toast("Sparat! Skriv ut bilden i A4."); }).catch(function (e) {
            if (e && e.code === "declined") return;
            toast("Det gick inte att spara. Håll fingret på bilden eller ta en skärmdump.");
          });
        }
      }).catch(function () { toast("Det gick inte att skapa bilden. Försök igen."); render(); });
    },
    newcode: function () { ui.padMode = "new1"; ui.pad = ""; ui.msg = ""; render(); },
    makecode: function () { ui.exportCode = exportCode(); render(); },
    copycode: function () {
      var t = ui.exportCode;
      try {
        navigator.clipboard.writeText(t).then(function () { toast("Koden är kopierad."); }, function () { selectBox(); });
      } catch (e) { selectBox(); }
      function selectBox() { var b = document.getElementById("exportbox"); if (b) { b.focus(); b.select(); } toast("Markera koden och kopiera den."); }
    },
    savecode: function () {
      var name = "spionligan-framsteg-" + new Date().toISOString().slice(0, 10) + ".txt";
      if (downloads) { downloads.save({ filename: name, data: ui.exportCode }).catch(function (e) { if (!e || e.code !== "declined") toast("Det gick inte att spara filen. Kopiera koden i stället."); }); return; }
      try {
        var u = URL.createObjectURL(new Blob([ui.exportCode], { type: "text/plain" })), a = document.createElement("a");
        a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      } catch (e) { toast("Det gick inte att spara filen. Kopiera koden i stället."); }
    },
    askimport: function () {
      var b = document.getElementById("importbox"); ui.importRaw = b ? b.value : ui.importRaw;
      try { importCode(ui.importRaw); ui.confirmImport = true; render(); var b2 = document.getElementById("importbox"); if (b2) b2.value = ui.importRaw; }
      catch (e) { toast("Koden fungerar inte. Kontrollera att hela koden kom med."); }
    },
    noimport: function () { ui.confirmImport = false; ui.importRaw = ""; render(); },
    doimport: function () {
      try {
        state = importCode(ui.importRaw); save();
        Object.keys(urls).forEach(function (k) { URL.revokeObjectURL(urls[k]); delete urls[k]; });
        ui.confirmImport = false; ui.importRaw = ""; ui.exportCode = null; ui.settingsOpen = false; ui.padMode = null;
        goto("home"); toast("Framstegen är laddade. Välkomna tillbaka, agenter!");
      } catch (e) { toast("Koden fungerar inte. Kontrollera att hela koden kom med."); }
    },
    askreset: function () { ui.confirmReset = true; render(); },
    noreset: function () { ui.confirmReset = false; render(); },
    reset: function () {
      try { localStorage.removeItem(LS); } catch (e) {}
      Object.keys(urls).forEach(function (k) { URL.revokeObjectURL(urls[k]); delete urls[k]; });
      idbClear();
      state = blank(); ui.padMode = "setup1"; ui.settingsOpen = false; ui.confirmReset = false; goto("setup");
    }
  };

  function padDone() {
    var p = ui.pad; ui.pad = "";
    switch (ui.padMode) {
      case "setup1": ui.padFirst = p; ui.padMode = "setup2"; break;
      case "setup2":
        if (p === ui.padFirst) { state.chef = p; save(); ui.padMode = null; goto("home"); toast("Chefskoden är sparad."); return; }
        ui.msg = "Koderna var inte samma. Börja om."; ui.padMode = "setup1"; break;
      case "approve":
        if (p === state.chef) {
          var bon = !!sess(ui.mission).data.bonus;
          state.done[ui.mission] = new Date().toISOString(); state.bonus[ui.mission] = bon || !!state.bonus[ui.mission];
          var tmr = sess(ui.mission).data.timer, blitz = !!(tmr && tmr.beat);
          if (!state.blitz) state.blitz = {};
          if (blitz) state.blitz[ui.mission] = true;
          state.agents.forEach(function (a) { lya(a).coins += 10 + (bon ? 5 : 0) + (blitz ? 5 : 0); });
          if (bon) state.chest.coins += 5;
          var before = level().name; state.pts = (state.pts || 0) + 10 + (bon ? 5 : 0) + (blitz ? 5 : 0); ui.lastGain = { blitz: blitz, p: 10 + (bon ? 5 : 0) + (blitz ? 5 : 0), up: level().name !== before ? level().name : null };
          sess(ui.mission).step = "reward"; ui.showPad = false; save(); goto("mission"); return;
        }
        ui.msg = "Fel kod. Bara Chefen kan godkänna."; break;
      case "chest":
        if (p === state.chef) {
          var C = state.chest, cc = chestCause();
          C.log.push({ date: new Date().toISOString(), kr: Math.round(C.goal * C.kr), cause: cc.cause.name });
          C.coins = Math.max(0, C.coins - C.goal); C.by = {}; ui.chestPad = false; save(); toast("💛 Tack! Ni är nu Hjärteagenter.");
        } else ui.msg = "Fel kod.";
        break;
      case "settings":
        if (p === state.chef) { ui.settingsOpen = true; ui.padMode = null; } else ui.msg = "Fel kod."; break;
      case "new1": ui.padFirst = p; ui.padMode = "new2"; break;
      case "new2":
        if (p === ui.padFirst) { state.chef = p; save(); ui.padMode = null; toast("Den nya chefskoden är sparad."); }
        else { ui.msg = "Koderna var inte samma. Börja om."; ui.padMode = "new1"; } break;
    }
    render();
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-a]"); if (!el || el.disabled) return;
    var fn = actions[el.dataset.a]; if (fn) fn(el, e);
  });
  document.addEventListener("input", function (e) {
    var el = e.target; if (!el.dataset || !el.dataset.f || el.type !== "text") return;
    setPath(sess(ui.mission).data, el.dataset.f, el.value); save();
    var b = document.getElementById("continue"); if (b) b.disabled = !canContinue(ui.mission);
  });
  document.addEventListener("change", function (e) {
    var el = e.target; if (el.type !== "file" || !el.files || !el.files[0]) return;
    if (el.dataset.kind === "savefile") {
      var fr = new FileReader();
      fr.onload = function () { ui.importRaw = String(fr.result || ""); var b = document.getElementById("importbox"); if (b) b.value = ui.importRaw; toast("Filen är inläst. Tryck på Ladda framsteg."); };
      fr.onerror = function () { toast("Det gick inte att läsa filen."); };
      fr.readAsText(el.files[0]); return;
    }
    var f = el.files[0], kind = el.dataset.kind, s = sess(ui.mission);
    toast("Sparar…");
    var job;
    if (kind === "selfie") {
      var ag = s.data.agents[Number(el.dataset.i)];
      job = shrink(f, 360, true).then(function (cv) { ag.selfie = cv.toDataURL("image/jpeg", 0.82); }).catch(function () {
        return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { ag.selfie = fr.result; res(); }; fr.onerror = rej; fr.readAsDataURL(f); });
      });
    } else if (kind === "image") {
      job = shrink(f, 1000, false).then(function (cv) { return new Promise(function (res) { cv.toBlob(res, "image/jpeg", 0.8); }); })
        .then(function (blob) { s.data.media[el.dataset.m] = true; return putMedia(el.dataset.m, blob); });
    } else {
      s.data.media[el.dataset.m] = true; job = putMedia(el.dataset.m, f);
    }
    job.then(function () { save(); render(); document.getElementById("toast").hidden = true; })
      .catch(function () { toast("Det gick inte att läsa filen. Försök igen."); });
  });

  setInterval(function () {
    if (ui.view !== "mission" || !ui.mission) return;
    var s = state.sessions[ui.mission]; if (!s || s.step !== "tasks" || !s.data.timer) return;
    var tm = s.data.timer, left = timeLeft(tm), el = document.getElementById("timer-t"), box = document.getElementById("timer");
    if (el) el.textContent = fmt(left);
    if (box) { box.classList.toggle("low", left > 0 && left <= 30); box.classList.toggle("over", left === 0); }
    if (left === 0 && !tm.expired && !tm.finishedAt) { tm.expired = true; save(); render(); toast("⏰ Tiden är slut! Fortsätt gärna ändå."); }
  }, 250);
  render();
