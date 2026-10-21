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
    <section className={`landscape-hero landscape-hero--${mode}`} aria-label="海と草原の描画デモ">
      <h2>描画デモ</h2>
      <div className="landscape-hero__viewport">
        <div className="landscape-hero__fallback" aria-hidden="true" />
        <canvas ref={canvasRef} className="landscape-hero__canvas" aria-label={mode === 'ocean' ? '海の描画' : '草原の描画'} />
      </div>
      <div className="landscape-hero__controls">
        <div className="landscape-hero__modes" role="group" aria-label="表示する風景">
          <button type="button" aria-pressed={mode === 'ocean'} onClick={() => selectMode('ocean')}>海</button>
          <button type="button" aria-pressed={mode === 'meadow'} onClick={() => selectMode('meadow')}>草原</button>
        </div>
        <span className="landscape-hero__hint">{sceneReady ? 'ドラッグで視点を変更' : '読み込み中'}</span>
      </div>
    </section>
  );
}

export default LandscapeHero;
