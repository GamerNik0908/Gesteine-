/* Echte Minecraft-Texturen.
 * Die Texturen gehören Mojang und werden deshalb NICHT mitgeliefert. Der Nutzer wählt seine
 * eigene Minecraft-.jar (oder ein Resource Pack als .zip); die Texturen werden im Browser
 * entpackt und in IndexedDB gespeichert. Nichts wird hochgeladen. */
(function () {
  const MF = (window.MF = window.MF || {});
  const GRASS = '#8eb971';
  const FOLIAGE_STEM = '#9bba3c';

  // Block -> Texturen pro Seite. Felder: all, top, bottom, side, front, back, tint, cross
  MF.TEXMAP = {
    cobble: { all: 'cobblestone' }, stone: { all: 'stone' }, dirt: { all: 'dirt' },
    grass: { top: 'grass_block_top', side: 'grass_block_side', bottom: 'dirt', tintTop: GRASS },
    farmland: { top: 'farmland_moist', side: 'dirt', bottom: 'dirt' },
    sand: { all: 'sand' }, glass: { all: 'glass' }, glass_req: { all: 'glass' }, obsidian: { all: 'obsidian' },
    planks: { all: 'oak_planks' }, log: { side: 'oak_log', top: 'oak_log_top', bottom: 'oak_log_top' },
    slab: { top: 'smooth_stone', bottom: 'smooth_stone', side: 'smooth_stone_slab_side' },
    slab_top: { top: 'smooth_stone', bottom: 'smooth_stone', side: 'smooth_stone_slab_side' },
    netherrack: { all: 'netherrack' }, endstone: { all: 'end_stone' },
    podzol: { top: 'podzol_top', side: 'podzol_side', bottom: 'dirt' }, moss: { all: 'moss_block' },
    stonebricks: { all: 'stone_bricks' }, magma: { all: 'magma' }, soul_sand: { all: 'soul_sand' },
    slime: { all: 'slime_block' }, honey_block: { side: 'honey_block_side', top: 'honey_block_top', bottom: 'honey_block_bottom' },
    water: { all: 'water_still', tint: '#3f76e4' }, flow: { all: 'water_flow', tint: '#3f76e4' },
    lava: { all: 'lava_still' }, lava_flow: { all: 'lava_flow' },
    hopper: { side: 'hopper_outside', top: 'hopper_top', bottom: 'hopper_outside' },
    dispenser: { front: 'dispenser_front', frontV: 'dispenser_front_vertical', side: 'furnace_side', top: 'furnace_top', bottom: 'furnace_top' },
    dropper: { front: 'dropper_front', frontV: 'dropper_front_vertical', side: 'furnace_side', top: 'furnace_top', bottom: 'furnace_top' },
    observer: { front: 'observer_front', back: 'observer_back', side: 'observer_side', top: 'observer_top', bottom: 'observer_top' },
    piston: { front: 'piston_top', back: 'piston_bottom', side: 'piston_side' },
    sticky_piston: { front: 'piston_top_sticky', back: 'piston_bottom', side: 'piston_side' },
    redstone: { all: 'redstone_dust_dot', tint: '#e01010' },
    repeater: { top: 'repeater', side: 'smooth_stone', bottom: 'smooth_stone' },
    comparator: { top: 'comparator', side: 'smooth_stone', bottom: 'smooth_stone' },
    rs_torch: { all: 'redstone_torch', cross: true }, torch: { all: 'torch', cross: true },
    lever: { all: 'cobblestone' }, button: { all: 'stone' }, rs_block: { all: 'redstone_block' }, rs_lamp: { all: 'redstone_lamp' },
    rail: { all: 'rail' }, powered_rail: { all: 'powered_rail' },
    crafter: { front: 'crafter_north', side: 'crafter_east', top: 'crafter_top', bottom: 'crafter_bottom' },
    smoker: { front: 'smoker_front', side: 'smoker_side', top: 'smoker_top', bottom: 'smoker_bottom' },
    furnace: { front: 'furnace_front', side: 'furnace_side', top: 'furnace_top', bottom: 'furnace_top' },
    composter: { side: 'composter_side', top: 'composter_top', bottom: 'composter_bottom' },
    trapdoor: { all: 'oak_trapdoor' }, trapdoor_top: { all: 'oak_trapdoor' }, trapdoor_open: { all: 'oak_trapdoor' },
    sign: { all: 'oak_planks' }, fence: { all: 'oak_planks' }, carpet: { all: 'white_wool' }, ladder: { all: 'ladder' },
    bed: { all: 'red_wool' }, bed_head: { top: 'white_wool', side: 'red_wool', bottom: 'oak_planks' },
    campfire: { top: 'campfire_log_lit', side: 'campfire_log', bottom: 'campfire_log' },
    beehive: { front: 'beehive_front', side: 'beehive_side', top: 'beehive_end', bottom: 'beehive_end' },
    turtle_egg: { all: 'turtle_egg' }, spawner: { all: 'spawner' }, portal: { all: 'nether_portal' }, iron_bars: { all: 'iron_bars' },
    chest: null,
    sugarcane: { all: 'sugar_cane', cross: true }, cactus: { side: 'cactus_side', top: 'cactus_top', bottom: 'cactus_bottom' },
    bamboo: { all: 'bamboo_stalk' }, kelp: { all: 'kelp', cross: true },
    carrots: { all: 'carrots_stage3', cross: true }, wheat: { all: 'wheat_stage7', cross: true },
    melon_stem: { all: 'melon_stem', tint: FOLIAGE_STEM, cross: true }, pumpkin_stem: { all: 'pumpkin_stem', tint: FOLIAGE_STEM, cross: true },
    sapling: { all: 'birch_sapling', cross: true }, spruce_sapling: { all: 'spruce_sapling', cross: true },
    flower: { all: 'poppy', cross: true }, sweet_berry: { all: 'sweet_berry_bush_stage3', cross: true },
    melon: { side: 'melon_side', top: 'melon_top', bottom: 'melon_top' },
    pumpkin: { side: 'pumpkin_side', top: 'pumpkin_top', bottom: 'pumpkin_top' },
  };

  // Gegenstände für Animationen/Icons (textures/item)
  MF.ITEMTEX = {
    iron: 'iron_ingot', gold: 'gold_nugget', bone: 'bone', melon: 'melon_slice', carrot: 'carrot', egg: 'egg',
    chicken: 'cooked_chicken', cane: 'sugar_cane', bamboo: 'bamboo', kelp: 'kelp', wool: 'white_wool', slime: 'slime_ball',
    pearl: 'ender_pearl', rod: 'blaze_rod', gunpowder: 'gunpowder', honeycomb: 'honeycomb', bonemeal: 'bone_meal', cactus: 'cactus', log: 'spruce_log', flesh: 'rotten_flesh', cobble: 'cobblestone', emerald: 'emerald',
  };

  MF.tex = {}; // Name -> Canvas (16×16, erstes Animationsbild)
  MF.texReady = false;
  MF.texInfo = null;

  function neededNames() {
    const s = new Set();
    for (const v of Object.values(MF.TEXMAP)) if (v) for (const [k, n] of Object.entries(v)) if (typeof n === 'string' && !k.startsWith('tint')) s.add('block/' + n);
    for (const n of Object.values(MF.ITEMTEX)) { s.add('item/' + n); s.add('block/' + n); }
    return s;
  }

  // ---------------------------------------------------------------- ZIP lesen
  async function inflate(bytes) {
    const ds = new DecompressionStream('deflate-raw');
    const out = new Blob([bytes]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(out).arrayBuffer());
  }
  async function readZip(buf, wanted, onProgress) {
    const dv = new DataView(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 70000); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Keine gültige .jar/.zip-Datei.');
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const dec = new TextDecoder();
    const found = {};
    const jobs = [];
    for (let i = 0; i < count; i++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true);
      const csize = dv.getUint32(p + 20, true);
      const nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const lho = dv.getUint32(p + 42, true);
      const name = dec.decode(new Uint8Array(buf, p + 46, nlen));
      p += 46 + nlen + elen + clen;
      const m = name.match(/^assets\/minecraft\/textures\/((?:block|item)\/[a-z0-9_]+)\.png$/);
      if (!m || !wanted.has(m[1])) continue;
      jobs.push({ key: m[1], method, csize, lho });
    }
    let done = 0;
    for (const j of jobs) {
      const ln = dv.getUint16(j.lho + 26, true), le = dv.getUint16(j.lho + 28, true);
      const data = new Uint8Array(buf, j.lho + 30 + ln + le, j.csize);
      found[j.key] = j.method === 0 ? data.slice() : j.method === 8 ? await inflate(data) : null;
      if (onProgress && ++done % 20 === 0) onProgress(done / jobs.length);
    }
    return found;
  }

  // ---------------------------------------------------------------- Speicher (IndexedDB)
  function db() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('farm-planer', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('tex');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function dbPut(value) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction('tex', 'readwrite');
      t.objectStore('tex').put(value, 'pack');
      t.oncomplete = res; t.onerror = () => rej(t.error);
    });
  }
  async function dbGet() {
    const d = await db();
    return new Promise((res) => {
      const t = d.transaction('tex', 'readonly');
      const r = t.objectStore('tex').get('pack');
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    });
  }

  // PNG-Bytes -> Canvas (erstes Animationsbild, quadratisch)
  async function toCanvas(bytes) {
    const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const s = bmp.width;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    c.getContext('2d').drawImage(bmp, 0, 0, s, s, 0, 0, s, s);
    bmp.close && bmp.close();
    return c;
  }

  async function activate(files, info) {
    const out = {};
    for (const [k, bytes] of Object.entries(files)) {
      if (!bytes) continue;
      try { out[k] = await toCanvas(bytes); } catch (e) { /* kaputtes Bild überspringen */ }
    }
    MF.tex = out;
    MF.texReady = Object.keys(out).length > 10;
    MF.texInfo = info;
    MF.texVersion = (MF.texVersion || 0) + 1;
    window.dispatchEvent(new Event('mf-textures'));
  }

  MF.loadTexturePack = async function (file, onProgress) {
    if (typeof DecompressionStream === 'undefined') throw new Error('Dein Browser ist zu alt (DecompressionStream fehlt).');
    const buf = await file.arrayBuffer();
    const files = await readZip(buf, neededNames(), onProgress);
    const n = Object.keys(files).length;
    if (n < 10) throw new Error('In der Datei wurden kaum Block-Texturen gefunden. Wähle die Minecraft-.jar (versions/1.21.x/1.21.x.jar) oder ein Resource Pack.');
    const info = { name: file.name, count: n, date: Date.now() };
    try { await dbPut({ files, info }); } catch (e) { /* Speichern nicht möglich – gilt nur für diese Sitzung */ }
    await activate(files, info);
    return info;
  };

  MF.clearTexturePack = async function () {
    try { await dbPut(null); } catch (e) {}
    MF.tex = {}; MF.texReady = false; MF.texInfo = null;
    MF.texVersion = (MF.texVersion || 0) + 1;
    window.dispatchEvent(new Event('mf-textures'));
  };

  MF.restoreTexturePack = async function () {
    try {
      const v = await dbGet();
      if (v && v.files) await activate(v.files, v.info);
    } catch (e) { /* kein IndexedDB */ }
  };

  // ---------------------------------------------------------------- Zugriff
  const tintCache = {};
  // Canvas einer Textur, optional eingefärbt
  MF.texCanvas = function (name, tint) {
    const base = MF.tex['block/' + name] || MF.tex['item/' + name];
    if (!base) return null;
    if (!tint) return base;
    const k = name + '|' + tint + '|' + MF.texVersion;
    if (tintCache[k]) return tintCache[k];
    const c = document.createElement('canvas');
    c.width = base.width; c.height = base.width;
    const x = c.getContext('2d');
    x.drawImage(base, 0, 0);
    x.globalCompositeOperation = 'multiply';
    x.fillStyle = tint;
    x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'destination-in';
    x.drawImage(base, 0, 0);
    return (tintCache[k] = c);
  };

  // Textur-Name + Tönung für eine Blockseite. face: top|bottom|side|front|back
  MF.faceTex = function (base, face, dir) {
    const m = MF.TEXMAP[base];
    if (!m) return null;
    let n;
    if (face === 'front') n = (dir === 'u' || dir === 'd') && m.frontV ? m.frontV : m.front;
    else if (face === 'back') n = m.back;
    if (!n) n = face === 'front' || face === 'back' ? (dir === 'u' || dir === 'd' ? m.top : m.side) : m[face];
    if (!n) n = m.side || m.all || m.top;
    if (!n) return null;
    const tint = m.tint || (face === 'top' && m.tintTop) || null;
    return { name: n, tint };
  };

  // Icon-Canvas (Seite) für Listen und Schicht-Plan
  MF.iconTex = function (base, face) {
    if (!MF.texReady) return null;
    const ft = MF.faceTex(base, face || 'side', 's');
    return ft ? MF.texCanvas(ft.name, ft.tint) : null;
  };
  MF.itemTex = function (id) {
    if (!MF.texReady) return null;
    const n = MF.ITEMTEX[id];
    return n ? MF.tex['item/' + n] || MF.tex['block/' + n] || null : null;
  };
})();
