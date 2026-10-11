/* Bauplan-Generatoren. Jede Funktion bekommt einen MF.Build und baut dort
 * eine Farm (oder ein Modul davon). Die Farm-Daten in farms.js rufen diese auf. */
(function () {
  const MF = (window.MF = window.MF || {});
  const D = (MF.D = {});

  // ---------------------------------------------------------------- Hilfen

  // Trichterloren-Sammler: unter einer Reihe voller Blöcke (Höhe y) von x0 bis x1.
  // Loren auf Schienen (y-1), darunter Trichter (y-2), die nach Osten in eine Truhe führen.
  D.cartCollector = function (b, x0, x1, y, z, every) {
    every = every || 1;
    for (let x = x0; x <= x1; x++) {
      if ((x - x0) % every === 0) {
        b.set(x, y - 1, z, 'rail');
        b.mob(x, y - 1, z, 'hcart');
      } else b.set(x, y - 1, z, 'cobble');
      b.set(x, y - 2, z, 'hopper:e');
    }
    b.set(x1 + 1, y - 2, z, 'chest');
  };

  // Kleine Truhe mit Trichter in einer Reihe (Trichterkette nach Osten)
  D.hopperLine = function (b, x0, x1, y, z) {
    for (let x = x0; x <= x1; x++) b.set(x, y, z, 'hopper:e');
    b.set(x1 + 1, y, z, 'chest');
  };

  // ---------------------------------------------------------------- Eisen

  // Dorfbewohner-Kapsel: 3 Dorfbewohner auf Betten + Zombie hinter Glas.
  D.ironPod = function (b, x, y, z) {
    b.fill(x - 1, y, z - 1, x + 3, y, z + 4, 'glass_req');
    b.walls(x - 1, y + 1, z - 1, x + 3, y + 2, z + 2, 'glass_req');
    b.fill(x - 1, y + 3, z - 1, x + 3, y + 3, z + 2, 'glass_req');
    for (let i = 0; i < 3; i++) {
      b.set(x + i, y + 1, z, 'bed:s');
      b.set(x + i, y + 1, z + 1, 'bed_head:s');
      b.mob(x + i, y + 1, z, 'villager');
    }
    // Zombie-Zelle
    b.fill(x, y + 1, z + 3, x + 2, y + 2, z + 4, 'glass_req');
    b.set(x + 1, y + 1, z + 3, null);
    b.set(x + 1, y + 2, z + 3, null);
    b.mob(x + 1, y + 1, z + 3, 'zombie');
    b.set(x + 1, y + 3, z + 3, 'slab'); // Schatten, damit er nicht verbrennt
  };

  // Eisenfarm-Modul: Plattform (Größe S, gerade Zahl) mit Wasser zur Mitte,
  // 2×2-Grube mit Lava auf Kopfhöhe, gehalten von Schildern auf den Trichtern.
  D.ironModule = function (b, ox, oz, S, pods) {
    const P = 4; // Plattform-Höhe
    const F = P - 3; // Trichter-Boden der Grube
    const c0 = S / 2 - 1, c1 = S / 2;
    for (let x = 0; x < S; x++)
      for (let z = 0; z < S; z++) {
        const pit = (x === c0 || x === c1) && (z === c0 || z === c1);
        const X = ox + x, Z = oz + z;
        if (pit) {
          b.set(X, F - 1, Z, 'chest');
          b.set(X, F, Z, 'hopper:d');
          b.set(X, F + 1, Z, 'sign');
          b.set(X, F + 2, Z, 'lava');
          b.set(X, P, Z, 'sign'); // Wandschild: hält das Wasser auf, Golems fallen durch
        } else {
          b.set(X, P, Z, 'cobble');
          const edge = x === 0 || z === 0 || x === S - 1 || z === S - 1;
          b.set(X, P + 1, Z, edge ? 'water' : 'flow');
        }
      }
    b.walls(ox + c0 - 1, F - 1, oz + c0 - 1, ox + c1 + 1, P - 1, oz + c1 + 1, 'cobble');
    b.walls(ox - 1, P, oz - 1, ox + S, P + 3, oz + S, 'glass_req');
    for (const [px, pz] of pods) D.ironPod(b, ox + px, P + 4, oz + pz);
  };

  // ---------------------------------------------------------------- Mob-Turm

  // Dunkelraum mit 4 Wasserkanälen zur Mitte. opts: floors, arm, drop, creeper
  D.mobTower = function (b, opts) {
    const arm = opts.arm || 8;
    const S = arm * 2 + 2;
    const c0 = arm, c1 = arm + 1;
    const K = 1; // Trichterboden der Tötungskammer
    const f0 = K + 1 + (opts.drop || 22);
    const isC = (v) => v === c0 || v === c1;
    for (let i = 0; i < opts.floors; i++) {
      const f = f0 + 3 * i;
      for (let x = 0; x < S; x++)
        for (let z = 0; z < S; z++) {
          if (isC(x) && isC(z)) {
            b.set(x, f, z, 'sign');
          } else if (isC(x) || isC(z)) {
            b.set(x, f - 1, z, 'cobble');
            const end = x === 0 || z === 0 || x === S - 1 || z === S - 1;
            b.set(x, f, z, end ? 'water' : 'flow');
          } else {
            b.set(x, f, z, 'cobble');
            if (opts.creeper) b.set(x, f + 2, z, 'trapdoor_top');
          }
        }
      b.walls(-1, f - 1, -1, S, f + 2, S, 'cobble');
    }
    const top = f0 + 3 * opts.floors;
    b.fill(-1, top, -1, S, top, S, 'cobble');
    // Fallschacht
    b.walls(c0 - 1, K - 1, c0 - 1, c1 + 1, f0 - 1, c1 + 1, 'cobble');
    for (const x of [c0, c1])
      for (const z of [c0, c1]) {
        b.set(x, K, z, 'hopper:d');
        b.set(x, K - 1, z, 'chest');
      }
    // AFK-Platz mit Stufen-Spalt (du triffst die Füße)
    b.set(c1 + 1, K + 1, c0, 'slab_top');
    b.set(c1 + 1, K + 1, c1, 'slab_top');
    b.fill(c1 + 2, K, c0 - 1, c1 + 3, K, c1 + 1, 'cobble');
    b.walls(c1 + 2, K + 1, c0 - 1, c1 + 4, K + 2, c1 + 1, 'glass', true);
    b.set(c1 + 2, K + 1, c0, null);
    b.set(c1 + 2, K + 2, c0, null);
    b.set(c1 + 2, K + 1, c1, null);
    b.set(c1 + 2, K + 2, c1, null);
    b.set(c1 + 3, K + 1, c0, null);
    b.set(c1 + 3, K + 2, c0, null);
    b.set(c1 + 3, K + 1, c1, null);
    b.set(c1 + 3, K + 2, c1, null);
    b.set(c1 + 2, K + 1, c0, 'afk');
    b.fill(c1 + 2, K + 3, c0 - 1, c1 + 4, K + 3, c1 + 1, 'cobble');
  };

  // ---------------------------------------------------------------- Spawner

  // Spawner-Farm: Wasser schiebt Mobs zu einer Blasensäule, oben fallen sie 22 Blöcke
  // in eine Kammer direkt neben dem Spawner (du bleibst in Reichweite).
  D.spawnerFarm = function (b, mob) {
    const TOP = 25;
    // Boden + Raum
    b.fill(0, 0, 0, 8, 0, 7, 'cobble');
    b.fill(0, -1, 8, 8, -1, 8, 'cobble');
    b.walls(-1, -1, -1, 9, 5, 9, 'cobble');
    b.fill(-1, 6, -1, 9, 6, 9, 'cobble');
    b.set(4, 2, 4, 'spawner');
    b.mob(4, 3, 4, mob);
    // Wasser im Raum (von hinten nach vorne)
    for (let x = 0; x <= 8; x++)
      for (let z = 0; z <= 7; z++) b.set(x, 1, z, z === 0 ? 'water' : 'flow');
    // Querkanal zur Blasensäule
    for (let x = 0; x <= 8; x++) b.set(x, 0, 8, x === 0 || x === 8 ? 'water' : 'flow');
    // Blasensäule (Seelensand)
    b.set(4, -1, 8, 'soul_sand');
    for (let y = 0; y <= TOP - 1; y++) b.set(4, y, 8, 'water');
    for (let y = 1; y <= TOP; y++) {
      b.set(3, y, 8, 'glass');
      b.set(5, y, 8, 'glass');
      b.set(4, y, 7, 'glass');
      if (y > 5) b.set(4, y, 9, 'glass');
    }
    b.set(4, TOP + 1, 8, 'glass');
    // Ausgang oben + Schild über dem Fallschacht
    b.set(4, TOP, 7, 'water');
    b.set(3, TOP, 7, 'glass');
    b.set(5, TOP, 7, 'glass');
    b.set(4, TOP, 6, 'glass');
    b.set(4, TOP + 1, 7, 'glass');
    b.set(4, TOP, 8, 'flow');
    b.set(4, TOP, 9, 'flow');
    b.set(4, TOP, 10, 'sign');
    b.fill(3, TOP - 1, 9, 5, TOP - 1, 9, 'glass');
    b.fill(3, TOP, 9, 3, TOP + 1, 11, 'glass');
    b.fill(5, TOP, 9, 5, TOP + 1, 11, 'glass');
    b.set(4, TOP, 11, 'glass');
    b.set(4, TOP + 1, 11, 'glass');
    b.fill(4, TOP + 2, 9, 4, TOP + 2, 10, 'glass');
    // Fallschacht
    for (let y = 3; y <= TOP - 1; y++) {
      b.set(3, y, 10, 'glass');
      b.set(5, y, 10, 'glass');
      b.set(4, y, 11, 'glass');
      if (y >= 6) b.set(4, y, 9, 'glass');
    }
    b.set(4, 2, 10, 'hopper:d');
    b.set(4, 1, 10, 'chest');
    b.set(4, 3, 11, 'slab_top');
    b.fill(3, 2, 11, 5, 2, 13, 'cobble');
    b.set(4, 3, 12, 'afk');
    b.set(3, 3, 12, 'glass');
    b.set(5, 3, 12, 'glass');
    b.set(4, 3, 13, 'glass');
    b.fill(3, 5, 11, 5, 5, 13, 'cobble');
  };

  // ---------------------------------------------------------------- Gold / Ender

  // Plattform-Ebenen mit 3×3-Mitte: Köder in der Mitte, offene Falltüren drumherum.
  // shape: 'square' (R) oder 'plus' (arm)
  D.lureLayers = function (b, opts) {
    const R = opts.R;
    const S = 2 * R + 3;
    const c = R + 1;
    const K = 1;
    const y0 = K + 1 + opts.drop;
    const gap = opts.gap; // Abstand der Ebenen
    const floorKey = opts.floor || 'netherrack';
    for (let i = 0; i < opts.layers; i++) {
      const y = y0 + gap * i;
      for (let x = 0; x < S; x++)
        for (let z = 0; z < S; z++) {
          const dx = Math.abs(x - c), dz = Math.abs(z - c);
          if (opts.plus && dx > 1 && dz > 1) continue;
          if (dx <= 1 && dz <= 1) {
            if (dx === 0 && dz === 0) {
              b.set(x, y, z, floorKey);
              if (opts.bait === 'egg') b.set(x, y + 1, z, 'turtle_egg');
              else {
                b.set(x, y + 1, z, 'rail');
                b.mob(x, y + 1, z, 'minecart');
                b.mob(x, y + 1, z, 'endermite');
              }
            } else {
              const dir = x < c ? 'e' : x > c ? 'w' : z < c ? 's' : 'n';
              b.set(x, y, z, 'trapdoor_open:' + dir);
            }
          } else b.set(x, y, z, floorKey);
        }
    }
    if (opts.roof) {
      const yt = y0 + gap * opts.layers;
      for (let x = 0; x < S; x++)
        for (let z = 0; z < S; z++) {
          if (opts.plus && Math.abs(x - c) > 1 && Math.abs(z - c) > 1) continue;
          b.set(x, yt, z, 'slab');
        }
    }
    // Schacht
    b.walls(c - 2, K - 1, c - 2, c + 2, y0 - 1, c + 2, opts.shaft || 'cobble');
    for (let x = c - 1; x <= c + 1; x++)
      for (let z = c - 1; z <= c + 1; z++) {
        b.set(x, K, z, 'hopper:d');
        b.set(x, K - 1, z, 'chest');
      }
    if (opts.afk) {
      b.set(c + 2, K + 1, c, 'slab_top');
      b.fill(c + 3, K, c - 1, c + 3, K, c + 1, 'cobble');
      b.set(c + 3, K + 1, c, 'afk');
      b.set(c + 3, K + 1, c - 1, 'glass');
      b.set(c + 3, K + 1, c + 1, 'glass');
      b.set(c + 4, K + 1, c, 'glass');
      b.fill(c + 3, K + 3, c - 1, c + 4, K + 3, c + 1, 'cobble');
    }
  };

  // Oberwelt-Portalfarm: Portale nebeneinander, davor Wasserkanal zum AFK-Platz.
  D.portalFarm = function (b, n, stack) {
    const W = 3 * n + 1;
    for (let s = 0; s < stack; s++) {
      const y0 = s * 4;
      for (let x = 0; x < W; x++) {
        b.set(x, y0, 0, 'obsidian');
        b.set(x, y0 + 4, 0, 'obsidian');
      }
      for (let i = 0; i <= n; i++) b.fill(3 * i, y0 + 1, 0, 3 * i, y0 + 3, 0, 'obsidian');
      for (let i = 0; i < n; i++)
        for (let x = 3 * i + 1; x <= 3 * i + 2; x++)
          for (let y = y0 + 1; y <= y0 + 3; y++) b.set(x, y, 0, 'portal');
    }
    // Kanal davor
    b.fill(-1, -1, 1, W, -1, 3, 'cobble');
    b.fill(0, 0, 3, W - 1, 0, 3, 'glass');
    for (let x = 0; x < W; x++) b.set(x, 0, 2, x === 0 ? 'water' : 'flow');
    for (let x = 0; x < W; x++) b.set(x, 0, 1, x === 0 ? 'water' : 'flow');
    b.walls(-1, 0, 0, W, 2 + 4 * (stack - 1), 4, 'glass', true);
    // Fallloch am Ende -> 2 tiefer, Trichter, AFK
    b.fill(W, -3, 1, W, 0, 2, null);
    b.fill(W - 1, 0, 1, W - 1, 0, 2, 'flow');
    b.set(W, 0, 1, 'sign');
    b.set(W, 0, 2, 'sign');
    b.walls(W - 1, -4, 0, W + 1, -1, 3, 'cobble');
    b.set(W, -4, 1, 'hopper:d');
    b.set(W, -4, 2, 'hopper:d');
    b.set(W, -5, 1, 'chest');
    b.set(W, -5, 2, 'chest');
    b.set(W + 1, -3, 1, 'slab_top');
    b.set(W + 1, -3, 2, 'slab_top');
    b.fill(W + 2, -4, 0, W + 2, -4, 3, 'cobble');
    b.set(W + 2, -3, 1, 'afk');
    b.fill(W + 2, -1, 0, W + 2, -1, 3, 'cobble');
  };

  // ---------------------------------------------------------------- Schleim

  D.slimeFarm = function (b, layers, chunks) {
    chunks = chunks || 1;
    const S = 16 * chunks;
    const c0 = S / 2 - 1, c1 = S / 2;
    // Sammelboden mit Wasser zur Mitte
    for (let x = 0; x < S; x++)
      for (let z = 0; z < S; z++) {
        const pit = (x === c0 || x === c1) && (z === c0 || z === c1);
        if (pit) {
          b.set(x, 0, z, 'sign');
          b.set(x, -2, z, 'magma');
          b.set(x, -3, z, 'rail');
          b.mob(x, -3, z, 'hcart');
          b.set(x, -4, z, 'hopper:d');
          b.set(x, -5, z, 'chest');
        } else {
          b.set(x, 0, z, 'cobble');
          const d = Math.min(x, z, S - 1 - x, S - 1 - z);
          b.set(x, 1, z, d % 8 === 0 ? 'water' : 'flow');
        }
      }
    b.walls(c0 - 1, -5, c0 - 1, c1 + 1, -1, c1 + 1, 'cobble');
    b.walls(-1, 0, -1, S, 3, S, 'cobble');
    // Spawn-Ebenen: Rand bleibt offen, Schleime hüpfen runter
    for (let i = 0; i < layers; i++) {
      const y = 4 + 4 * i;
      for (let x = 1; x < S - 1; x++)
        for (let z = 1; z < S - 1; z++) b.set(x, y, z, 'cobble');
      for (let x = 3; x < S - 2; x += 5)
        for (let z = 3; z < S - 2; z += 5) b.set(x, y + 1, z, 'torch');
    }
    b.walls(-1, 4, -1, S, 4 + 4 * layers - 1, S, 'cobble');
    b.fill(-1, 4 + 4 * layers, -1, S, 4 + 4 * layers, S, 'slab');
  };

  // ---------------------------------------------------------------- Pflanzen

  // Zuckerrohr/Bambus-Reihe: Beobachter schaut auf Block 3, Kolben bricht Block 2.
  D.caneRow = function (b, ox, oz, n, plant, water, collect) {
    for (let i = 0; i < n; i++) {
      const x = ox + i;
      b.set(x, 0, oz, 'dirt');
      b.set(x, 1, oz, plant);
      b.set(x, 2, oz, plant);
      b.set(x, 1, oz - 1, 'cobble');
      b.set(x, 2, oz - 1, 'piston:s');
      b.set(x, 3, oz - 1, 'observer:s');
      b.set(x, 2, oz - 2, 'cobble');
      b.set(x, 3, oz - 2, 'redstone');
      if (water) {
        b.set(x, -1, oz + 1, 'cobble');
        b.set(x, 0, oz + 1, 'water');
      }
      b.set(x, 1, oz + 1, 'glass');
      b.set(x, 2, oz + 1, 'glass');
      b.set(x, 3, oz + 1, 'glass');
    }
    if (collect === 'cart') D.cartCollector(b, ox, ox + n - 1, 0, oz);
    else if (collect === 'water') {
      // Wasserkanal hinten sammelt nichts – Spieler sammelt selbst
    }
  };

  // Seetang-Reihe (Wasserkanal oben schwemmt die Items zum Trichter)
  D.kelpRow = function (b, ox, oz, n, clock) {
    for (let i = 0; i < n; i++) {
      const x = ox + i;
      b.set(x, 0, oz, 'cobble');
      b.set(x, 1, oz, 'kelp');
      b.set(x, 2, oz, 'kelp');
      b.set(x, 3, oz, i === 0 ? 'water' : 'flow');
      b.set(x, 1, oz - 1, 'glass');
      b.set(x, 2, oz - 1, 'piston:s');
      b.set(x, 3, oz - 1, 'glass');
      b.set(x, 2, oz - 2, 'cobble');
      b.set(x, 3, oz - 2, 'redstone');
      for (let y = 1; y <= 3; y++) b.set(x, y, oz + 1, 'glass');
    }
    b.fill(ox - 1, 0, oz - 1, ox - 1, 3, oz + 1, 'glass');
    const e = ox + n;
    b.set(e, 3, oz, 'flow');
    b.set(e, 2, oz, 'hopper:d');
    b.set(e, 1, oz, 'chest');
    b.set(e, 3, oz - 1, 'glass');
    b.set(e, 3, oz + 1, 'glass');
    b.set(e + 1, 3, oz, 'glass');
    if (clock) {
      b.set(ox - 1, 2, oz - 2, 'cobble');
      b.set(ox - 1, 3, oz - 2, 'redstone');
      b.set(ox - 2, 3, oz - 2, 'observer:w');
      b.set(ox - 3, 3, oz - 2, 'observer:e');
    } else {
      b.set(ox - 1, 2, oz - 2, 'cobble');
      b.set(ox - 1, 3, oz - 2, 'lever');
    }
  };

  // Kürbis-/Melonenreihe. dir = 1 (Kolben im Norden) oder -1 (gespiegelt)
  D.melonRow = function (b, ox, oz, n, dir, stem) {
    const z = (k) => oz + k * dir;
    for (let i = 0; i < n; i++) {
      const x = ox + i;
      b.set(x, 1, z(-1), 'piston:' + (dir > 0 ? 's' : 'n'));
      b.set(x, 2, z(-1), 'cobble');
      b.set(x, 3, z(-1), 'redstone');
      b.set(x, 0, z(0), 'dirt');
      b.set(x, 2, z(0), 'observer:d');
      b.set(x, 3, z(0), 'cobble');
      b.set(x, 0, z(1), 'farmland');
      b.set(x, 1, z(1), stem);
      b.set(x, 0, z(2), 'water');
      b.set(x, -1, z(2), 'cobble');
    }
    D.cartCollector(b, ox, ox + n - 1, 0, z(0));
  };

  // Kaktus-Turm: Stützblock neben dem Kaktus bricht ihn beim Wachsen
  D.cactusTower = function (b, N, layers) {
    // Sammelboden (Wasser fließt zur Trichterreihe in der Mitte)
    const W = 2 * N + 1;
    const mid = N;
    for (let x = 0; x < W; x++)
      for (let z = 0; z < W; z++) {
        b.set(x, -1, z, 'cobble');
        if (z === mid) b.set(x, -1, z, 'hopper:e');
        else b.set(x, 0, z, z === 0 || z === W - 1 ? 'water' : 'flow');
      }
    b.set(W, -1, mid, 'chest');
    b.walls(-1, -1, -1, W, 3 * layers + 1, W, 'glass', true);
    for (let k = 0; k < layers; k++) {
      const y = 1 + 3 * k;
      const shift = k % 2;
      for (let x = 1 + shift; x < W - 1; x += 2)
        for (let z = 1; z < W - 1; z += 2) {
          if (z === mid) continue;
          b.set(x, y, z, 'sand');
          if (k === 0) b.set(x, y - 1, z, 'cobble');
          b.set(x, y + 1, z, 'cactus');
          // Brecher + Stütze für die nächste Ebene
          if (x + 1 < W - 1) b.set(x + 1, y + 2, z, 'cobble');
          else b.set(x - 1, y + 2, z, 'fence');
        }
    }
  };

  // Villager-Feld 9×9 mit Empfänger-Zelle (bekommt Essen zugeworfen)
  D.cropModule = function (b, ox, y, oz, farmers, torches) {
    for (let x = 0; x < 9; x++)
      for (let z = 0; z < 9; z++) {
        if (x === 4 && z === 4) {
          b.set(ox + x, y, oz + z, 'water');
          continue;
        }
        if (x === 0 && z === 0) {
          b.set(ox, y, oz, 'cobble');
          b.set(ox, y + 1, oz, 'composter');
          continue;
        }
        b.set(ox + x, y, oz + z, 'farmland');
        b.set(ox + x, y + 1, oz + z, 'carrots');
      }
    if (farmers > 1) {
      b.set(ox + 8, y, oz + 8, 'cobble');
      b.set(ox + 8, y + 1, oz + 8, 'composter');
    }
    b.walls(ox - 1, y, oz - 1, ox + 9, y + 2, oz + 9, 'glass', true);
    b.fill(ox - 1, y - 1, oz - 1, ox + 9, y - 1, oz + 9, 'cobble', true);
    for (let i = 0; i < farmers; i++) b.mob(ox + 2 + i * 4, y + 1, oz + 2 + i * 3, 'farmer');
    // Empfänger-Zelle im Norden
    const rx = ox + 4, rz = oz - 2;
    b.set(rx, y + 1, oz - 1, 'slab');
    b.set(rx, y + 2, oz - 1, 'slab_top');
    b.set(rx, y, oz - 1, 'cobble');
    b.set(rx, y, rz, 'hopper:d');
    b.set(rx, y - 1, rz, 'chest');
    b.mob(rx, y + 1, rz, 'villager');
    b.set(rx - 1, y + 1, rz, 'glass');
    b.set(rx + 1, y + 1, rz, 'glass');
    b.set(rx - 1, y + 2, rz, 'glass');
    b.set(rx + 1, y + 2, rz, 'glass');
    b.set(rx, y + 1, rz - 1, 'glass');
    b.set(rx, y + 2, rz - 1, 'glass');
    b.set(rx, y + 3, rz, 'glass');
    b.set(rx - 1, y, rz, 'cobble');
    b.set(rx + 1, y, rz, 'cobble');
    b.set(rx, y, rz - 1, 'cobble');
    if (torches) {
      for (const [tx, tz] of [[2, 2], [6, 2], [2, 6], [6, 6]]) b.set(ox + tx, y + 1, oz + tz, 'torch');
    }
  };

  // ---------------------------------------------------------------- Tiere

  // Hühnchen-Kochstation: Brut-Trichter -> Werfer -> Koch-Trichter mit Lava
  D.chickenCooker = function (b, ox, oz, breeders, per) {
    // Kochtrichter bei (ox,1,oz), Werfer östlich davon
    b.set(ox, 0, oz, 'chest');
    b.set(ox, 1, oz, 'hopper:d');
    b.set(ox, 2, oz, 'lava');
    b.fill(ox - 1, 1, oz - 1, ox + 1, 3, oz + 1, 'glass', true);
    b.set(ox, 3, oz, 'glass');
    b.set(ox + 1, 1, oz, 'dispenser:w');
    b.set(ox + 1, 2, oz, null);
    // Takt: zwei Beobachter
    b.set(ox + 1, 1, oz + 1, 'observer:s');
    b.set(ox + 1, 1, oz + 2, 'observer:n');
    // Brut-Trichter: Reihe nach Osten, alle zeigen nach Westen bis zum Werfer
    b.set(ox + 1, 2, oz, 'hopper:d');
    for (let i = 1; i < breeders; i++) b.set(ox + 1 + i, 2, oz, 'hopper:w');
    for (let i = 0; i < breeders; i++) {
      const x = ox + 1 + i;
      b.mob(x, 2, oz, 'chicken', per);
      b.set(x, 3, oz - 1, 'glass');
      b.set(x, 3, oz + 1, 'glass');
      b.set(x, 4, oz, 'glass');
    }
    b.set(ox + breeders + 1, 3, oz, 'glass');
    b.set(ox, 3, oz - 1, 'glass');
  };

  // Wollzelle: Schaf frisst Gras -> Beobachter -> Werfer mit Schere
  D.woolRow = function (b, ox, n) {
    const W = 2 * n - 1;
    for (let x = 0; x < W; x++) b.set(ox + x, 0, 0, 'grass');
    for (let i = 0; i < n; i++) {
      const x = ox + 2 * i;
      b.mob(x, 1, 0, 'sheep');
      b.set(x, 1, 1, 'dispenser:n');
      b.set(x, 2, 1, 'glass');
      b.set(x, 0, 1, 'observer:n');
      b.set(x, 0, 2, 'cobble');
      b.set(x, 1, 2, 'redstone');
    }
    for (let x = ox - 1; x <= ox + W; x++) {
      const off = x - ox;
      if (off < 0 || off >= W || off % 2 === 1) {
        b.set(x, 1, 0, 'glass');
        b.set(x, 2, 0, 'glass');
      }
      b.set(x, 1, -1, 'glass');
      b.set(x, 2, -1, 'glass');
      b.set(x, 3, 0, 'glass');
    }
    b.set(ox - 1, 0, 0, 'cobble');
    b.set(ox + W, 0, 0, 'cobble');
    D.cartCollector(b, ox, ox + W - 1, 0, 0, 2);
  };

  // Bienenstöcke mit Werfer (Schere) und Beobachter
  D.honeyRow = function (b, ox, oz, n) {
    for (let i = 0; i < n; i++) {
      const x = ox + 2 * i;
      b.set(x, 1, oz, 'beehive:s');
      b.mob(x, 2, oz + 1, 'bee', 3);
      b.set(x, 1, oz - 1, 'dispenser:s');
      b.set(x, 2, oz - 1, 'cobble');
      b.set(x, 3, oz - 1, 'redstone');
      b.set(x, 2, oz, 'observer:d');
      b.set(x, 3, oz, 'cobble');
      b.set(x, 0, oz, 'rail');
      b.mob(x, 0, oz, 'hcart');
    }
    for (let x = ox; x <= ox + 2 * (n - 1); x++) {
      b.set(x, -1, oz, 'hopper:e');
      if ((x - ox) % 2 !== 0) b.set(x, 0, oz, 'cobble');
      b.set(x, 0, oz + 2, 'grass');
      b.set(x, 1, oz + 2, 'flower');
    }
    b.set(ox + 2 * (n - 1) + 1, -1, oz, 'chest');
  };

  // ---------------------------------------------------------------- Bruchstein

  // Bruchstein-Generator. piston=true -> Kolben schiebt den Stein raus
  D.cobbleGen = function (b, ox, piston) {
    b.fill(ox - 1, 0, -1, ox + 4, 0, 1, 'cobble');
    b.set(ox + 2, 0, 0, null);
    b.fill(ox + 2, -1, 0, ox + 2, -1, 0, 'cobble');
    b.set(ox + 2, 0, 0, 'flow');
    b.set(ox, 1, 0, 'lava');
    b.set(ox + 1, 1, 0, 'out');
    b.set(ox + 2, 1, 0, 'flow');
    b.set(ox + 3, 1, 0, 'water');
    b.fill(ox - 1, 1, -1, ox + 4, 1, -1, 'cobble');
    b.fill(ox - 1, 1, 1, ox + 4, 1, 1, 'cobble');
    b.set(ox - 1, 1, 0, 'cobble');
    b.set(ox + 4, 1, 0, 'cobble');
    b.fill(ox - 1, 2, -1, ox + 4, 2, 1, 'glass', true);
    if (piston) {
      b.set(ox + 1, 1, -1, 'piston:s');
      b.set(ox + 1, 2, -1, 'cobble');
      b.set(ox + 1, 3, -1, 'redstone');
      b.set(ox + 1, 2, 0, 'observer:d');
      b.set(ox + 1, 3, 0, 'cobble');
      b.set(ox + 1, 1, 1, 'out');
      b.set(ox + 1, 1, 2, 'out');
      b.fill(ox + 1, 0, 2, ox + 1, 0, 3, 'cobble');
      b.set(ox + 1, 2, 1, 'glass');
      b.set(ox + 1, 1, 3, 'afk');
    } else {
      b.set(ox + 1, 1, 1, 'afk');
      b.set(ox + 1, 0, 2, 'cobble');
      b.set(ox + 1, 2, 1, null);
    }
  };
})();
