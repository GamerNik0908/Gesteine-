/* Schematic-Export: Sponge .schem (WorldEdit/FAWE) und .litematic (Litematica).
 * Beide Formate sind gzip-komprimiertes NBT. */
(function () {
  const MF = (window.MF = window.MF || {});
  const DATA_VERSION = 3955; // Minecraft 1.21.1

  // ---------------------------------------------------------------- NBT-Writer
  const T = { end: 0, byte: 1, short: 2, int: 3, long: 4, float: 5, double: 6, byteArray: 7, string: 8, list: 9, compound: 10, intArray: 11, longArray: 12 };
  const tag = (type, value, itemType) => ({ __nbt: true, type, value, itemType });
  const N = {
    byte: (v) => tag(T.byte, v), short: (v) => tag(T.short, v), int: (v) => tag(T.int, v),
    long: (v) => tag(T.long, BigInt(v)), string: (v) => tag(T.string, v),
    byteArray: (v) => tag(T.byteArray, v), intArray: (v) => tag(T.intArray, v),
    longArray: (v) => tag(T.longArray, v), list: (itemType, v) => tag(T.list, v, itemType),
    compound: (v) => tag(T.compound, v),
  };

  class Writer {
    constructor() { this.buf = new Uint8Array(1 << 16); this.len = 0; }
    ensure(n) {
      if (this.len + n <= this.buf.length) return;
      let size = this.buf.length * 2;
      while (size < this.len + n) size *= 2;
      const nb = new Uint8Array(size); nb.set(this.buf.subarray(0, this.len)); this.buf = nb;
    }
    u8(v) { this.ensure(1); this.buf[this.len++] = v & 255; }
    i16(v) { this.ensure(2); new DataView(this.buf.buffer).setInt16(this.len, v); this.len += 2; }
    i32(v) { this.ensure(4); new DataView(this.buf.buffer).setInt32(this.len, v); this.len += 4; }
    i64(v) { this.ensure(8); new DataView(this.buf.buffer).setBigInt64(this.len, BigInt.asIntN(64, v)); this.len += 8; }
    str(s) { const b = new TextEncoder().encode(s); this.i16(b.length); this.ensure(b.length); this.buf.set(b, this.len); this.len += b.length; }
    bytes(arr) { this.ensure(arr.length); this.buf.set(arr, this.len); this.len += arr.length; }
    payload(t) {
      switch (t.type) {
        case T.byte: this.u8(t.value); break;
        case T.short: this.i16(t.value); break;
        case T.int: this.i32(t.value); break;
        case T.long: this.i64(t.value); break;
        case T.string: this.str(t.value); break;
        case T.byteArray: this.i32(t.value.length); this.bytes(t.value); break;
        case T.intArray: this.i32(t.value.length); for (const v of t.value) this.i32(v); break;
        case T.longArray: this.i32(t.value.length); for (const v of t.value) this.i64(v); break;
        case T.list:
          this.u8(t.value.length ? t.itemType : (t.itemType || T.end));
          this.i32(t.value.length);
          for (const v of t.value) this.payload(v);
          break;
        case T.compound:
          for (const [k, v] of Object.entries(t.value)) { this.u8(v.type); this.str(k); this.payload(v); }
          this.u8(T.end);
          break;
      }
    }
    root(name, t) { this.u8(T.compound); this.str(name); this.payload(t); return this.buf.slice(0, this.len); }
  }

  async function gzip(bytes) {
    if (typeof CompressionStream === 'undefined') throw new Error('Dein Browser unterstützt keine Komprimierung (CompressionStream). Bitte einen aktuellen Browser verwenden.');
    const cs = new CompressionStream('gzip');
    const stream = new Blob([bytes]).stream().pipeThrough(cs);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  // Bauplan -> Gitter mit Blockzuständen
  function grid(structure) {
    const [W, H, L] = structure.size;
    const palette = new Map([['minecraft:air', 0]]);
    const states = [{ name: 'minecraft:air', props: {} }];
    const data = new Int32Array(W * H * L);
    for (const [x, y, z, key] of structure.blocks) {
      const st = MF.blockState(key);
      if (!st) continue;
      const s = MF.blockStateString(st);
      if (!palette.has(s)) { palette.set(s, palette.size); states.push(st); }
      data[(y * L + z) * W + x] = palette.get(s);
    }
    return { W, H, L, palette, states, data };
  }

  // ---------------------------------------------------------------- Sponge v2
  MF.toSchem = async function (structure, name) {
    const g = grid(structure);
    const varints = [];
    for (let i = 0; i < g.data.length; i++) {
      let v = g.data[i];
      while ((v & ~0x7f) !== 0) { varints.push((v & 0x7f) | 0x80); v >>>= 7; }
      varints.push(v);
    }
    const pal = {};
    for (const [k, v] of g.palette) pal[k] = N.int(v);
    const root = N.compound({
      Version: N.int(2),
      DataVersion: N.int(DATA_VERSION),
      Metadata: N.compound({ Name: N.string(name), Author: N.string('Farm-Planer') }),
      Width: N.short(g.W), Height: N.short(g.H), Length: N.short(g.L),
      Offset: N.intArray([0, 0, 0]),
      PaletteMax: N.int(g.palette.size),
      Palette: N.compound(pal),
      BlockData: N.byteArray(Uint8Array.from(varints)),
      BlockEntities: N.list(T.compound, []),
    });
    return gzip(new Writer().root('Schematic', root));
  };

  // ---------------------------------------------------------------- Litematica
  MF.toLitematic = async function (structure, name, desc) {
    const g = grid(structure);
    const bits = Math.max(2, Math.ceil(Math.log2(g.states.length)));
    const total = g.W * g.H * g.L;
    const longs = new Array(Math.ceil((total * bits) / 64)).fill(0n);
    const mask = (1n << BigInt(bits)) - 1n;
    for (let i = 0; i < total; i++) {
      const v = BigInt(g.data[i]) & mask;
      if (!v) continue;
      const start = i * bits;
      const li = Math.floor(start / 64), off = start % 64;
      longs[li] |= v << BigInt(off);
      if (off + bits > 64) longs[li + 1] |= v >> BigInt(64 - off);
    }
    const signed = longs.map((v) => BigInt.asIntN(64, v & ((1n << 64n) - 1n)));
    const pal = g.states.map((st) => {
      const c = { Name: N.string(st.name) };
      const keys = Object.keys(st.props);
      if (keys.length) {
        const p = {};
        for (const k of keys) p[k] = N.string(String(st.props[k]));
        c.Properties = N.compound(p);
      }
      return N.compound(c);
    });
    const now = Date.now();
    const solid = structure.blocks.filter((b) => MF.blockState(b[3])).length;
    const xyz = (x, y, z) => N.compound({ x: N.int(x), y: N.int(y), z: N.int(z) });
    const root = N.compound({
      Version: N.int(6),
      MinecraftDataVersion: N.int(DATA_VERSION),
      Metadata: N.compound({
        Name: N.string(name), Author: N.string('Farm-Planer'), Description: N.string(desc || ''),
        RegionCount: N.int(1), TotalBlocks: N.int(solid), TotalVolume: N.int(total),
        TimeCreated: N.long(now), TimeModified: N.long(now),
        EnclosingSize: xyz(g.W, g.H, g.L),
      }),
      Regions: N.compound({
        [name]: N.compound({
          Position: xyz(0, 0, 0),
          Size: xyz(g.W, g.H, g.L),
          BlockStatePalette: N.list(T.compound, pal),
          BlockStates: N.longArray(signed),
          TileEntities: N.list(T.compound, []),
          Entities: N.list(T.compound, []),
          PendingBlockTicks: N.list(T.compound, []),
          PendingFluidTicks: N.list(T.compound, []),
        }),
      }),
    });
    return gzip(new Writer().root('', root));
  };

  MF.download = function (bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
})();
