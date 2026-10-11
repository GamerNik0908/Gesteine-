/* Kleiner Helfer zum Zusammenbauen der Baupläne.
 * Koordinaten: x = Osten, y = oben, z = Süden. */
(function () {
  const MF = (window.MF = window.MF || {});

  class Build {
    constructor() {
      this.m = new Map();
      this.mobs = [];
      this.anims = [];
    }
    // Animationsschritt (siehe viewer3d.js: mob, item, block, flash, push, text)
    anim(step) {
      this.anims.push(step);
      return this;
    }
    k(x, y, z) {
      return x + ',' + y + ',' + z;
    }
    set(x, y, z, key) {
      if (key == null) this.m.delete(this.k(x, y, z));
      else this.m.set(this.k(x, y, z), key);
      return this;
    }
    get(x, y, z) {
      return this.m.get(this.k(x, y, z));
    }
    // Quader füllen (Ecken in beliebiger Reihenfolge)
    fill(x1, y1, z1, x2, y2, z2, key, onlyEmpty) {
      const [ax, bx] = x1 < x2 ? [x1, x2] : [x2, x1];
      const [ay, by] = y1 < y2 ? [y1, y2] : [y2, y1];
      const [az, bz] = z1 < z2 ? [z1, z2] : [z2, z1];
      for (let x = ax; x <= bx; x++)
        for (let y = ay; y <= by; y++)
          for (let z = az; z <= bz; z++) {
            if (onlyEmpty && this.get(x, y, z)) continue;
            this.set(x, y, z, key);
          }
      return this;
    }
    // nur die senkrechten Außenwände eines Quaders
    walls(x1, y1, z1, x2, y2, z2, key, onlyEmpty) {
      this.fill(x1, y1, z1, x2, y2, z1, key, onlyEmpty);
      this.fill(x1, y1, z2, x2, y2, z2, key, onlyEmpty);
      this.fill(x1, y1, z1, x1, y2, z2, key, onlyEmpty);
      this.fill(x2, y1, z1, x2, y2, z2, key, onlyEmpty);
      return this;
    }
    // Mob/Tier/Lore hinzufügen
    mob(x, y, z, type, count) {
      this.mobs.push([x, y, z, type, count || 1]);
      return this;
    }
    // Ergebnis normalisieren (kleinste Koordinate = 0)
    done() {
      let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
      const pts = [];
      for (const [key, v] of this.m) {
        const [x, y, z] = key.split(',').map(Number);
        pts.push([x, y, z, v]);
      }
      for (const p of pts.concat(this.mobs)) {
        minX = Math.min(minX, p[0]); minY = Math.min(minY, p[1]); minZ = Math.min(minZ, p[2]);
        maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); maxZ = Math.max(maxZ, p[2]);
      }
      const blocks = pts.map((p) => [p[0] - minX, p[1] - minY, p[2] - minZ, p[3]]);
      const mobs = this.mobs.map((p) => [p[0] - minX, p[1] - minY, p[2] - minZ, p[3], p[4]]);
      blocks.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);
      const sh = (p) => [p[0] - minX, p[1] - minY, p[2] - minZ];
      const anim = this.anims.map((a) => Object.assign({}, a, a.at ? { at: sh(a.at) } : {}, a.path ? { path: a.path.map(sh) } : {}));
      return {
        size: [maxX - minX + 1, maxY - minY + 1, maxZ - minZ + 1],
        blocks,
        mobs,
        anim,
      };
    }
  }

  MF.Build = Build;
})();
