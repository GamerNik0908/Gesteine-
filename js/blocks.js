/* Block-, Mob- und Rohstoff-Definitionen.
 * Ein Block-Schlüssel im Bauplan hat die Form "basis" oder "basis:richtung"
 * (n, s, e, w, u, d). Die Richtung bestimmt "facing" im Schematic. */
(function () {
  const MF = (window.MF = window.MF || {});

  // Rohstoffe für die Rohstoff-Berechnung
  MF.RAW = {
    iron: 'Eisenbarren', gold: 'Goldbarren', redstone: 'Redstone', quartz: 'Netherquarz',
    log: 'Holzstämme', cobble: 'Bruchstein', string: 'Faden', slime: 'Schleimbälle',
    sand: 'Sand', wool: 'Wolle', coal: 'Kohle', honeycomb: 'Honigwaben', glowstone: 'Glowstonestaub',
  };

  const FILL = 'Egal welcher feste Block (Erde, Bruchstein, Stein, Bretter …)';

  /* Felder:
   * name     Anzeigename
   * id       Minecraft-ID (ohne Zustände)
   * color    Grundfarbe
   * shape    cube | slab | slabTop | flat | trap | trapTop | trapOpen | plant | crop | small | post |
   *          liquid | flow | glass | hopper | bed | entity | marker
   * flex     Text, wenn der Block austauschbar ist
   * raw      Rohstoffe pro Stück
   * item     Gruppierung in der To-Do-Liste (sonst Schlüssel)
   * front    Farbe der Vorderseite (für gerichtete Blöcke)
   * dirProp  Name der Richtungs-Eigenschaft im Schematic
   * props    feste Zusätze für den Blockzustand
   * noList   nicht in der Materialliste
   * noSchem  nicht im Schematic
   * pattern  Textur-Muster */
  MF.BLOCKS = {
    // ---------- Grundblöcke ----------
    cobble: { name: 'Bruchstein', id: 'cobblestone', color: '#7b7b7b', flex: FILL, pattern: 'cobble' },
    stone: { name: 'Stein', id: 'stone', color: '#8a8a8a', flex: FILL },
    dirt: { name: 'Erde', id: 'dirt', color: '#86603f', flex: 'Erde oder Grasblock' },
    grass: { name: 'Grasblock', id: 'grass_block', color: '#62a03c', pattern: 'grass', note: 'Muss Gras sein (Schafe fressen es)' },
    farmland: { name: 'Ackerboden', id: 'farmland', color: '#5a3b22', shape: 'farm', props: { moisture: 7 }, item: 'dirt_hoe', listName: 'Erde (mit Hacke zu Ackerboden)' },
    sand: { name: 'Sand', id: 'sand', color: '#dccf9c', pattern: 'sand' },
    glass: { name: 'Glas', id: 'glass', color: '#c6ecf5', shape: 'glass', raw: { sand: 1 }, flex: 'Glas oder anderer Block (Glas nur zum Durchschauen)', pattern: 'glass' },
    glass_req: { name: 'Glas', id: 'glass', color: '#c6ecf5', shape: 'glass', raw: { sand: 1 }, item: 'glass_req', note: 'Muss Glas sein – Golems spawnen nicht auf Glas', pattern: 'glass' },
    obsidian: { name: 'Obsidian', id: 'obsidian', color: '#1d1530', pattern: 'noise' },
    planks: { name: 'Eichenholzbretter', id: 'oak_planks', color: '#a8864f', raw: { log: 0.25 }, flex: FILL, pattern: 'planks' },
    log: { name: 'Eichenstamm', id: 'oak_log', color: '#6b5133', raw: { log: 1 }, pattern: 'log' },
    slab: { name: 'Glatte Steinstufe (unten)', id: 'smooth_stone_slab', color: '#a3a3a3', shape: 'slab', props: { type: 'bottom' }, raw: { cobble: 0.5 }, flex: 'Jede untere Stufe' },
    slab_top: { name: 'Glatte Steinstufe (oben)', id: 'smooth_stone_slab', color: '#a3a3a3', shape: 'slabTop', props: { type: 'top' }, raw: { cobble: 0.5 }, flex: 'Jede obere Stufe' },
    netherrack: { name: 'Netherrack', id: 'netherrack', color: '#6e3332', flex: 'Jeder feste Block, auf dem Mobs spawnen können', pattern: 'noise' },
    endstone: { name: 'Endstein', id: 'end_stone', color: '#dde2a5', flex: FILL },
    podzol: { name: 'Podsol', id: 'podzol', color: '#5c3d1e', flex: 'Erde, Grasblock oder Podsol' },
    moss: { name: 'Moosblock', id: 'moss_block', color: '#5b7f2e', pattern: 'noise' },
    stonebricks: { name: 'Steinziegel', id: 'stone_bricks', color: '#7d7d7d', flex: FILL, pattern: 'bricks' },
    magma: { name: 'Magmablock', id: 'magma_block', color: '#8c3b10', pattern: 'magma' },
    soul_sand: { name: 'Seelensand', id: 'soul_sand', color: '#53392b', pattern: 'noise' },
    slime: { name: 'Schleimblock', id: 'slime_block', color: '#7cc56e', shape: 'glass', opacity: 0.8, raw: { slime: 9 } },
    honey_block: { name: 'Honigblock', id: 'honey_block', color: '#f2a72a', shape: 'glass', opacity: 0.85 },

    // ---------- Flüssigkeiten ----------
    water: { name: 'Wasserquelle', id: 'water', color: '#3f76e4', shape: 'liquid', opacity: 0.55, listName: 'Wassereimer', note: 'Wasser ist unendlich: 2 Quellen nebeneinander = Endlosquelle' },
    flow: { name: 'Fließendes Wasser', id: 'water', color: '#5b8ff0', shape: 'flow', opacity: 0.3, noList: true, noSchem: true },
    lava: { name: 'Lavaquelle', id: 'lava', color: '#e65f14', shape: 'liquid', opacity: 0.9, listName: 'Lavaeimer' },
    lava_flow: { name: 'Fließende Lava', id: 'lava', color: '#f07a2a', shape: 'flow', opacity: 0.75, noList: true, noSchem: true },

    // ---------- Technik ----------
    hopper: { name: 'Trichter', id: 'hopper', color: '#4b4b50', shape: 'hopper', dirProp: 'facing', front: '#2a2a2e', raw: { iron: 5, log: 2 } },
    chest: { name: 'Truhe', id: 'chest', color: '#a8722b', raw: { log: 2 }, pattern: 'chest' },
    dispenser: { name: 'Werfer', id: 'dispenser', color: '#6e6e6e', dirProp: 'facing', front: '#2b2b2b', raw: { cobble: 7, redstone: 1, string: 3, log: 0.4 }, pattern: 'cobble' },
    dropper: { name: 'Spender', id: 'dropper', color: '#6a6a6a', dirProp: 'facing', front: '#333', raw: { cobble: 7, redstone: 1 }, pattern: 'cobble' },
    observer: { name: 'Beobachter', id: 'observer', color: '#5d5d5d', dirProp: 'facing', front: '#2f2f2f', raw: { cobble: 6, redstone: 2, quartz: 1 }, note: 'Das „Gesicht" zeigt auf den Block, der beobachtet wird' },
    piston: { name: 'Kolben', id: 'piston', color: '#8d8274', dirProp: 'facing', front: '#b89a66', raw: { log: 0.75, cobble: 4, iron: 1, redstone: 1 } },
    sticky_piston: { name: 'Klebriger Kolben', id: 'sticky_piston', color: '#8d8274', dirProp: 'facing', front: '#7cc56e', raw: { log: 0.75, cobble: 4, iron: 1, redstone: 1, slime: 1 } },
    redstone: { name: 'Redstone-Staub', id: 'redstone_wire', color: '#c00000', shape: 'flat', raw: { redstone: 1 } },
    repeater: { name: 'Redstone-Verstärker', id: 'repeater', color: '#a0a0a0', shape: 'flat2', dirProp: 'facing', dirInvert: true, front: '#ff2b2b', raw: { cobble: 3, redstone: 3, log: 0.1 } },
    comparator: { name: 'Redstone-Komparator', id: 'comparator', color: '#a0a0a0', shape: 'flat2', dirProp: 'facing', dirInvert: true, front: '#ff6b6b', raw: { cobble: 3, redstone: 3, quartz: 1, log: 0.1 } },
    rs_torch: { name: 'Redstone-Fackel', id: 'redstone_torch', color: '#ff3030', shape: 'small', raw: { redstone: 1, log: 0.1 } },
    torch: { name: 'Fackel', id: 'torch', color: '#ffcf4d', shape: 'small', raw: { coal: 0.25, log: 0.1 }, flex: 'Fackel, Laterne oder andere Lichtquelle' },
    lever: { name: 'Hebel', id: 'lever', color: '#6b5133', shape: 'small', props: { face: 'floor' }, raw: { cobble: 1, log: 0.1 } },
    button: { name: 'Knopf', id: 'stone_button', color: '#8a8a8a', shape: 'small', props: { face: 'floor' }, raw: { cobble: 1 }, flex: 'Jeder Knopf' },
    rs_block: { name: 'Redstone-Block', id: 'redstone_block', color: '#a5140c', raw: { redstone: 9 } },
    rs_lamp: { name: 'Redstone-Lampe', id: 'redstone_lamp', color: '#7a4a22', raw: { redstone: 4, glowstone: 4 } },
    rail: { name: 'Schiene', id: 'rail', color: '#8a7a64', shape: 'flat', raw: { iron: 0.4 } },
    powered_rail: { name: 'Antriebsschiene', id: 'powered_rail', color: '#c9a227', shape: 'flat', raw: { gold: 1, redstone: 0.2 } },
    crafter: { name: 'Werkbank-Automat (Crafter)', id: 'crafter', color: '#6d6d74', dirProp: 'orientation', raw: { iron: 5, cobble: 7, redstone: 3, log: 1 } },
    smoker: { name: 'Räucherofen', id: 'smoker', color: '#55504a', dirProp: 'facing', front: '#2a2522', raw: { cobble: 8, log: 4 } },
    furnace: { name: 'Ofen', id: 'furnace', color: '#727272', dirProp: 'facing', front: '#2f2f2f', raw: { cobble: 8 } },
    composter: { name: 'Komposter', id: 'composter', color: '#7b5a2e', shape: 'hopper', raw: { log: 0.9 }, pattern: 'planks' },
    trapdoor: { name: 'Holzfalltür (unten)', id: 'oak_trapdoor', color: '#8b6a3e', shape: 'trap', props: { half: 'bottom', open: 'false' }, raw: { log: 0.75 }, item: 'trapdoor', flex: 'Jede Holzfalltür' },
    trapdoor_top: { name: 'Holzfalltür (oben)', id: 'oak_trapdoor', color: '#8b6a3e', shape: 'trapTop', props: { half: 'top', open: 'false' }, raw: { log: 0.75 }, item: 'trapdoor', flex: 'Jede Holzfalltür' },
    trapdoor_open: { name: 'Holzfalltür (offen)', id: 'oak_trapdoor', color: '#8b6a3e', shape: 'trapOpen', dirProp: 'facing', props: { half: 'bottom', open: 'true' }, raw: { log: 0.75 }, item: 'trapdoor', flex: 'Jede Holzfalltür' },
    sign: { name: 'Schild', id: 'oak_sign', color: '#b38b55', shape: 'small', raw: { log: 0.6 }, flex: 'Jedes Schild (hält Wasser/Lava fest)' },
    fence: { name: 'Holzzaun', id: 'oak_fence', color: '#8b6a3e', shape: 'post', raw: { log: 0.45 }, flex: 'Jeder Zaun oder jede Mauer' },
    carpet: { name: 'Teppich', id: 'white_carpet', color: '#e9ecec', shape: 'flat', raw: { wool: 0.67 }, flex: 'Jeder Teppich' },
    ladder: { name: 'Leiter', id: 'ladder', color: '#a07a45', shape: 'trapOpen', dirProp: 'facing', raw: { log: 0.3 } },
    bed: { name: 'Bett', id: 'red_bed', color: '#b52b2b', shape: 'bed', dirProp: 'facing', props: { part: 'foot' }, raw: { wool: 3, log: 0.75 }, flex: 'Jede Bettfarbe' },
    bed_head: { name: 'Bett (Kopfteil)', id: 'red_bed', color: '#e8e8e8', shape: 'bed', dirProp: 'facing', props: { part: 'head' }, noList: true },
    campfire: { name: 'Lagerfeuer', id: 'campfire', color: '#8a6a3a', shape: 'slab', props: { lit: 'true' }, raw: { log: 3.4, coal: 1 }, note: 'Rauch beruhigt die Bienen' },
    beehive: { name: 'Bienenstock', id: 'beehive', color: '#c99c4c', dirProp: 'facing', front: '#5b3f17', raw: { log: 1.5, honeycomb: 3 }, pattern: 'planks' },
    turtle_egg: { name: 'Schildkrötenei', id: 'turtle_egg', color: '#ede8cf', shape: 'crop', note: 'Nur mit Behutsamkeit abbaubar – lockt Zombies/Piglins an' },
    spawner: { name: 'Monsterspawner', id: 'spawner', color: '#26384a', shape: 'glass', opacity: 0.9, noList: true, noSchem: true },
    portal: { name: 'Netherportal', id: 'nether_portal', color: '#8a2be2', shape: 'glass', opacity: 0.55, props: { axis: 'x' }, noList: true, noSchem: true },
    iron_bars: { name: 'Eisengitter', id: 'iron_bars', color: '#9a9a9a', shape: 'post', raw: { iron: 0.375 } },

    // ---------- Pflanzen ----------
    sugarcane: { name: 'Zuckerrohr', id: 'sugar_cane', color: '#8fc163', shape: 'plant' },
    cactus: { name: 'Kaktus', id: 'cactus', color: '#2f7a2a', shape: 'cactus' },
    bamboo: { name: 'Bambus', id: 'bamboo', color: '#6aa232', shape: 'thinplant' },
    kelp: { name: 'Seetang', id: 'kelp', color: '#3c7d2b', shape: 'plant', note: 'Wird unter Wasser gepflanzt' },
    carrots: { name: 'Karotten', id: 'carrots', color: '#e08a2a', shape: 'crop', note: 'Auch Kartoffeln oder Weizen möglich' },
    wheat: { name: 'Weizensamen', id: 'wheat', color: '#c4b14a', shape: 'crop' },
    melon_stem: { name: 'Melonenkerne', id: 'melon_stem', color: '#8c9b2f', shape: 'crop', note: 'Oder Kürbiskerne' },
    pumpkin_stem: { name: 'Kürbiskerne', id: 'pumpkin_stem', color: '#8c9b2f', shape: 'crop', note: 'Oder Melonenkerne' },
    sapling: { name: 'Eichensetzling', id: 'oak_sapling', color: '#4a7d2a', shape: 'plant', flex: 'Jede Setzlingsart (Birke wächst am kompaktesten)' },
    spruce_sapling: { name: 'Fichtensetzling', id: 'spruce_sapling', color: '#2f5a2f', shape: 'plant', note: '4 Stück im 2×2 ergeben eine Riesenfichte' },
    flower: { name: 'Blume', id: 'poppy', color: '#d23a3a', shape: 'crop', flex: 'Jede Blume' },
    sweet_berry: { name: 'Süßbeerstrauch', id: 'sweet_berry_bush', color: '#3f6b2a', shape: 'crop' },
    melon: { name: 'Melone (wächst hier)', id: 'melon', color: '#7aa02a', noList: true, noSchem: true },

    // ---------- Mobs & Fahrzeuge (nicht im Schematic) ----------
    villager: { name: 'Dorfbewohner', color: '#a87c5d', shape: 'entity', size: [0.6, 1.9], entity: true, how: 'Mit Boot/Lore herbringen oder Zombie-Dorfbewohner heilen' },
    farmer: { name: 'Bauer (Dorfbewohner)', color: '#c9a35d', shape: 'entity', size: [0.6, 1.9], entity: true, how: 'Arbeitsloser Dorfbewohner + Komposter = Bauer' },
    zombie: { name: 'Zombie (mit Namensschild)', color: '#4f8a3c', shape: 'entity', size: [0.6, 1.95], entity: true, how: 'Namensschild geben, damit er nicht verschwindet' },
    chicken: { name: 'Huhn', color: '#f2f2f2', shape: 'entity', size: [0.4, 0.7], entity: true, how: 'Mit Samen anlocken oder Eier werfen' },
    sheep: { name: 'Schaf', color: '#e6e6e6', shape: 'entity', size: [0.9, 1.3], entity: true, how: 'Mit Weizen anlocken (Farbe egal, kann gefärbt werden)' },
    cat: { name: 'Katze', color: '#d39a4c', shape: 'entity', size: [0.6, 0.7], entity: true, how: 'Streunende Katze im Dorf mit rohem Fisch zähmen' },
    bee: { name: 'Biene', color: '#f2c230', shape: 'entity', size: [0.7, 0.6], entity: true, how: 'Bienennest mit Behutsamkeit abbauen (Bienen bleiben drin)' },
    golem: { name: 'Eisengolem', color: '#d8d0c4', shape: 'entity', size: [1.4, 2.7], entity: true, how: '4 Eisenblöcke + geschnitzter Kürbis' },
    snow_golem: { name: 'Schneegolem', color: '#f5f5f5', shape: 'entity', size: [0.7, 1.9], entity: true, how: '2 Schneeblöcke + geschnitzter Kürbis' },
    endermite: { name: 'Endermite (mit Namensschild)', color: '#4b2b6a', shape: 'entity', size: [0.4, 0.3], entity: true, how: 'Entsteht manchmal beim Enderperlen-Werfen' },
    hcart: { name: 'Trichterlore', color: '#4b4b50', shape: 'entity', size: [0.98, 0.7], entity: true, raw: { iron: 10, log: 2 }, how: 'Trichter + Lore', craft: true },
    minecart: { name: 'Lore', color: '#7a7a7a', shape: 'entity', size: [0.98, 0.7], entity: true, raw: { iron: 5 }, how: '5 Eisenbarren', craft: true },

    // ---------- Markierungen ----------
    afk: { name: 'Dein AFK-/Standplatz', color: '#ffd400', shape: 'marker', noList: true, noSchem: true },
    out: { name: 'Hier entsteht das Produkt', color: '#ff7ad9', shape: 'marker', noList: true, noSchem: true },
  };

  // Richtungen
  MF.DIRS = {
    n: { name: 'north', v: [0, 0, -1], de: 'Norden' },
    s: { name: 'south', v: [0, 0, 1], de: 'Süden' },
    e: { name: 'east', v: [1, 0, 0], de: 'Osten' },
    w: { name: 'west', v: [-1, 0, 0], de: 'Westen' },
    u: { name: 'up', v: [0, 1, 0], de: 'oben' },
    d: { name: 'down', v: [0, -1, 0], de: 'unten' },
  };
  MF.OPP = { n: 's', s: 'n', e: 'w', w: 'e', u: 'd', d: 'u' };

  MF.parseKey = function (key) {
    const i = key.indexOf(':');
    if (i < 0) return { base: key, dir: null };
    return { base: key.slice(0, i), dir: key.slice(i + 1) };
  };

  // Minecraft-Blockzustand für das Schematic
  MF.blockState = function (key) {
    const { base, dir } = MF.parseKey(key);
    const d = MF.BLOCKS[base];
    if (!d || d.noSchem || d.entity) return null;
    const props = Object.assign({}, d.props || {});
    if (d.dirProp) {
      let dd = dir || (base === 'hopper' ? 'd' : 's');
      if (d.dirInvert) dd = MF.OPP[dd];
      if (d.dirProp === 'orientation') props.orientation = MF.DIRS[dd].name + '_up';
      else props[d.dirProp] = MF.DIRS[dd].name;
    }
    return { name: 'minecraft:' + d.id, props };
  };

  MF.blockStateString = function (st) {
    const keys = Object.keys(st.props).sort();
    if (!keys.length) return st.name;
    return st.name + '[' + keys.map((k) => k + '=' + st.props[k]).join(',') + ']';
  };
})();
