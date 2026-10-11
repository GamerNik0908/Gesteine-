/* 3D-Ansicht der Baupläne (Three.js r128, InstancedMesh pro Blocktyp). */
(function () {
  const MF = (window.MF = window.MF || {});

  // ---------------------------------------------------------------- Texturen
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1).padEnd(6, hex.slice(-1)), 16);
    if (hex.length === 4) {
      const r = parseInt(hex[1] + hex[1], 16), g = parseInt(hex[2] + hex[2], 16), b = parseInt(hex[3] + hex[3], 16);
      return [r, g, b];
    }
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  MF.hexToRgb = hexToRgb;

  // Zeichnet eine 16×16-Pixeltextur in ein Canvas (wird auch für Icons genutzt)
  MF.drawTexture = function (ctx, key, size) {
    const d = MF.BLOCKS[key];
    const [r0, g0, b0] = hexToRgb(d.color);
    const rnd = rng(hash(key));
    const img = ctx.createImageData(16, 16);
    const p = d.pattern || 'noise';
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        let f = 1 + (rnd() - 0.5) * 0.22;
        let a = 255;
        let [r, g, b] = [r0, g0, b0];
        if (p === 'planks') { if (y % 4 === 3) f *= 0.72; if ((x + (y >> 2) * 5) % 8 === 0 && y % 4 !== 3) f *= 0.85; }
        else if (p === 'bricks') { if (y % 4 === 3 || (x + ((y >> 2) % 2) * 4) % 8 === 7) f = 0.65; }
        else if (p === 'log') { if (x % 4 === 0) f *= 0.8; }
        else if (p === 'cobble') { const n = Math.sin(x * 1.7 + y * 0.9) + Math.cos(x * 0.6 - y * 1.3); if (n > 1.2) f *= 1.15; if (n < -1.2) f *= 0.72; }
        else if (p === 'glass') { const edge = x === 0 || y === 0 || x === 15 || y === 15; a = edge ? 150 : 28; if (edge) f = 1.1; if (x === y + 3 && x > 4 && x < 10) a = 120; }
        else if (p === 'grass') { if (y < 4 || rnd() < 0.15) { r = 95; g = 160; b = 60; } else { r = 134; g = 96; b = 63; } }
        else if (p === 'magma') { if (rnd() < 0.18) { r = 255; g = 140; b = 40; f = 1; } }
        else if (p === 'chest') { if (y === 6 || y === 7) f *= 0.6; if ((x === 7 || x === 8) && y > 4 && y < 9) { r = 200; g = 200; b = 200; } }
        else if (p === 'sand') f = 1 + (rnd() - 0.5) * 0.1;
        const i = (y * 16 + x) * 4;
        img.data[i] = Math.min(255, r * f);
        img.data[i + 1] = Math.min(255, g * f);
        img.data[i + 2] = Math.min(255, b * f);
        img.data[i + 3] = a;
      }
    if (size === 16) ctx.putImageData(img, 0, 0);
    else {
      const c = document.createElement('canvas'); c.width = c.height = 16;
      c.getContext('2d').putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(c, 0, 0, size, size);
    }
  };

  const texCache = {};
  function texture(key) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement('canvas'); c.width = c.height = 16;
    MF.drawTexture(c.getContext('2d'), key, 16);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return (texCache[key] = t);
  }

  // ---------------------------------------------------------------- Formen
  const geoCache = {};
  function box(w, h, d, y0) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, (y0 || 0) + h / 2 - 0.5, 0);
    return g;
  }
  function geometry(shape) {
    if (geoCache[shape]) return geoCache[shape];
    let g;
    switch (shape) {
      case 'slab': g = box(1, 0.5, 1, 0); break;
      case 'slabTop': g = box(1, 0.5, 1, 0.5); break;
      case 'farm': g = box(1, 0.9375, 1, 0); break;
      case 'flat': g = box(0.9, 0.0625, 0.9, 0); break;
      case 'flat2': g = box(1, 0.125, 1, 0); break;
      case 'trap': g = box(1, 0.1875, 1, 0); break;
      case 'trapTop': g = box(1, 0.1875, 1, 0.8125); break;
      case 'trapOpen': g = new THREE.BoxGeometry(1, 1, 0.1875); g.translate(0, 0, 0.5 - 0.09375); break;
      case 'plant': g = box(0.7, 1, 0.7, 0); break;
      case 'thinplant': g = box(0.35, 1, 0.35, 0); break;
      case 'cactus': g = box(0.875, 1, 0.875, 0); break;
      case 'crop': g = box(0.75, 0.5, 0.75, 0); break;
      case 'small': g = box(0.2, 0.6, 0.2, 0); break;
      case 'post': g = box(0.25, 1, 0.25, 0); break;
      case 'liquid': g = box(1, 0.875, 1, 0); break;
      case 'flow': g = box(1, 0.5, 1, 0); break;
      case 'hopper': g = box(0.9, 1, 0.9, 0); break;
      case 'bed': g = box(1, 0.5625, 1, 0); break;
      case 'marker': g = new THREE.OctahedronGeometry(0.32); break;
      default: g = new THREE.BoxGeometry(1, 1, 1);
    }
    return (geoCache[shape] = g);
  }
  const DIR_ROT = { s: 0, n: Math.PI, e: Math.PI / 2, w: -Math.PI / 2 };

  // ---------------------------------------------------------------- Viewer
  class Viewer {
    constructor(el, opts) {
      this.el = el;
      this.opts = opts || {};
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(this.renderer.domElement);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.12;
      this.controls.screenSpacePanning = true;
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 0.75);
      sun.position.set(0.6, 1, 0.35);
      this.scene.add(sun);
      const back = new THREE.DirectionalLight(0xffffff, 0.25);
      back.position.set(-0.5, 0.3, -0.8);
      this.scene.add(back);
      this.group = new THREE.Group();
      this.scene.add(this.group);
      this.layer = 0;
      this.mode = 'all';
      this.showMobs = true;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.tip = document.createElement('div');
      this.tip.className = 'viewer-tip';
      el.appendChild(this.tip);
      this._onMove = this.onMove.bind(this);
      this.renderer.domElement.addEventListener('pointermove', this._onMove);
      this.renderer.domElement.addEventListener('pointerleave', () => (this.tip.style.display = 'none'));
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(el);
      this.resize();
      this.running = true;
      const loop = () => {
        if (!this.running) return;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(loop);
      };
      loop();
    }

    resize() {
      const w = this.el.clientWidth, h = this.el.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    destroy() {
      this.running = false;
      this.ro.disconnect();
      this.clear();
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }

    clear() {
      while (this.group.children.length) {
        const m = this.group.children.pop();
        if (m.material && m.material.dispose && m.userData.ownMat) m.material.dispose();
        if (m.dispose) m.dispose();
      }
      this.pickables = [];
    }

    load(structure) {
      this.s = structure;
      const [W, H, L] = structure.size;
      this.center = new THREE.Vector3(W / 2, H / 2, L / 2);
      this.layer = H - 1;
      this.rebuild();
      this.resetView();
      // Boden-Raster
      if (this.grid) this.scene.remove(this.grid);
      const n = Math.max(W, L) + 6;
      this.grid = new THREE.GridHelper(n, n, 0x888888, 0x555555);
      this.grid.material.transparent = true;
      this.grid.material.opacity = 0.25;
      this.grid.position.set(W / 2, -0.01, L / 2);
      this.scene.add(this.grid);
    }

    resetView(top) {
      const [W, H, L] = this.s.size;
      const r = Math.max(W, H, L);
      const c = this.center;
      this.controls.target.copy(c);
      if (top) this.camera.position.set(c.x, c.y + r * 1.9, c.z + 0.01);
      else this.camera.position.set(c.x + r * 1.05, c.y + r * 0.85, c.z + r * 1.25);
      this.camera.near = 0.1;
      this.camera.far = r * 20 + 100;
      this.camera.updateProjectionMatrix();
    }

    setLayer(y, mode) {
      if (y != null) this.layer = y;
      if (mode) this.mode = mode;
      this.rebuild();
    }

    visible(y) {
      if (this.mode === 'all') return 1;
      if (this.mode === 'upto') return y < this.layer ? 0.5 : y === this.layer ? 1 : 0;
      if (this.mode === 'only') return y === this.layer ? 1 : y === this.layer - 1 ? 0.28 : 0;
      return 1;
    }

    rebuild() {
      this.clear();
      if (!this.s) return;
      const groups = {};
      const fronts = [];
      const mobs = [];
      for (const b of this.s.blocks) {
        const f = this.visible(b[1]);
        if (!f) continue;
        const { base, dir } = MF.parseKey(b[3]);
        const d = MF.BLOCKS[base];
        if (!d) continue;
        (groups[base] = groups[base] || []).push([b, f, dir]);
        if (d.front && dir) fronts.push([b, f, dir, d.front]);
      }
      const mat4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const col = new THREE.Color();
      const up = new THREE.Vector3(0, 1, 0);
      for (const base in groups) {
        const d = MF.BLOCKS[base];
        const list = groups[base];
        const shape = d.shape || 'cube';
        let mat;
        if (shape === 'marker') {
          mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.85 });
        } else {
          const transparent = ['glass', 'liquid', 'flow'].includes(shape) || d.opacity;
          mat = new THREE.MeshLambertMaterial({
            map: texture(base),
            transparent: !!transparent,
            opacity: d.opacity || 1,
            depthWrite: !transparent || shape === 'glass',
            alphaTest: shape === 'glass' ? 0.05 : 0,
            side: transparent ? THREE.DoubleSide : THREE.FrontSide,
          });
        }
        const mesh = new THREE.InstancedMesh(geometry(shape), mat, list.length);
        mesh.userData = { base, list, ownMat: true };
        list.forEach(([b, f, dir], i) => {
          q.setFromAxisAngle(up, shape === 'trapOpen' && dir ? DIR_ROT[MF.OPP[dir]] || 0 : 0);
          mat4.compose(new THREE.Vector3(b[0] + 0.5, b[1] + 0.5, b[2] + 0.5), q, new THREE.Vector3(1, 1, 1));
          mesh.setMatrixAt(i, mat4);
          col.setRGB(f, f, f);
          mesh.setColorAt(i, col);
        });
        if (['glass', 'liquid', 'flow'].includes(shape)) mesh.renderOrder = 2;
        this.group.add(mesh);
        this.pickables.push(mesh);
      }
      // Vorderseiten (Richtungsanzeige)
      if (fronts.length) {
        const g = new THREE.BoxGeometry(0.62, 0.62, 0.04);
        const mesh = new THREE.InstancedMesh(g, new THREE.MeshLambertMaterial({ color: 0xffffff }), fronts.length);
        mesh.userData.ownMat = true;
        fronts.forEach(([b, f, dir, color], i) => {
          const v = MF.DIRS[dir].v;
          const pos = new THREE.Vector3(b[0] + 0.5 + v[0] * 0.5, b[1] + 0.5 + v[1] * 0.5, b[2] + 0.5 + v[2] * 0.5);
          const n = new THREE.Vector3(v[0], v[1], v[2]);
          q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
          const shapeH = MF.BLOCKS[MF.parseKey(b[3]).base].shape;
          if (shapeH === 'flat2') { pos.y = b[1] + 0.13; q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2); pos.x = b[0] + 0.5 + v[0] * 0.3; pos.z = b[2] + 0.5 + v[2] * 0.3; }
          mat4.compose(pos, q, shapeH === 'flat2' ? new THREE.Vector3(0.4, 0.4, 1) : new THREE.Vector3(1, 1, 1));
          mesh.setMatrixAt(i, mat4);
          const [r, gg, bb] = hexToRgb(color);
          col.setRGB((r / 255) * f, (gg / 255) * f, (bb / 255) * f);
          mesh.setColorAt(i, col);
        });
        this.group.add(mesh);
      }
      // Mobs
      if (this.showMobs && this.s.mobs.length) {
        const byType = {};
        for (const m of this.s.mobs) {
          const f = this.visible(m[1]);
          if (!f) continue;
          (byType[m[3]] = byType[m[3]] || []).push([m, f]);
        }
        const blockAt = {};
        for (const b of this.s.blocks) blockAt[b[0] + ',' + b[1] + ',' + b[2]] = b[3];
        const lift = { hopper: 0.625, bed: 0.5625, slab: 0.5, composter: 0.125, rail: 0.0625 };
        for (const type in byType) {
          const d = MF.BLOCKS[type];
          const list = [];
          for (const [m, f] of byType[type]) {
            const n = Math.min(m[4], 4);
            for (let k = 0; k < n; k++) list.push([m, f, k, n]);
          }
          const [w, h] = d.size;
          const g = new THREE.BoxGeometry(w, h, w);
          g.translate(0, h / 2, 0);
          const mesh = new THREE.InstancedMesh(g, new THREE.MeshLambertMaterial({ color: d.color }), list.length);
          mesh.userData = { base: type, list: list.map((x) => [x[0], x[1]]), ownMat: true, mob: true };
          list.forEach(([m, f, k, n], i) => {
            const under = blockAt[m[0] + ',' + m[1] + ',' + m[2]];
            const ly = under ? lift[MF.parseKey(under).base] || 0 : 0;
            const off = n > 1 ? [(k % 2 - 0.5) * 0.3, ((k >> 1) - 0.5) * 0.3] : [0, 0];
            mat4.makeTranslation(m[0] + 0.5 + off[0] * (w < 0.7 ? 1 : 0), m[1] + ly, m[2] + 0.5 + off[1] * (w < 0.7 ? 1 : 0));
            mesh.setMatrixAt(i, mat4);
            col.setRGB(f, f, f);
            mesh.setColorAt(i, col);
          });
          this.group.add(mesh);
          this.pickables.push(mesh);
        }
      }
    }

    onMove(e) {
      if (!this.pickables || !this.pickables.length) return;
      const r = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.pickables, false);
      const hit = hits.find((h) => h.object.userData.base !== 'flow');
      if (!hit) { this.tip.style.display = 'none'; return; }
      const ud = hit.object.userData;
      const item = ud.list[hit.instanceId];
      if (!item) return;
      const b = item[0];
      const d = MF.BLOCKS[ud.base];
      const { dir } = ud.mob ? { dir: null } : MF.parseKey(b[3]);
      let txt = '<b>' + d.name + '</b>';
      if (ud.mob && b[4] > 1) txt += ' ×' + b[4];
      if (dir && d.dirProp) txt += '<br><small>zeigt nach ' + MF.DIRS[dir].de + '</small>';
      if (d.flex) txt += '<br><small class="flex">austauschbar</small>';
      txt += '<br><small>Schicht ' + (b[1] + 1) + ' · x ' + b[0] + ' · z ' + b[2] + '</small>';
      this.tip.innerHTML = txt;
      this.tip.style.display = 'block';
      this.tip.style.left = e.clientX - r.left + 14 + 'px';
      this.tip.style.top = e.clientY - r.top + 10 + 'px';
    }

    snapshot() {
      this.renderer.render(this.scene, this.camera);
      return this.renderer.domElement.toDataURL('image/png');
    }
  }

  MF.Viewer = Viewer;
})();
