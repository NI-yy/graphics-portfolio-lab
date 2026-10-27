import { Engine } from '@babylonjs/core';
import { createGinkgoScene } from './createGinkgoScene';

export function createLandscape(canvas) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: false });
  const hardwareScale = () => Math.max(.8, Math.min(2, window.devicePixelRatio / 1.5));
  engine.setHardwareScalingLevel(hardwareScale());

  const ginkgo = createGinkgoScene(engine);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const look = { x: 0, y: 0 };
  let active = true, pointer = null, paused = false, elapsed = 0;

  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { threshold: 0.01 });
  observer.observe(canvas);
  const onResize = () => { engine.setHardwareScalingLevel(hardwareScale()); engine.resize(); };
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
    if (!active || document.hidden) return;
    if (!paused && !reducedMotion) elapsed += Math.min(engine.getDeltaTime(), 50) * .001;
    ginkgo.update(elapsed, look);
    ginkgo.scene.render();
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
