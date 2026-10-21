import { useEffect, useRef, useState } from 'react';
import '../styles/LandscapeHero.css';

function LandscapeHero() {
  const canvasRef = useRef(null);
  const landscapeRef = useRef(null);
  const [mode, setMode] = useState('ocean');
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import('../createLandscape').then(({ createLandscape }) => {
      if (cancelled || !canvasRef.current) return;
      try {
        landscapeRef.current = createLandscape(canvasRef.current);
        setSceneReady(true);
      } catch (error) {
        // The color gradient remains visible when WebGL is unavailable.
        console.warn('The interactive landscape could not start.', error);
      }
    }).catch((error) => {
      console.warn('The interactive landscape could not load.', error);
    });

    return () => {
      cancelled = true;
      landscapeRef.current?.dispose();
      landscapeRef.current = null;
    };
  }, []);

  const selectMode = (nextMode) => {
    setMode(nextMode);
    landscapeRef.current?.setMode(nextMode);
  };

  return (
    <section className={`landscape-hero landscape-hero--${mode}`} aria-label="Interactive ocean and meadow landscape">
      <div className="landscape-hero__fallback" aria-hidden="true" />
      <canvas ref={canvasRef} className="landscape-hero__canvas" aria-hidden="true" />
      <div className="landscape-hero__shade" aria-hidden="true" />
      <div className="landscape-hero__vertical" aria-hidden="true">IN PURSUIT OF PRESENCE — VOL. 01</div>
      <div className="landscape-hero__content">
        <p className="landscape-hero__eyebrow"><span className="landscape-hero__eyebrow-line" /> GRAPHICS ENGINEER · NOZOMU IWAI</p>
        <h1>Light becomes<br /><em>a place.</em></h1>
        <p className="landscape-hero__description">
          光の反射、波のゆらぎ、風の気配。<br />
          見るだけでなく、そこにいると感じる世界をつくる。
        </p>
        <a className="landscape-hero__cta" href="#works">EXPLORE THE WORK <span aria-hidden="true">↗</span></a>
      </div>
      <div className="landscape-hero__bottomline">
        <div className="landscape-hero__modes" role="group" aria-label="Landscape view">
          <span className="landscape-hero__view-label">CHOOSE A WORLD</span>
          <button type="button" aria-pressed={mode === 'ocean'} onClick={() => selectMode('ocean')}><span>01</span> THE SEA</button>
          <button type="button" aria-pressed={mode === 'meadow'} onClick={() => selectMode('meadow')}><span>02</span> THE FIELD</button>
        </div>
        <span className="landscape-hero__hint">{sceneReady ? 'DRAG THE SCENE TO LOOK AROUND' : 'LOADING THE SCENE'}</span>
      </div>
    </section>
  );
}

export default LandscapeHero;
