/* Animationen „So funktioniert's". Jede Funktion ergänzt einen Bauplan um eine
 * kurze Abfolge (Mob läuft, Beobachter blinkt, Kolben fährt aus, Item fällt in die Truhe).
 * Zeiten in Sekunden; Koordinaten wie im Bauplan. */
(function () {
  const MF = window.MF;
  const D = MF.D;

  const T = (b, t, text) => b.anim({ type: 'text', t, text });
  const MOB = (b, mob, t, path, scale) => b.anim({ type: 'mob', mob, t, path, scale });
  const ITEM = (b, item, t, path, color) => b.anim({ type: 'item', item, t, path, color });
  const FLASH = (b, t, at, color) => b.anim({ type: 'flash', t, at, color });
  const BLOCK = (b, key, t, at, grow) => b.anim({ type: 'block', key, t, at, grow });
  const PUSH = (b, t, at, dir) => b.anim({ type: 'push', t, at, dir });
  const RED = '#ff4a3d', ORANGE = '#ff8a1f', GREEN = '#7fd860', BLUE = '#5aa9ff';

  // Generator umschließen: erst bauen, dann (wenn passend) animieren
  function wrap(name, fn) {
    const orig = D[name];
    D[name] = function () {
      const r = orig.apply(this, arguments);
      fn.apply(this, arguments);
      return r;
    };
  }

  // Neue Animations-Mobs (erscheinen nicht in der Materialliste)
  Object.assign(MF.BLOCKS, {
    creeper: { name: 'Creeper', color: '#4caf50', shape: 'entity', size: [0.6, 1.7], entity: true, noList: true },
    zpiglin: { name: 'Zombifizierter Piglin', color: '#e3a197', shape: 'entity', size: [0.6, 1.95], entity: true, noList: true },
    enderman_m: { name: 'Enderman', color: '#1b1b22', shape: 'entity', size: [0.6, 2.9], entity: true, noList: true },
    slime_m: { name: 'Schleim', color: '#7cc56e', shape: 'entity', size: [1.0, 1.0], entity: true, noList: true },
    pumpkin: { name: 'Kürbis (wächst hier)', id: 'pumpkin', color: '#d9861c', noList: true, noSchem: true },
  });

  // ---------------------------------------------------------------- Eisen
  wrap('ironModule', (b, ox, oz, S, pods) => {
    if (ox !== 0 || oz !== 0) return;
    const P = 4, F = 1, c = S / 2 - 0.5;
    const [px, pz] = pods[0];
    T(b, [0, 1.8], '1. Die Dorfbewohner sehen den Zombie und bekommen Panik');
    FLASH(b, [0, 1.8], [px + 1, P + 5, pz + 3], RED);
    T(b, [1.8, 3.2], '2. Panische Dorfbewohner rufen einen Eisengolem – er erscheint auf der Plattform');
    MOB(b, 'golem', [1.8, 3.2], [[1, P + 1, 1]]);
    T(b, [3.2, 5.4], '3. Das Wasser schiebt ihn zur Mitte – er fällt durch die Schilder in die Grube');
    MOB(b, 'golem', [3.2, 5.4], [[1, P + 1, 1], [c, P + 1, c], [c, F + 1, c]]);
    T(b, [5.4, 6.8], '4. Mit dem Kopf berührt er die Lava – und stirbt');
    MOB(b, 'golem', [5.4, 6.8], [[c, F + 1, c]]);
    FLASH(b, [5.4, 6.8], [S / 2 - 1, F + 2, S / 2 - 1], ORANGE);
    FLASH(b, [5.4, 6.8], [S / 2, F + 2, S / 2], ORANGE);
    T(b, [6.8, 8.2], '5. Das Eisen fällt durch die Trichter in die Truhe');
    ITEM(b, 'iron', [6.8, 8.2], [[c, F + 1, c], [c, F - 1, c]], '#e6e6e6');
  });

  // ---------------------------------------------------------------- Mob-Turm
  wrap('mobTower', (b, opts) => {
    const arm = opts.arm || 8, c0 = arm, c1 = arm + 1, K = 1;
    const f0 = K + 1 + (opts.drop || 22);
    const mob = opts.creeper ? 'creeper' : 'spawn_zombie';
    const cc = c0 + 0.5;
    T(b, [0, 1.4], opts.creeper ? '1. Im 1,8 Blöcke hohen Raum spawnt nur ein Creeper' : '1. Im Dunkeln spawnt ein Monster');
    MOB(b, mob, [0, 1.4], [[2, f0 + 1, 2]]);
    T(b, [1.4, 3], '2. Es läuft herum und fällt in einen Wasserkanal');
    MOB(b, mob, [1.4, 3], [[2, f0 + 1, 2], [2, f0 + 1, c0 - 1], [2, f0, c0]]);
    T(b, [3, 4.6], '3. Das Wasser schiebt es zur Mitte – dort fällt es 22 Blöcke tief');
    MOB(b, mob, [3, 4.6], [[2, f0, c0], [cc, f0, cc], [cc, K + 1, cc]]);
    T(b, [4.6, 6], '4. Unten hat es nur noch ein halbes Herz: ein Schlag von dir genügt');
    MOB(b, mob, [4.6, 6], [[cc, K + 1, cc]]);
    FLASH(b, [4.6, 6], [c1 + 2, K + 1, c0], '#ffd400');
    T(b, [6, 7.2], '5. Die Beute fällt in die Truhen, du bekommst XP');
    ITEM(b, opts.creeper ? 'gunpowder' : 'bone', [6, 7.2], [[cc, K + 1, cc], [cc, K - 1, cc]], '#ddd');
  });

  // ---------------------------------------------------------------- Spawner
  wrap('spawnerFarm', (b, mob) => {
    const TOP = 25;
    T(b, [0, 1.2], '1. Der Spawner erzeugt ein Monster');
    FLASH(b, [0, 1.2], [4, 2, 4], RED);
    MOB(b, mob, [0, 1.2], [[2, 1, 3]]);
    T(b, [1.2, 3.6], '2. Wasser schiebt es nach vorne und durch den Kanal zur Blasensäule');
    MOB(b, mob, [1.2, 3.6], [[2, 1, 3], [2, 1, 7], [2, 0, 8], [4, 0, 8]]);
    T(b, [3.6, 5.6], '3. Die Blasensäule (Seelensand) trägt es 25 Blöcke nach oben');
    MOB(b, mob, [3.6, 5.6], [[4, 0, 8], [4, TOP, 8]]);
    T(b, [5.6, 7], '4. Oben fällt es über das Schild 22 Blöcke tief in die Kammer');
    MOB(b, mob, [5.6, 7], [[4, TOP, 8], [4, TOP, 10], [4, 3, 10]]);
    T(b, [7, 8.2], '5. Halbes Herz übrig – du triffst durch den Spalt');
    MOB(b, mob, [7, 8.2], [[4, 3, 10]]);
    FLASH(b, [7, 8.2], [4, 3, 12], '#ffd400');
    ITEM(b, mob === 'skeleton' ? 'bone' : 'flesh', [8.2, 9.2], [[4, 3, 10], [4, 1, 10]], '#ddd');
  });

  // ---------------------------------------------------------------- Gold / Ender (Köder)
  wrap('lureLayers', (b, opts) => {
    const R = opts.R, c = R + 1, K = 1, y0 = K + 1 + opts.drop;
    const egg = opts.bait === 'egg';
    const mob = egg ? 'zpiglin' : 'enderman_m';
    const s = Math.min(R, 7);
    T(b, [0, 1.2], egg ? '1. Auf der Ebene spawnt ein zombifizierter Piglin' : '1. Auf der Plattform spawnt ein Enderman');
    MOB(b, mob, [0, 1.2], [[c + s, y0 + 1, c]]);
    T(b, [1.2, 3.2], egg ? '2. Das Schildkrötenei lockt ihn zur Mitte' : '2. Er will die Endermite in der Mitte angreifen');
    FLASH(b, [1.2, 3.2], [c, y0 + 1, c], egg ? '#fff5c0' : '#b07bff');
    MOB(b, mob, [1.2, 3.2], [[c + s, y0 + 1, c], [c + 1, y0 + 1, c]]);
    T(b, [3.2, 4.4], '3. Die offene Falltür ist kein Boden – er fällt in den Schacht');
    MOB(b, mob, [3.2, 4.4], [[c + 1, y0 + 1, c], [c + 1, K + 1, c]]);
    if (opts.afk) {
      T(b, [4.4, 5.6], '4. Unten hat er nur noch 1 Herz – ein Schlag genügt');
      MOB(b, mob, [4.4, 5.6], [[c + 1, K + 1, c]]);
      FLASH(b, [4.4, 5.6], [c + 3, K + 1, c], '#ffd400');
    } else {
      T(b, [4.4, 5.6], '4. Der Aufprall nach über 30 Blöcken ist tödlich');
      FLASH(b, [4.4, 5.6], [c + 1, K + 1, c], RED);
    }
    T(b, [5.6, 6.8], '5. Die Beute fällt in die Trichter und Truhen');
    ITEM(b, egg ? 'gold' : 'pearl', [5.6, 6.8], [[c + 1, K + 1, c], [c + 1, K - 1, c]], egg ? '#f5c542' : '#2fa38a');
  });

  wrap('portalFarm', (b, n) => {
    const W = 3 * n + 1;
    T(b, [0, 1.2], '1. Im Netherportal spawnt ein zombifizierter Piglin');
    FLASH(b, [0, 1.2], [1, 1, 0], '#b07bff');
    MOB(b, 'zpiglin', [0, 1.2], [[1, 1, 0]]);
    T(b, [1.2, 3.6], '2. Er läuft raus in den Wasserkanal, der ihn zum Loch bringt');
    MOB(b, 'zpiglin', [1.2, 3.6], [[1, 1, 0], [1, 0, 1], [W - 1, 0, 1], [W, 0, 1], [W, -3, 1]]);
    T(b, [3.6, 4.8], '3. Du triffst ihn durch den Spalt unter der Stufe');
    MOB(b, 'zpiglin', [3.6, 4.8], [[W, -3, 1]]);
    FLASH(b, [3.6, 4.8], [W + 2, -3, 1], '#ffd400');
    T(b, [4.8, 6], '4. Gold und Fleisch landen in der Truhe');
    ITEM(b, 'gold', [4.8, 6], [[W, -3, 1], [W, -5, 1]], '#f5c542');
  });

  // ---------------------------------------------------------------- Schleim
  wrap('slimeFarm', (b) => {
    const c = 7.5;
    T(b, [0, 1.2], '1. Im Schleimchunk spawnt ein Schleim – egal wie hell es ist');
    MOB(b, 'slime_m', [0, 1.2], [[5, 5, 5]]);
    T(b, [1.2, 2.8], '2. Er hüpft herum und fällt über den offenen Rand');
    MOB(b, 'slime_m', [1.2, 2.8], [[5, 5, 5], [0, 5, 5], [0, 1, 5]]);
    T(b, [2.8, 4.4], '3. Das Wasser schiebt ihn zur Grube in der Mitte');
    MOB(b, 'slime_m', [2.8, 4.4], [[0, 1, 5], [c, 1, c], [c, -1, c]]);
    T(b, [4.4, 5.6], '4. Die Magmablöcke machen Schaden – große Schleime teilen sich, kleine sterben');
    MOB(b, 'slime_m', [4.4, 5.6], [[c, -1, c]], [1, 0.3]);
    FLASH(b, [4.4, 5.6], [7, -2, 7], ORANGE);
    T(b, [5.6, 6.8], '5. Die Trichterlore saugt die Schleimbälle durch den Magmablock');
    ITEM(b, 'slime', [5.6, 6.8], [[c, -1.3, c], [c, -5, c]], '#7cc56e');
  });

  // ---------------------------------------------------------------- Pflanzen
  wrap('caneRow', (b, ox, oz, n, plant, water, collect) => {
    if (oz !== 0) return;
    const name = plant === 'bamboo' ? 'Der Bambus' : 'Das Zuckerrohr';
    T(b, [0, 2.2], '1. ' + name + ' wächst bis zum 3. Block');
    BLOCK(b, plant, [0.3, 3.4], [ox, 3, oz], true);
    T(b, [2.2, 2.8], '2. Der Beobachter sieht den neuen Block und gibt ein Signal');
    FLASH(b, [2.2, 2.8], [ox, 3, oz - 1], RED);
    FLASH(b, [2.5, 3.1], [ox, 3, oz - 2], RED);
    T(b, [2.8, 3.4], '3. Über den Redstone fährt der Kolben aus und bricht es ab');
    PUSH(b, [2.8, 3.4], [ox, 2, oz - 1], 's');
    if (collect === 'cart') {
      T(b, [3.4, 5.4], '4. Die Trichterlore unter der Erde saugt die Items ein – ab in die Truhe');
      ITEM(b, plant === 'bamboo' ? 'bamboo' : 'cane', [3.4, 5.4], [[ox, 2, oz], [ox, 0.65, oz], [ox, -1, oz], [ox, -2, oz], [ox + n, -2, oz]], GREEN);
    }
  });

  wrap('kelpRow', (b, ox, oz, n, clock) => {
    if (ox !== 0 || oz !== 0) return;
    T(b, [0, 1], clock ? '1. Der Beobachter-Takt schaltet die Redstone-Leitung' : '1. Du legst den Hebel um');
    FLASH(b, [0, 1], clock ? [ox - 2, 3, oz - 2] : [ox - 1, 3, oz - 2], RED);
    T(b, [1, 1.6], '2. Alle Kolben brechen den Seetang ab Block 2 ab');
    PUSH(b, [1, 1.6], [ox, 2, oz - 1], 's');
    T(b, [1.6, 4.4], '3. Die Items schwimmen nach oben, der Wasserstrom bringt sie zum Trichter');
    ITEM(b, 'kelp', [1.6, 4.4], [[ox, 2, oz], [ox, 2.8, oz], [ox + n, 2.8, oz], [ox + n, 1, oz]], GREEN);
  });

  wrap('melonRow', (b, ox, oz, n, dir, stem) => {
    if (dir < 0) return;
    const fruit = stem === 'pumpkin_stem' ? 'pumpkin' : 'melon';
    T(b, [0, 2.2], '1. Der Stängel lässt eine Frucht auf dem Erdblock daneben wachsen');
    BLOCK(b, fruit, [0.3, 3], [ox, 1, oz], true);
    T(b, [2.2, 2.8], '2. Der Beobachter darüber merkt das und gibt ein Signal');
    FLASH(b, [2.2, 2.8], [ox, 2, oz], RED);
    FLASH(b, [2.4, 3], [ox, 3, oz - 1], RED);
    T(b, [2.8, 3.4], '3. Der Kolben fährt aus und zerbricht die Frucht');
    PUSH(b, [2.8, 3.4], [ox, 1, oz - 1], 's');
    T(b, [3.4, 5.4], '4. Die Trichterlore unter der Erde sammelt alles ein');
    ITEM(b, 'melon', [3.4, 5.4], [[ox, 0.65, oz], [ox, -1, oz], [ox, -2, oz], [ox + n, -2, oz]], '#d9483b');
  });

  wrap('cactusTower', (b, N) => {
    const mid = N, W = 2 * N + 1;
    T(b, [0, 2], '1. Der Kaktus wächst nach oben');
    BLOCK(b, 'cactus', [0.3, 2.6], [1, 3, 1], true);
    T(b, [2, 2.6], '2. Neben dem neuen Block steht ein Stein – der Kaktus bricht sofort ab');
    FLASH(b, [2, 2.6], [2, 3, 1], RED);
    T(b, [2.6, 5], '3. Er fällt ins Wasser, das ihn zur Trichterreihe in der Mitte bringt');
    ITEM(b, 'cactus', [2.6, 5], [[1, 3, 1], [1, 3, 0], [1, 0, 0], [1, 0, mid], [1, -1, mid], [W, -1, mid]], GREEN);
  });

  wrap('cropModule', (b, ox, y, oz) => {
    if (y !== 0) return;
    T(b, [0, 2.4], '1. Der Bauer erntet reife Karotten und pflanzt neu');
    MOB(b, 'farmer', [0, 2.4], [[ox + 2, y + 1, oz + 5], [ox + 6, y + 1, oz + 5], [ox + 4, y + 1, oz + 1]]);
    FLASH(b, [0.8, 1.4], [ox + 6, y + 1, oz + 5], GREEN);
    T(b, [2.4, 4.4], '2. Hat er genug Essen, wirft er es dem anderen Dorfbewohner zu');
    MOB(b, 'farmer', [2.4, 5.6], [[ox + 4, y + 1, oz + 1]]);
    ITEM(b, 'carrot', [2.8, 4.4], [[ox + 4, y + 1.6, oz + 1], [ox + 4, y + 2, oz], [ox + 4, y + 1, oz - 2]], ORANGE);
    T(b, [4.4, 5.6], '3. Durch den 1-Block-Spalt passt nur das Essen – es landet im Trichter und in der Truhe');
    ITEM(b, 'carrot', [4.4, 5.6], [[ox + 4, y + 1, oz - 2], [ox + 4, y - 1, oz - 2]], ORANGE);
  });

  // ---------------------------------------------------------------- Tiere
  wrap('chickenCooker', (b, ox, oz) => {
    if (oz !== 0) return;
    T(b, [0, 1.6], '1. Ein Huhn legt ein Ei – der Trichter bringt es in den Werfer');
    ITEM(b, 'egg', [0, 1.6], [[ox + 2, 2.3, oz], [ox + 1, 2.3, oz], [ox + 1, 1, oz]], '#f3ead2');
    T(b, [1.6, 2.6], '2. Der Beobachter-Takt lässt den Werfer feuern');
    FLASH(b, [1.6, 2.2], [ox + 1, 1, oz + 1], RED);
    FLASH(b, [2, 2.6], [ox + 1, 1, oz], RED);
    ITEM(b, 'egg', [2.2, 2.6], [[ox + 1, 1, oz], [ox, 1, oz]], '#f3ead2');
    T(b, [2.6, 5], '3. Das Küken schlüpft im Koch-Trichter und wächst heran');
    MOB(b, 'chicken', [2.6, 5], [[ox, 1.625, oz]], [0.5, 1]);
    T(b, [5, 6.2], '4. Erwachsen ist es zu groß: der Kopf berührt die Lava');
    MOB(b, 'chicken', [5, 6.2], [[ox, 1.625, oz]]);
    FLASH(b, [5, 6.2], [ox, 2, oz], ORANGE);
    T(b, [6.2, 7.4], '5. Gebratenes Hähnchen fällt in die Truhe');
    ITEM(b, 'chicken', [6.2, 7.4], [[ox, 1.4, oz], [ox, 0, oz]], '#c98a4a');
  });

  wrap('woolRow', (b, ox, n) => {
    const W = 2 * n - 1;
    T(b, [0, 1.2], '1. Das Schaf frisst das Gras – der Grasblock wird zu Erde');
    FLASH(b, [0, 1.2], [ox, 0, 0], GREEN);
    T(b, [1.2, 1.8], '2. Der Beobachter merkt die Änderung');
    FLASH(b, [1.2, 1.8], [ox, 0, 1], RED);
    T(b, [1.8, 2.4], '3. Der Werfer mit Schere schert das Schaf');
    FLASH(b, [1.8, 2.4], [ox, 1, 1], RED);
    T(b, [2.4, 4.4], '4. Die Wolle fällt aufs Gras, die Trichterlore darunter saugt sie ein');
    ITEM(b, 'wool', [2.4, 4.4], [[ox, 1.4, 0], [ox, 0.65, 0], [ox, -1, 0], [ox, -2, 0], [ox + W, -2, 0]], '#f2f2f2');
  });

  wrap('honeyRow', (b, ox, oz, n) => {
    if (oz !== 0) return;
    T(b, [0, 2], '1. Die Bienen bringen Nektar von den Blumen in den Stock');
    MOB(b, 'bee', [0, 2], [[ox, 1.4, oz + 2], [ox, 2, oz + 1.4], [ox, 1.2, oz + 0.7]]);
    T(b, [2, 2.8], '2. Der Stock ist voll – der Beobachter merkt es');
    FLASH(b, [2, 2.8], [ox, 2, oz], RED);
    T(b, [2.8, 3.4], '3. Der Werfer mit Schere erntet die Waben');
    FLASH(b, [2.8, 3.4], [ox, 1, oz - 1], RED);
    T(b, [3.4, 5.4], '4. Die Trichterlore unter dem Stock sammelt sie ein');
    ITEM(b, 'honeycomb', [3.4, 5.4], [[ox, 1.65, oz], [ox, 0, oz], [ox, -1, oz], [ox + 2 * (n - 1) + 1, -1, oz]], '#f2a72a');
  });

  // ---------------------------------------------------------------- Bruchstein
  wrap('cobbleGen', (b, ox, piston) => {
    if (ox !== 0) return;
    T(b, [0, 1.2], '1. Lava und Wasser fließen aufeinander zu');
    FLASH(b, [0, 1.2], [ox, 1, 0], ORANGE);
    FLASH(b, [0, 1.2], [ox + 3, 1, 0], BLUE);
    T(b, [1.2, 2.2], '2. Wo sie sich treffen, entsteht Bruchstein');
    if (!piston) {
      BLOCK(b, 'cobble', [1.2, 3.6], [ox + 1, 1, 0], false);
      T(b, [2.2, 3.6], '3. Du baust ihn ab – sofort entsteht ein neuer');
      FLASH(b, [2.2, 3.6], [ox + 1, 1, 1], '#ffd400');
    } else {
      BLOCK(b, 'cobble', [1.2, 2.8], [ox + 1, 1, 0], false);
      T(b, [2.2, 2.8], '3. Der Beobachter darüber sieht den neuen Stein');
      FLASH(b, [2.2, 2.8], [ox + 1, 2, 0], RED);
      T(b, [2.8, 4.4], '4. Der Kolben schiebt ihn nach vorne – dort baust du ganze Reihen ab');
      PUSH(b, [2.8, 3.6], [ox + 1, 1, -1], 's');
      BLOCK(b, 'cobble', [3.2, 4.4], [ox + 1, 1, 1], false);
    }
  });

  // ---------------------------------------------------------------- Einzelne Farmen (direkt in farms.js gebaut)
  MF.extraAnims = {
    'holz:1': (b) => {
      T(b, [0, 1.2], '1. Knopf drücken: Der Werfer gibt Knochenmehl auf die Setzlinge');
      FLASH(b, [0, 0.6], [-1, 2, 0], RED);
      FLASH(b, [0.4, 1.2], [-1, 1, 0], GREEN);
      T(b, [1.2, 4], '2. Die vier Setzlinge wachsen zu einer Riesenfichte');
      for (let y = 1; y <= 14; y++) for (const [x, z] of [[0, 0], [1, 0], [0, 1], [1, 1]]) BLOCK(b, 'log', [1.2 + y * 0.12, 5.4], [x, y, z], false);
      T(b, [4, 5.4], '3. Fällen, neu pflanzen, wieder drücken');
      FLASH(b, [4, 5.4], [-2, 1, 1], '#ffd400');
    },
    'blaze:1': (b) => {
      T(b, [0, 2.2], '1. Lohen spawnen und sinken langsam nach unten ins Loch');
      MOB(b, 'blaze', [0, 2.2], [[0, 3, 0], [0, 1.5, 2], [0, 0.5, 3]]);
      T(b, [2.2, 3.4], '2. Durch das Glasrohr kommen sie zu deinem Platz');
      MOB(b, 'blaze', [2.2, 3.4], [[0, 0.5, 3], [0, -3, 3]]);
      T(b, [3.4, 4.6], '3. Du triffst sie durch den Spalt');
      MOB(b, 'blaze', [3.4, 4.6], [[0, -3, 3]]);
      FLASH(b, [3.4, 4.6], [0, -3, 5], '#ffd400');
      ITEM(b, 'rod', [4.6, 5.6], [[0, -3, 3], [0, -5, 3]], '#ffb02e');
    },
    'blaze:2': (b) => {
      T(b, [0, 2.4], '1. Lohen sinken ins Loch und fallen in die 1×1-Kammer');
      MOB(b, 'blaze', [0, 2.4], [[0, 3, 0], [0, 0.5, 3], [0, -4, 3]]);
      T(b, [2.4, 3.8], '2. Ab 25 Lohen in einem Block sterben sie durch Gedränge');
      FLASH(b, [2.4, 3.8], [0, -4, 3], RED);
      T(b, [3.8, 5], '3. Die Lohenruten landen in der Truhe');
      ITEM(b, 'rod', [3.8, 5], [[0, -4.3, 3], [0, -5, 3], [1, -5, 3]], '#ffb02e');
    },
    'knochenmehl:0': (b) => {
      T(b, [0, 1.6], '1. Pflanzen aus der oberen Truhe wandern in den Komposter');
      ITEM(b, 'seeds', [0, 1.6], [[0, 3, 0], [0, 1, 0]], GREEN);
      T(b, [1.6, 2.6], '2. Nach 7 Schichten ist der Komposter voll');
      FLASH(b, [1.6, 2.6], [0, 1, 0], GREEN);
      T(b, [2.6, 3.8], '3. Das Knochenmehl fällt unten in die Truhe');
      ITEM(b, 'bonemeal', [2.6, 3.8], [[0, 1, 0], [0, -1, 0]], '#eee');
    },
    'knochenmehl:1': (b) => {
      T(b, [0, 1], '1. Knopf drücken: Knochenmehl landet auf dem Moos');
      FLASH(b, [0, 1], [3, 1, 3], GREEN);
      T(b, [1, 3], '2. Das Moos breitet sich auf die Steine rundherum aus');
      for (const [x, z] of [[2, 3], [4, 3], [3, 2], [3, 4], [2, 2], [4, 4], [1, 3], [5, 3], [3, 1], [3, 5]]) BLOCK(b, 'moss', [1 + Math.abs(x - 3) * 0.4 + Math.abs(z - 3) * 0.4, 4.6], [x, 0, z], false);
      T(b, [3, 4.6], '3. Moos abbauen und in die Komposter werfen – mehr Knochenmehl als vorher');
      ITEM(b, 'bonemeal', [3.4, 4.6], [[1, 2, 9], [1, 1, 9], [4, 1, 9]], '#eee');
    },
  };
  const dorf = (b, bedAt, gapAt, penAt, manual) => {
    if (manual) {
      T(b, [0, 1.6], '1. Du wirfst Karotten durch die Öffnung im Dach');
      ITEM(b, 'carrot', [0, 1.6], [[2, 4.5, 2], [2, 1, 2]], ORANGE);
    } else {
      T(b, [0, 1.6], '1. Der Bauer erntet Karotten und teilt sie mit dem anderen Dorfbewohner');
      MOB(b, 'farmer', [0, 1.6], [[2, 1, 1], [3, 1, 2], [4, 1, 2]]);
      ITEM(b, 'carrot', [1, 1.6], [[3.5, 1.6, 2], [4, 1.4, 3]], ORANGE);
    }
    T(b, [1.6, 2.8], '2. Satt und mit freiem Bett: Herzchen – ein Baby kommt');
    FLASH(b, [1.6, 2.8], bedAt, '#ff6fa8');
    T(b, [2.8, 4.8], '3. Das Baby ist kleiner als 1 Block und schlüpft durch den Spalt');
    MOB(b, 'villager', [2.8, 4.8], [bedAt, [gapAt[0] - 1, 1, gapAt[2]], gapAt, penAt], [0.5, 0.5]);
    FLASH(b, [3.4, 4.4], gapAt, '#ffd400');
    T(b, [4.8, 5.8], '4. Die Eltern sind zu groß und bleiben drin');
    MOB(b, 'villager', [4.8, 5.8], [penAt], [0.5, 0.5]);
  };
  MF.extraAnims['dorf:0'] = (b) => dorf(b, [2, 1, 1], [5, 1, 2], [7, 1, 2], true);
  MF.extraAnims['dorf:1'] = (b) => dorf(b, [5, 1, 3], [7, 1, 3], [9, 1, 3]);
  MF.extraAnims['dorf:2'] = (b) => dorf(b, [5, 1, 3], [7, 1, 3], [8, 1, 3]);
  MF.ITEMTEX.seeds = 'wheat_seeds';
  MF.ITEMTEX.rod = 'blaze_rod';
})();
