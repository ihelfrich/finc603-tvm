// WebGL perpetuity scene — Three.js renders cash-flow bars receding into infinity.
// Camera slowly orbits to give a 3D parallax feel.

import * as THREE from "npm:three";

export function perpetuity3d({
  blocks,           // array of {year, amount, color (hex), label}
  rate,             // discount rate (for opacity/scale of receding bars)
  perpetuityFromYear, // year at which the perpetuity tail starts
  tailAmount,
  tailColor = 0x7030A0,
  width = 820,
  height = 360
} = {}) {
  const container = document.createElement("div");
  container.style.cssText = `width:100%;max-width:${width}px;height:${height}px;border-radius:8px;overflow:hidden;background:linear-gradient(180deg,#0F1730 0%,#1F3864 60%,#2E75B6 100%);box-shadow:0 8px 32px rgba(31,56,100,0.25);`;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1F3864, 12, 60);

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
  camera.position.set(-7, 6, 12);
  camera.lookAt(8, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = "width:100%;height:100%;display:block;";

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(5, 10, 5);
  scene.add(dir);
  const fill = new THREE.PointLight(0xFFD966, 0.6, 30);
  fill.position.set(-5, 6, 4);
  scene.add(fill);

  // Ground plane (subtle reflective grid)
  const grid = new THREE.GridHelper(80, 80, 0x4A6F9F, 0x2F4E78);
  grid.position.y = 0;
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  scene.add(grid);

  // Build a bar for each block
  const maxAmt = Math.max(...blocks.map(b => b.amount), tailAmount);
  const xSpacing = 1.5;
  const barW = 0.7;
  const barD = 0.7;

  function makeBar(year, amount, color, label, opacity = 1) {
    const h = (amount / maxAmt) * 4 + 0.05;
    const geom = new THREE.BoxGeometry(barW, h, barD);
    const mat = new THREE.MeshStandardMaterial({
      color, transparent: opacity < 1, opacity,
      metalness: 0.3, roughness: 0.35, emissive: color, emissiveIntensity: 0.15
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(year * xSpacing, h / 2, 0);
    scene.add(mesh);
    return mesh;
  }

  // Year labels on the ground (CanvasTexture)
  function makeYearLabel(year, text, opacity = 1) {
    const cnv = document.createElement("canvas");
    cnv.width = 256; cnv.height = 64;
    const cx = cnv.getContext("2d");
    cx.fillStyle = "rgba(255,255,255," + opacity + ")";
    cx.font = "bold 36px Arial";
    cx.textAlign = "center";
    cx.fillText(text, 128, 44);
    const tex = new THREE.CanvasTexture(cnv);
    tex.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.position.set(year * xSpacing, -0.6, 0);
    sprite.scale.set(2, 0.5, 1);
    scene.add(sprite);
  }

  // Real blocks
  blocks.forEach(b => {
    makeBar(b.year, b.amount, b.color, b.label, 1);
    makeYearLabel(b.year, `yr ${b.year}`, 1);
  });

  // Perpetuity tail — fading bars stretching toward the horizon
  if (perpetuityFromYear != null) {
    for (let i = 1; i <= 24; i++) {
      const yr = perpetuityFromYear + i;
      const opacity = Math.max(0.05, Math.exp(-i * 0.18));
      makeBar(yr, tailAmount, tailColor, null, opacity);
      if (i % 3 === 0 && opacity > 0.15) makeYearLabel(yr, `yr ${yr}`, opacity);
    }
    // "→ ∞" floating sprite at the end of the tail
    const cnv = document.createElement("canvas");
    cnv.width = 256; cnv.height = 96;
    const cx = cnv.getContext("2d");
    cx.fillStyle = "rgba(180,150,220,0.85)";
    cx.font = "bold 64px serif";
    cx.textAlign = "center";
    cx.fillText("→ ∞", 128, 72);
    const tex = new THREE.CanvasTexture(cnv);
    const inf = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    inf.position.set((perpetuityFromYear + 26) * xSpacing, 2.5, 0);
    inf.scale.set(3.5, 1.4, 1);
    scene.add(inf);
  }

  // Slow ambient camera orbit so the depth/parallax is felt
  let raf;
  let stopped = false;
  const t0 = performance.now();
  function animate(now) {
    if (stopped) return;
    const t = (now - t0) / 1000;
    camera.position.x = -7 + Math.sin(t * 0.12) * 1.4;
    camera.position.y = 5.5 + Math.sin(t * 0.16) * 0.7;
    camera.lookAt(8, 1.2, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function dispose() {
    if (stopped) return;
    stopped = true;
    if (raf != null) cancelAnimationFrame(raf);
    renderer.dispose();
    renderer.forceContextLoss?.();
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
    });
  }

  // Cleanup hook for explicit callers
  container._stop = dispose;

  // Auto-dispose when the container is removed from the DOM (Observable cell re-run).
  // This is critical — browsers cap WebGL contexts at ~16, and each slider drag would
  // otherwise leak a new context until rendering breaks entirely.
  const obs = new MutationObserver(() => {
    if (!container.isConnected) {
      dispose();
      obs.disconnect();
    }
  });
  requestAnimationFrame(() => {
    if (container.parentNode) obs.observe(container.parentNode, {childList: true, subtree: true});
  });

  // Also dispose on page unload as a backstop.
  window.addEventListener("beforeunload", dispose, {once: true});

  return container;
}
