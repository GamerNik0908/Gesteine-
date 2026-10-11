/* Farm-Planer – Oberfläche */
(function () {
  const MF = window.MF;
  const $app = document.getElementById('app');
  const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString('de-DE');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------------------------------------------------------------- Speicher
  const store = {
    get(k, def) {
      try { const v = localStorage.getItem('mf:' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set(k, v) {
      try { localStorage.setItem('mf:' + k, JSON.stringify(v)); } catch (e) { /* privat/gesperrt */ }
    },
  };

  const STATUS = [
    { id: 'none', name: 'Nicht geplant' },
    { id: 'plan', name: 'Geplant' },
    { id: 'build', name: 'Im Bau' },
    { id: 'done', name: 'Fertig' },
  ];

  // ---------------------------------------------------------------- Bauplan-Cache
  const cache = {};
  function structure(farm, ti) {
    const k = farm.id + ':' + ti;
    if (!cache[k]) {
      const b = new MF.Build();
      farm.tiers[ti].build(b);
      cache[k] = b.done();
    }
    return cache[k];
  }

  // ---------------------------------------------------------------- Material-Berechnung
  const STACK = { sign: 16, bed: 1, water: 1, lava: 1, hcart: 1, minecart: 1, turtle_egg: 64 };
  function materials(s, tier, layer) {
    const map = new Map();
    const add = (key, data, n) => {
      if (!map.has(key)) map.set(key, Object.assign({ key, count: 0 }, data));
      map.get(key).count += n;
    };
    for (const b of s.blocks) {
      if (layer != null && b[1] !== layer) continue;
      const { base } = MF.parseKey(b[3]);
      const d = MF.BLOCKS[base];
      if (!d || d.noList) continue;
      const key = d.item || base;
      add(key, { name: d.listName || d.name, base, def: d, kind: 'block' }, 1);
    }
    for (const m of s.mobs) {
      if (layer != null && m[1] !== layer) continue;
      const d = MF.BLOCKS[m[3]];
      if (!d || d.noList) continue;
      add(m[3], { name: d.name, base: m[3], def: d, kind: d.craft ? 'craft' : 'mob' }, m[4]);
    }
    if (layer == null) {
      for (const [name, n, note] of tier.extras || []) add('x:' + name, { name, kind: 'extra', note }, n);
    }
    return [...map.values()];
  }

  function rawTotals(s) {
    const raw = {};
    let filler = 0;
    const direct = {};
    const addRaw = (d, n) => {
      for (const [k, v] of Object.entries(d.raw)) raw[k] = (raw[k] || 0) + v * n;
    };
    for (const b of s.blocks) {
      const { base } = MF.parseKey(b[3]);
      const d = MF.BLOCKS[base];
      if (!d || d.noList) continue;
      if (d.raw) addRaw(d, 1);
      else if (d.flex && !d.raw) filler++;
      else {
        const name = d.listName || d.name;
        direct[name] = (direct[name] || 0) + 1;
      }
    }
    for (const m of s.mobs) {
      const d = MF.BLOCKS[m[3]];
      if (d && d.raw) addRaw(d, m[4]);
    }
    return { raw, filler, direct };
  }

  function stacks(n, key) {
    const size = STACK[key] || 64;
    if (size === 1 || n < size) return '';
    const st = Math.floor(n / size), rest = n % size;
    return st + (st === 1 ? ' Stack' : ' Stacks') + (rest ? ' + ' + rest : '');
  }

  // ---------------------------------------------------------------- Kleine Bausteine
  function iconCanvas(key, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    c.className = 'bicon';
    const d = MF.BLOCKS[key];
    const ctx = c.getContext('2d');
    if (d && (d.entity || d.shape === 'marker')) {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.45)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (d) MF.drawTexture(ctx, key, size);
    return c;
  }
  function iconHTML(key) {
    return '<span class="bicon-slot" data-icon="' + esc(key) + '"></span>';
  }
  function hydrateIcons(root, size) {
    root.querySelectorAll('.bicon-slot[data-icon]').forEach((el) => {
      if (el.firstChild) return;
      el.appendChild(iconCanvas(el.dataset.icon, size || 22));
    });
  }
  function levelChip(level, small) {
    const L = MF.LEVELS[level];
    return '<span class="lvl' + (small ? ' lvl-sm' : '') + '" style="--lvl:' + L.color + '">' + L.name + '</span>';
  }
  function diffPips(n) {
    let s = '<span class="pips" title="Schwierigkeit ' + n + ' von 5">';
    for (let i = 1; i <= 5; i++) s += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return s + '</span>';
  }
  function bestRate(farm) {
    let best = null;
    for (const t of farm.tiers) {
      const r = t.rates[0];
      if (r && (!best || r[1] > best[1])) best = r;
    }
    return best;
  }

  // ---------------------------------------------------------------- Router
  let viewer = null;
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/');
    if (viewer && parts[0] !== 'farm') { viewer.destroy(); viewer = null; }
    window.scrollTo(0, 0);
    if (parts[0] === 'farm') {
      const farm = MF.FARMS.find((f) => f.id === parts[1]);
      if (farm) return renderFarm(farm, Math.min(+parts[2] || 0, farm.tiers.length - 1));
    }
    if (parts[0] === 'meine') return renderMine();
    if (parts[0] === 'hilfe') return renderHelp();
    renderHome();
  }
  window.addEventListener('hashchange', route);

  // ---------------------------------------------------------------- Startseite
  let homeFilter = { q: '', cat: 'Alle' };
  function farmCard(f) {
    const st = store.get('status:' + f.id, null);
    const best = bestRate(f);
    const levels = [...new Set(f.tiers.map((t) => t.level))];
    const badge = st && st.state !== 'none' ? '<span class="status-badge st-' + st.state + '">' + STATUS.find((s) => s.id === st.state).name + '</span>' : '';
    return (
      '<a class="card farm-card" href="#/farm/' + f.id + '/' + (st && st.tier != null ? st.tier : 0) + '" style="--accent:' + f.color + '">' +
      '<div class="card-top"><span class="farm-icon">' + f.icon + '</span>' + badge + '</div>' +
      '<h3>' + esc(f.name) + '</h3>' +
      '<p class="muted small">' + esc(f.desc) + '</p>' +
      '<div class="card-levels">' + levels.map((l) => levelChip(l, true)).join('') + '</div>' +
      '<div class="card-foot"><span class="muted small">bis zu</span> <b>' + fmt(best[1]) + '</b> <span class="muted small">' + esc(best[0]) + ' / h</span></div>' +
      '</a>'
    );
  }

  function renderHome() {
    const variants = MF.FARMS.reduce((n, f) => n + f.tiers.length, 0);
    $app.innerHTML =
      '<section class="hero">' +
      '<div class="hero-text"><h1>Baue jede Farm – Schicht für Schicht</h1>' +
      '<p>' + MF.FARMS.length + ' Farmen in ' + variants + ' Varianten: von der Anfänger-Farm, für die man fast nichts braucht, bis zur Endgame-Fabrik. Mit Ertrag pro Stunde, Kosten, Materialliste, 3D-Ansicht und Schematic-Download.</p></div>' +
      '<div class="hero-search"><input id="q" type="search" placeholder="Farm suchen … (z. B. Eisen, Schwarzpulver, Essen)" value="' + esc(homeFilter.q) + '" autocomplete="off"></div>' +
      '</section>' +
      '<div class="chips" id="cats">' + ['Alle'].concat(MF.CATEGORIES).map((c) => '<button class="chip' + (c === homeFilter.cat ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>').join('') + '</div>' +
      '<div id="grid"></div>';
    const draw = () => {
      const q = homeFilter.q.toLowerCase();
      const list = MF.FARMS.filter((f) => (homeFilter.cat === 'Alle' || f.cat === homeFilter.cat) && (!q || (f.name + ' ' + f.product + ' ' + f.desc + ' ' + f.tiers.map((t) => t.name + ' ' + t.rates.map((r) => r[0]).join(' ')).join(' ')).toLowerCase().includes(q)));
      const grid = document.getElementById('grid');
      if (!list.length) { grid.innerHTML = '<p class="empty">Keine Farm gefunden.</p>'; return; }
      const cats = homeFilter.cat === 'Alle' ? MF.CATEGORIES : [homeFilter.cat];
      grid.innerHTML = cats.map((c) => {
        const items = list.filter((f) => f.cat === c);
        if (!items.length) return '';
        return '<h2 class="section-title">' + c + '</h2><div class="grid">' + items.map(farmCard).join('') + '</div>';
      }).join('');
    };
    draw();
    document.getElementById('q').addEventListener('input', (e) => { homeFilter.q = e.target.value; draw(); });
    document.getElementById('cats').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      homeFilter.cat = b.dataset.cat;
      document.querySelectorAll('#cats .chip').forEach((c) => c.classList.toggle('active', c === b));
      draw();
    });
  }

  // ---------------------------------------------------------------- Meine Farmen
  function renderMine() {
    const mine = MF.FARMS.map((f) => ({ f, st: store.get('status:' + f.id, null) })).filter((x) => x.st && x.st.state !== 'none');
    let html = '<section class="page-head"><h1>Meine Farmen</h1><p class="muted">Setze auf einer Farm-Seite den Status auf „Geplant", „Im Bau" oder „Fertig" – dann erscheint sie hier mit deinem Fortschritt.</p></section>';
    if (!mine.length) html += '<p class="empty">Noch keine Farm markiert. <a href="#/">Zu allen Farmen →</a></p>';
    for (const s of STATUS.slice(1)) {
      const items = mine.filter((x) => x.st.state === s.id);
      if (!items.length) continue;
      html += '<h2 class="section-title">' + s.name + '</h2><div class="mine-list">';
      for (const { f, st } of items) {
        const t = f.tiers[st.tier] || f.tiers[0];
        const s2 = structure(f, st.tier || 0);
        const mats = materials(s2, t);
        const checks = store.get('todo:' + f.id + ':' + (st.tier || 0), {});
        const done = mats.filter((m) => checks[m.key]).length;
        const pct = mats.length ? Math.round((done / mats.length) * 100) : 0;
        const tot = t.rates.map((r) => fmt(r[1]) + ' ' + esc(r[0])).slice(0, 2).join(' · ');
        html += '<a class="card mine-row" href="#/farm/' + f.id + '/' + (st.tier || 0) + '"><span class="farm-icon">' + f.icon + '</span><div class="mine-main"><b>' + esc(f.name) + '</b> ' + levelChip(t.level, true) + '<div class="muted small">' + esc(t.name) + ' · ' + tot + ' pro Stunde</div><div class="bar"><i style="width:' + pct + '%"></i></div></div><span class="mine-pct">' + pct + '%</span></a>';
      }
      html += '</div>';
    }
    // Gesamt-Ertrag der fertigen Farmen
    const done = mine.filter((x) => x.st.state === 'done');
    if (done.length) {
      const sum = {};
      for (const { f, st } of done) for (const [item, n] of (f.tiers[st.tier] || f.tiers[0]).rates) sum[item] = (sum[item] || 0) + n;
      html += '<h2 class="section-title">Gesamtertrag deiner fertigen Farmen</h2><div class="card"><div class="rate-grid">' + Object.entries(sum).map(([k, v]) => '<div class="rate"><b>' + fmt(v) + '</b><span>' + esc(k) + ' / h</span></div>').join('') + '</div></div>';
    }
    $app.innerHTML = html;
  }

  // ---------------------------------------------------------------- Hilfe
  function renderHelp() {
    $app.innerHTML =
      '<section class="page-head"><h1>Hilfe</h1></section>' +
      '<div class="help card prose">' +
      '<h3>So benutzt du den Farm-Planer</h3><ol>' +
      '<li>Wähle eine Farm und oben die <b>Stufe</b> – von Anfänger bis Endgame.</li>' +
      '<li>Oben siehst du <b>Ertrag pro Stunde</b>, <b>laufende Kosten</b> (z. B. Knochenmehl, das du reinwerfen musst) und die <b>Baukosten</b> in Rohstoffen.</li>' +
      '<li>In der <b>3D-Ansicht</b> drehst du mit der linken Maustaste, verschiebst mit der rechten und zoomst mit dem Mausrad. Fährst du über einen Block, steht da, was es ist.</li>' +
      '<li>Mit dem <b>Schicht-Regler</b> gehst du Schicht für Schicht nach oben. „Bis Schicht" zeigt alles darunter abgedunkelt, „Nur Schicht" nur die aktuelle Ebene. Der <b>Schicht-Plan</b> zeigt die Ebene von oben wie ein Bauplan.</li>' +
      '<li>Die <b>To-Do-Liste</b> zeigt alle Blöcke. Hake ab, was du schon hast – das wird in deinem Browser gespeichert.</li>' +
      '<li>Blöcke mit dem Label <span class="tag tag-flex">austauschbar</span> kannst du durch etwas anderes ersetzen, z. B. Erde statt Bruchstein.</li></ol>' +
      '<h3>Schematic benutzen</h3><ul>' +
      '<li><b>.litematic</b> – für die Mod <i>Litematica</i>: Datei in den Ordner <code>.minecraft/schematics</code> legen, im Spiel mit <code>M</code> das Menü öffnen, „Load Schematics" und platzieren. Litematica zeigt dir dann die Blöcke als Geist im Spiel.</li>' +
      '<li><b>.schem</b> – für <i>WorldEdit</i>/<i>FAWE</i> (Server oder Einzelspieler): Datei in <code>config/worldedit/schematics</code> (Mod) oder <code>plugins/WorldEdit/schematics</code> (Server), dann <code>//schem load name</code> und <code>//paste</code>.</li>' +
      '<li>Tiere, Dorfbewohner und Loren sind <b>nicht</b> im Schematic – die musst du selbst hinbringen. Fließendes Wasser ebenfalls nicht: setze nur die Quellen.</li></ul>' +
      '<h3>Farben in der 3D-Ansicht</h3><ul>' +
      '<li>Dunkle Quadrate auf Blöcken = <b>Vorderseite</b> (z. B. wohin ein Trichter, Kolben oder Werfer zeigt, oder wohin der Beobachter schaut).</li>' +
      '<li>Gelber Diamant = <b>dein Stand-/AFK-Platz</b>. Pinker Diamant = hier entsteht das Produkt.</li>' +
      '<li>Farbige Kästen = Tiere, Mobs und Loren.</li></ul>' +
      '<h3>Wichtig</h3><p>Alle Raten sind Richtwerte für Java Edition 1.21 auf Schwierigkeit „Normal". Die Baupläne sind vereinfachte Nachbauten der bekannten Funktionsprinzipien. Große Farmen am besten zuerst in einer Kreativ-Testwelt ausprobieren.</p>' +
      '</div>';
  }

  // ---------------------------------------------------------------- Farm-Seite
  const ui = { view: '3d', mode: 'all', tab: 'todo', filter: 'all', layerOnly: false, hours: 1, mobs: true };

  function renderFarm(farm, ti) {
    const tier = farm.tiers[ti];
    const s = structure(farm, ti);
    const [W, H, L] = s.size;
    const st = store.get('status:' + farm.id, { state: 'none', tier: ti });
    const tot = rawTotals(s);
    const rawOrder = ['iron', 'gold', 'redstone', 'quartz', 'slime', 'string', 'log', 'cobble', 'sand', 'wool', 'coal', 'honeycomb', 'glowstone'];
    const costTop = rawOrder.filter((k) => tot.raw[k] > 0).slice(0, 3);
    const blockCount = s.blocks.filter((b) => { const d = MF.BLOCKS[MF.parseKey(b[3]).base]; return d && !d.noList; }).length;
    ui.layer = H - 1;

    $app.innerHTML =
      '<nav class="crumbs"><a href="#/">Alle Farmen</a> <span>›</span> <span>' + esc(farm.cat) + '</span></nav>' +
      '<section class="farm-head" style="--accent:' + farm.color + '">' +
      '<span class="farm-icon big">' + farm.icon + '</span>' +
      '<div class="farm-head-text"><h1>' + esc(farm.name) + '</h1><p class="muted">' + esc(farm.desc) + '</p></div>' +
      '<label class="status-select"><span class="muted small">Status</span><select id="status">' + STATUS.map((x) => '<option value="' + x.id + '"' + (st.state === x.id ? ' selected' : '') + '>' + x.name + '</option>').join('') + '</select></label>' +
      '</section>' +
      '<div class="tiers" role="tablist">' + farm.tiers.map((t, i) =>
        '<a role="tab" class="tier' + (i === ti ? ' active' : '') + '" href="#/farm/' + farm.id + '/' + i + '" style="--lvl:' + MF.LEVELS[t.level].color + '">' +
        '<span class="tier-level">' + MF.LEVELS[t.level].name + '</span><span class="tier-name">' + esc(t.name) + '</span>' + diffPips(t.difficulty) + '</a>').join('') + '</div>' +

      '<section class="stats">' +
      '<div class="stat stat-main"><span class="stat-label">Ertrag pro Stunde</span><div class="rate-list">' + tier.rates.map((r, i) => '<div class="' + (i ? 'rate-sub' : 'rate-big') + '"><b>' + fmt(r[1]) + '</b> ' + esc(r[0]) + '</div>').join('') + '</div></div>' +
      '<div class="stat"><span class="stat-label">Laufende Kosten / h</span>' + (tier.upkeep.length ? tier.upkeep.map((u) => '<div class="upk"><b>' + (u[1] ? fmt(u[1]) + ' ' : '') + esc(u[0]) + '</b>' + (u[2] ? '<span class="muted small">' + esc(u[2]) + '</span>' : '') + '</div>').join('') : '<div class="upk"><b class="good">Keine</b><span class="muted small">läuft komplett von selbst</span></div>') + '</div>' +
      '<div class="stat"><span class="stat-label">Baukosten (Rohstoffe)</span>' + (costTop.length ? costTop.map((k) => '<div class="upk"><b>' + fmt(Math.ceil(tot.raw[k])) + '</b> ' + MF.RAW[k] + '</div>').join('') : '<div class="upk"><b class="good">Fast nichts</b></div>') + '<button class="linkbtn" data-tab-go="raw">alle Rohstoffe →</button></div>' +
      '<div class="stat"><span class="stat-label">Größe</span><div class="upk"><b>' + W + ' × ' + L + '</b> Grundfläche</div><div class="upk"><b>' + H + '</b> Schichten hoch</div><div class="upk"><b>' + fmt(blockCount) + '</b> Blöcke</div></div>' +
      '<div class="stat calc"><span class="stat-label">Rechner</span><label class="small">Laufzeit: <b id="hrs">' + ui.hours + '</b> h</label><input type="range" id="hours" min="1" max="24" value="' + ui.hours + '"><div id="calc-out" class="small"></div></div>' +
      '</section>' +

      '<section class="main-grid">' +
      '<div class="card viewer-card">' +
      '<div class="viewer-bar">' +
      '<div class="seg" id="view-seg"><button data-view="3d">3D-Ansicht</button><button data-view="2d">Schicht-Plan</button></div>' +
      '<div class="seg" id="mode-seg"><button data-mode="all">Alles</button><button data-mode="upto">Bis Schicht</button><button data-mode="only">Nur Schicht</button></div>' +
      '</div>' +
      '<div class="viewer-wrap"><div id="v3d" class="v3d"></div><div id="v2d" class="v2d" hidden><canvas id="map"></canvas><div class="viewer-tip" id="maptip"></div></div>' +
      '<div class="view-btns"><button id="reset" title="Ansicht zurücksetzen">⟲</button><button id="top" title="Von oben">⬒</button><label class="mobtoggle" title="Tiere/Mobs anzeigen"><input type="checkbox" id="mobs"' + (ui.mobs ? ' checked' : '') + '> Mobs</label></div></div>' +
      '<div class="layer-ctl"><button id="ldown" aria-label="Schicht runter">▼</button><input type="range" id="layer" min="1" max="' + H + '" value="' + H + '"><button id="lup" aria-label="Schicht hoch">▲</button><span class="layer-label">Schicht <b id="lnum">' + H + '</b> / ' + H + '</span></div>' +
      '<div class="layer-legend" id="legend"></div>' +
      '<div class="downloads"><span class="muted small">Schematic herunterladen:</span><button class="btn" id="dl-lit">⬇ .litematic <small>Litematica</small></button><button class="btn" id="dl-schem">⬇ .schem <small>WorldEdit</small></button></div>' +
      '</div>' +

      '<div class="card side-card">' +
      '<div class="tabs" id="tabs"><button data-tab="todo">To-Do-Liste</button><button data-tab="raw">Rohstoffe</button><button data-tab="info">Erklärung</button></div>' +
      '<div id="tab-body"></div>' +
      '</div>' +
      '</section>';

    // Status
    document.getElementById('status').addEventListener('change', (e) => {
      store.set('status:' + farm.id, { state: e.target.value, tier: ti });
    });
    if (st.state !== 'none' && st.tier !== ti) {
      // Stufe merken, wenn man im Status ist
      store.set('status:' + farm.id, { state: st.state, tier: ti });
    }

    // Rechner
    const calc = () => {
      document.getElementById('hrs').textContent = ui.hours;
      let html = tier.rates.map((r) => '<div>+ <b>' + fmt(r[1] * ui.hours) + '</b> ' + esc(r[0]) + '</div>').join('');
      html += tier.upkeep.filter((u) => u[1]).map((u) => '<div class="neg">− <b>' + fmt(u[1] * ui.hours) + '</b> ' + esc(u[0]) + '</div>').join('');
      document.getElementById('calc-out').innerHTML = html;
    };
    document.getElementById('hours').addEventListener('input', (e) => { ui.hours = +e.target.value; calc(); });
    calc();

    // Viewer
    const v3d = document.getElementById('v3d');
    if (viewer) viewer.destroy();
    viewer = null;
    try {
      viewer = new MF.Viewer(v3d);
      viewer.showMobs = ui.mobs;
      viewer.mode = ui.mode;
      viewer.load(s);
    } catch (err) {
      v3d.innerHTML = '<p class="empty">3D-Ansicht nicht verfügbar (WebGL fehlt). Nutze den Schicht-Plan.</p>';
      ui.view = '2d';
    }

    const setLayer = (y) => {
      ui.layer = Math.max(0, Math.min(H - 1, y));
      document.getElementById('layer').value = ui.layer + 1;
      document.getElementById('lnum').textContent = ui.layer + 1;
      if (ui.mode === 'all' && ui.view === '3d' && document.activeElement && document.activeElement.id === 'layer') setMode('upto');
      if (viewer) viewer.setLayer(ui.layer, ui.mode);
      drawMap();
      drawLegend();
      if (ui.tab === 'todo' && ui.layerOnly) renderTab();
    };
    const setMode = (m) => {
      ui.mode = m;
      document.querySelectorAll('#mode-seg button').forEach((b) => b.classList.toggle('active', b.dataset.mode === m));
      if (viewer) viewer.setLayer(ui.layer, m);
    };
    const setView = (v) => {
      ui.view = v;
      document.querySelectorAll('#view-seg button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
      document.getElementById('v3d').hidden = v !== '3d';
      document.getElementById('v2d').hidden = v !== '2d';
      document.getElementById('mode-seg').style.visibility = v === '3d' ? 'visible' : 'hidden';
      document.querySelector('.view-btns').style.display = v === '3d' ? '' : 'none';
      if (v === '2d') drawMap();
      else if (viewer) viewer.resize();
    };
    document.getElementById('layer').addEventListener('input', (e) => setLayer(+e.target.value - 1));
    document.getElementById('lup').addEventListener('click', () => { if (ui.mode === 'all') setMode('upto'); setLayer(ui.layer + 1); });
    document.getElementById('ldown').addEventListener('click', () => { if (ui.mode === 'all') setMode('upto'); setLayer(ui.layer - 1); });
    document.getElementById('mode-seg').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
    document.getElementById('view-seg').addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
    document.getElementById('reset').addEventListener('click', () => viewer && viewer.resetView());
    document.getElementById('top').addEventListener('click', () => viewer && viewer.resetView(true));
    document.getElementById('mobs').addEventListener('change', (e) => { ui.mobs = e.target.checked; if (viewer) { viewer.showMobs = ui.mobs; viewer.rebuild(); } });

    // Tastatur: Pfeiltasten für Schichten
    document.onkeydown = (e) => {
      if (!document.getElementById('layer')) return;
      if (e.target.matches('input[type=search], input[type=text], select')) return;
      if (e.key === 'PageUp' || (e.key === 'ArrowUp' && e.shiftKey)) { if (ui.mode === 'all') setMode('upto'); setLayer(ui.layer + 1); e.preventDefault(); }
      if (e.key === 'PageDown' || (e.key === 'ArrowDown' && e.shiftKey)) { if (ui.mode === 'all') setMode('upto'); setLayer(ui.layer - 1); e.preventDefault(); }
    };

    // ---- Schicht-Plan (2D)
    const byLayer = {};
    for (const b of s.blocks) (byLayer[b[1]] = byLayer[b[1]] || []).push(b);
    const mobsByLayer = {};
    for (const m of s.mobs) (mobsByLayer[m[1]] = mobsByLayer[m[1]] || []).push(m);
    let mapCell = 10, mapOff = [0, 0];
    function drawMap() {
      if (ui.view !== '2d') return;
      const wrap = document.getElementById('v2d');
      const cv = document.getElementById('map');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = wrap.clientWidth, ch = wrap.clientHeight;
      cv.width = cw * dpr; cv.height = ch * dpr;
      cv.style.width = cw + 'px'; cv.style.height = ch + 'px';
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      mapCell = Math.max(4, Math.floor(Math.min((cw - 24) / W, (ch - 24) / L)));
      mapOff = [Math.floor((cw - mapCell * W) / 2), Math.floor((ch - mapCell * L) / 2)];
      const [ox, oy] = mapOff, c = mapCell;
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--map-bg') || '#111';
      ctx.fillRect(ox, oy, c * W, c * L);
      // Raster
      ctx.strokeStyle = 'rgba(128,128,128,.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) { ctx.moveTo(ox + x * c + 0.5, oy); ctx.lineTo(ox + x * c + 0.5, oy + L * c); }
      for (let z = 0; z <= L; z++) { ctx.moveTo(ox, oy + z * c + 0.5); ctx.lineTo(ox + W * c, oy + z * c + 0.5); }
      ctx.stroke();
      const drawBlocks = (list, alpha) => {
        ctx.globalAlpha = alpha;
        for (const b of list || []) {
          const { base, dir } = MF.parseKey(b[3]);
          const d = MF.BLOCKS[base];
          if (!d) continue;
          const x = ox + b[0] * c, y = oy + b[2] * c;
          const sh = d.shape || 'cube';
          ctx.fillStyle = d.color;
          if (sh === 'marker') { ctx.beginPath(); ctx.moveTo(x + c / 2, y + 1); ctx.lineTo(x + c - 1, y + c / 2); ctx.lineTo(x + c / 2, y + c - 1); ctx.lineTo(x + 1, y + c / 2); ctx.fill(); continue; }
          if (['small', 'post', 'thinplant'].includes(sh)) { ctx.fillRect(x + c * 0.32, y + c * 0.32, c * 0.36, c * 0.36); continue; }
          if (['plant', 'crop', 'cactus'].includes(sh)) { ctx.fillRect(x + c * 0.15, y + c * 0.15, c * 0.7, c * 0.7); continue; }
          if (sh === 'flat') { ctx.fillRect(x + c * 0.1, y + c * 0.4, c * 0.8, c * 0.2); ctx.fillRect(x + c * 0.4, y + c * 0.1, c * 0.2, c * 0.8); continue; }
          if (sh === 'trapOpen' && dir) {
            const o = MF.OPP[dir]; const t = Math.max(2, c * 0.2);
            if (o === 's') ctx.fillRect(x, y + c - t, c, t); else if (o === 'n') ctx.fillRect(x, y, c, t); else if (o === 'e') ctx.fillRect(x + c - t, y, t, c); else ctx.fillRect(x, y, t, c);
            continue;
          }
          ctx.fillRect(x + 0.5, y + 0.5, c - 1, c - 1);
          if (sh === 'glass') { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.strokeRect(x + 1.5, y + 1.5, c - 3, c - 3); }
          if (sh === 'slab' || sh === 'trap' || sh === 'bed') { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 0.5, y + c / 2, c - 1, c / 2 - 0.5); }
          if (sh === 'slabTop' || sh === 'trapTop') { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x + 0.5, y + 0.5, c - 1, c / 2); }
          if (d.dirProp && dir && c >= 8) {
            ctx.fillStyle = d.front || '#000';
            ctx.strokeStyle = d.front || '#000';
            const cx = x + c / 2, cy = y + c / 2;
            if (dir === 'u' || dir === 'd') {
              ctx.beginPath(); ctx.arc(cx, cy, c * 0.18, 0, Math.PI * 2);
              if (dir === 'd') ctx.fill(); else { ctx.lineWidth = 2; ctx.stroke(); }
            } else {
              const v = MF.DIRS[dir].v;
              ctx.beginPath();
              ctx.moveTo(cx + v[0] * c * 0.38, cy + v[2] * c * 0.38);
              ctx.lineTo(cx - v[2] * c * 0.22 - v[0] * c * 0.1, cy + v[0] * c * 0.22 - v[2] * c * 0.1);
              ctx.lineTo(cx + v[2] * c * 0.22 - v[0] * c * 0.1, cy - v[0] * c * 0.22 - v[2] * c * 0.1);
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1;
      };
      drawBlocks(byLayer[ui.layer - 1], 0.18);
      drawBlocks(byLayer[ui.layer], 1);
      if (ui.mobs) for (const m of mobsByLayer[ui.layer] || []) {
        const d = MF.BLOCKS[m[3]];
        ctx.fillStyle = d.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ox + m[0] * c + c / 2, oy + m[2] * c + c / 2, c * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // Kompass
      ctx.fillStyle = 'rgba(160,160,160,.9)';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText('N ↑', 8, 16);
    }
    const mapEl = document.getElementById('map');
    const mapTip = document.getElementById('maptip');
    mapEl.addEventListener('pointermove', (e) => {
      const r = mapEl.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left - mapOff[0]) / mapCell);
      const z = Math.floor((e.clientY - r.top - mapOff[1]) / mapCell);
      const b = (byLayer[ui.layer] || []).find((q) => q[0] === x && q[2] === z);
      const m = (mobsByLayer[ui.layer] || []).find((q) => q[0] === x && q[2] === z);
      if (!b && !m) { mapTip.style.display = 'none'; return; }
      let html = '';
      if (b) {
        const { base, dir } = MF.parseKey(b[3]);
        const d = MF.BLOCKS[base];
        html += '<b>' + esc(d.name) + '</b>' + (dir && d.dirProp ? '<br><small>zeigt nach ' + MF.DIRS[dir].de + '</small>' : '') + (d.flex ? '<br><small class="flex">austauschbar</small>' : '');
      }
      if (m) html += (html ? '<br>' : '') + '<b>' + esc(MF.BLOCKS[m[3]].name) + '</b>' + (m[4] > 1 ? ' ×' + m[4] : '');
      html += '<br><small>x ' + x + ' · z ' + z + '</small>';
      mapTip.innerHTML = html;
      mapTip.style.display = 'block';
      mapTip.style.left = e.clientX - r.left + 14 + 'px';
      mapTip.style.top = e.clientY - r.top + 10 + 'px';
    });
    mapEl.addEventListener('pointerleave', () => (mapTip.style.display = 'none'));
    new ResizeObserver(() => drawMap()).observe(document.getElementById('v2d'));

    function drawLegend() {
      const el = document.getElementById('legend');
      const mats = materials(s, tier, ui.layer).filter((m) => m.kind !== 'extra');
      if (!mats.length) { el.innerHTML = '<span class="muted small">Diese Schicht ist leer (nur Luft/Wasserfluss).</span>'; return; }
      el.innerHTML = '<span class="muted small">In Schicht ' + (ui.layer + 1) + ':</span> ' + mats.sort((a, b) => b.count - a.count).map((m) => '<span class="leg">' + iconHTML(m.base) + m.count + '× ' + esc(m.name) + '</span>').join('');
      hydrateIcons(el, 16);
    }

    // ---- Tabs
    const todoKey = 'todo:' + farm.id + ':' + ti;
    function renderTab() {
      document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === ui.tab));
      const body = document.getElementById('tab-body');
      if (ui.tab === 'todo') {
        const checks = store.get(todoKey, {});
        const all = materials(s, tier, ui.layerOnly ? ui.layer : null);
        let list = all;
        if (ui.filter === 'need') list = all.filter((m) => !(m.def && m.def.flex));
        if (ui.filter === 'flex') list = all.filter((m) => m.def && m.def.flex);
        const doneN = all.filter((m) => checks[m.key]).length;
        const groups = [
          ['Blöcke', list.filter((m) => m.kind === 'block')],
          ['Tiere, Mobs & Fahrzeuge', list.filter((m) => m.kind === 'mob' || m.kind === 'craft')],
          ['Sonstiges', list.filter((m) => m.kind === 'extra')],
        ];
        let html = '<div class="todo-head"><div class="bar"><i style="width:' + (all.length ? (doneN / all.length) * 100 : 0) + '%"></i></div><span class="small"><b>' + doneN + '</b> / ' + all.length + ' erledigt</span></div>' +
          '<div class="todo-filters"><div class="seg seg-sm" id="filt"><button data-f="all">Alle</button><button data-f="need">Wichtig</button><button data-f="flex">Austauschbar</button></div>' +
          '<label class="small"><input type="checkbox" id="layerOnly"' + (ui.layerOnly ? ' checked' : '') + '> nur Schicht ' + (ui.layer + 1) + '</label></div>';
        for (const [title, items] of groups) {
          if (!items.length) continue;
          html += '<h4 class="todo-group">' + title + '</h4><ul class="todo">';
          for (const m of items.sort((a, b) => b.count - a.count)) {
            const d = m.def;
            const tags = [];
            if (d && d.flex) tags.push('<span class="tag tag-flex" title="' + esc(d.flex) + '">austauschbar</span>');
            if (m.kind === 'block' && d && !d.flex && !d.noList && (d.note || m.base === 'glass_req')) tags.push('<span class="tag tag-imp">wichtig</span>');
            const note = (d && (d.flex || d.note || d.how)) || m.note || '';
            html += '<li class="' + (checks[m.key] ? 'done' : '') + '"><label><input type="checkbox" data-k="' + esc(m.key) + '"' + (checks[m.key] ? ' checked' : '') + '>' +
              (m.base ? iconHTML(m.base) : '<span class="bicon-slot extra">★</span>') +
              '<span class="todo-main"><span class="todo-name">' + esc(m.name) + ' ' + tags.join('') + '</span>' + (note ? '<span class="todo-note">' + esc(note) + '</span>' : '') + '</span>' +
              '<span class="todo-count"><b>' + fmt(m.count) + '</b><small>' + stacks(m.count, m.key) + '</small></span></label></li>';
          }
          html += '</ul>';
        }
        html += '<button class="linkbtn" id="todo-reset">Liste zurücksetzen</button>';
        body.innerHTML = html;
        hydrateIcons(body, 24);
        body.querySelectorAll('#filt button').forEach((b) => b.classList.toggle('active', b.dataset.f === ui.filter));
        body.querySelector('#filt').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) { ui.filter = b.dataset.f; renderTab(); } });
        body.querySelector('#layerOnly').addEventListener('change', (e) => { ui.layerOnly = e.target.checked; renderTab(); });
        body.querySelectorAll('input[data-k]').forEach((cb) => cb.addEventListener('change', () => {
          const c = store.get(todoKey, {});
          if (cb.checked) c[cb.dataset.k] = true; else delete c[cb.dataset.k];
          store.set(todoKey, c);
          renderTab();
        }));
        body.querySelector('#todo-reset').addEventListener('click', () => { store.set(todoKey, {}); renderTab(); });
      } else if (ui.tab === 'raw') {
        const rows = Object.entries(tot.raw).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
        let html = '<p class="muted small">So viel musst du insgesamt sammeln, wenn du alle Blöcke selbst herstellst (Trichter = Eisen + Holz usw.).</p>';
        html += '<table class="raw"><thead><tr><th>Rohstoff</th><th>Menge</th><th></th></tr></thead><tbody>';
        for (const [k, v] of rows) html += '<tr><td>' + MF.RAW[k] + '</td><td><b>' + fmt(Math.ceil(v)) + '</b></td><td class="muted small">' + stacks(Math.ceil(v), k) + '</td></tr>';
        html += '</tbody></table>';
        const direct = Object.entries(tot.direct).sort((a, b) => b[1] - a[1]);
        if (direct.length) {
          html += '<h4 class="todo-group">Direkt sammeln / finden</h4><table class="raw"><tbody>';
          for (const [k, v] of direct) html += '<tr><td>' + esc(k) + '</td><td><b>' + fmt(v) + '</b></td><td class="muted small">' + stacks(v) + '</td></tr>';
          html += '</tbody></table>';
        }
        if (tot.filler) html += '<h4 class="todo-group">Füllblöcke</h4><p class="small"><b>' + fmt(tot.filler) + '</b> beliebige Blöcke (Bruchstein, Erde, Bretter …) <span class="muted">– ' + stacks(tot.filler) + '</span></p>';
        body.innerHTML = html;
      } else {
        let html = '<div class="prose">';
        html += '<h4>So funktioniert\'s</h4><p>' + esc(tier.how) + '</p>';
        if (tier.req && tier.req.length) html += '<h4>Du brauchst</h4><ul>' + tier.req.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>';
        html += '<h4>Bauanleitung</h4><ol class="steps">' + tier.steps.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ol>';
        if (tier.tips && tier.tips.length) html += '<h4>Tipps</h4><ul class="tips">' + tier.tips.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>';
        html += '<p class="muted small">In der 3D-Ansicht zeigen dunkle Quadrate die Vorderseite gerichteter Blöcke (Trichter, Kolben, Werfer, Beobachter-Gesicht). Gelber Diamant = dein Standplatz.</p>';
        html += '</div>';
        body.innerHTML = html;
      }
    }
    document.getElementById('tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { ui.tab = b.dataset.tab; renderTab(); } });
    document.querySelector('[data-tab-go]').addEventListener('click', () => { ui.tab = 'raw'; renderTab(); document.getElementById('tabs').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });

    // ---- Downloads
    const fname = farm.id + '-' + MF.LEVELS[tier.level].name.toLowerCase().replace(/[^a-z]/g, '') + '-' + (ti + 1);
    const dl = async (btn, fn, ext) => {
      const old = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Erstelle …';
      try {
        const bytes = await fn(s, fname, farm.name + ' – ' + tier.name);
        MF.download(bytes, fname + ext);
      } catch (err) {
        alert('Download fehlgeschlagen: ' + err.message);
      }
      btn.disabled = false;
      btn.innerHTML = old;
    };
    document.getElementById('dl-schem').addEventListener('click', (e) => dl(e.currentTarget, MF.toSchem, '.schem'));
    document.getElementById('dl-lit').addEventListener('click', (e) => dl(e.currentTarget, MF.toLitematic, '.litematic'));

    setMode(ui.mode);
    setView(ui.view);
    setLayer(H - 1);
    renderTab();
  }

  route();
})();
