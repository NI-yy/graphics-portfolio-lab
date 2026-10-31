import { Engine } from '@babylonjs/core';
import { createGinkgoScene } from './createGinkgoScene';

export function createLandscape(canvas) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: false });
  const isNarrowScreen = () => canvas.clientWidth < 700;
  const maxPixelRatio = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.25);
  let pixelRatio = maxPixelRatio();
  engine.setHardwareScalingLevel(1 / pixelRatio);

  const ginkgo = createGinkgoScene(engine);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const look = { x: 0, y: 0 };
  let active = true, pointer = null, paused = false, elapsed = 0;
  let sampleStart = performance.now(), sampledFrames = 0;

  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { threshold: 0.01 });
  observer.observe(canvas);
  const onResize = () => {
    pixelRatio = Math.min(pixelRatio, maxPixelRatio());
    engine.setHardwareScalingLevel(1 / pixelRatio);
  };
  const onPointerDown = (event) => { canvas.setPointerCapture(event.pointerId); pointer = { x: event.clientX, y: event.clientY }; };
  const onPointerMove = (event) => {
    if (!pointer) return;
    look.x = Math.max(-1, Math.min(1, look.x + (event.clientX - pointer.x) / 650));
    look.y = Math.max(-1, Math.min(1, look.y + (event.clientY - pointer.y) / 650));
    pointer = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = () => { pointer = null; };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  engine.runRenderLoop(() => {
    if (!active || document.hidden) {
      sampleStart = performance.now();
      sampledFrames = 0;
      return;
    }
    if (!paused && !reducedMotion) elapsed += Math.min(engine.getDeltaTime(), 50) * .001;
    ginkgo.update(elapsed, look);
    ginkgo.scene.render();

    if (isNarrowScreen()) {
      sampledFrames++;
      const now = performance.now();
      if (now - sampleStart >= 3000) {
        const fps = sampledFrames * 1000 / (now - sampleStart);
        const limit = maxPixelRatio();
        const previousRatio = pixelRatio;
        if (fps < 40) pixelRatio = Math.max(1, pixelRatio - .125);
        else if (fps > 55) pixelRatio = Math.min(limit, pixelRatio + .125);
        if (pixelRatio !== previousRatio) engine.setHardwareScalingLevel(1 / pixelRatio);
        sampleStart = now;
        sampledFrames = 0;
      }
    }
  });

  return {
    setPaused(value) { paused = value; },
    dispose() {
      resizeObserver.disconnect();
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      engine.stopRenderLoop();
      ginkgo.scene.dispose();
      engine.dispose();
    },
  };
}
