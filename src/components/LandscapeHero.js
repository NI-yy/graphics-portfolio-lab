import { useEffect, useRef, useState } from 'react';
import '../styles/LandscapeHero.css';
export default function LandscapeHero({ sceneOnly, cullingDemo, onToggleScene }) {
  const canvasRef = useRef(null), renderer = useRef(null);
  const sceneOnlyRef = useRef(sceneOnly);
  const cullingDemoRef = useRef(cullingDemo);
  sceneOnlyRef.current = sceneOnly;
  cullingDemoRef.current = cullingDemo;
  const [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(false);
  const [visibleMeshes, setVisibleMeshes] = useState(null);
  useEffect(() => {
    let disposed = false;
    import('../createLandscape').then(({ createLandscape }) => {
      if (disposed) return;
      renderer.current = createLandscape(canvasRef.current, { onCullingChange: setVisibleMeshes });
      renderer.current.setSceneOnly(sceneOnlyRef.current);
      renderer.current.setCullingDemo(cullingDemoRef.current);
      setStatus('ready');
    }).catch((error) => { if (!disposed) setStatus('error'); console.warn(error); });
    return () => { disposed = true; renderer.current?.dispose(); renderer.current = null; };
  }, []);
  useEffect(() => { renderer.current?.setSceneOnly(sceneOnly); }, [sceneOnly]);
  useEffect(() => { renderer.current?.setCullingDemo(cullingDemo); }, [cullingDemo]);
  const togglePause = () => { setPaused(!paused); renderer.current?.setPaused(!paused); };
  return <>
    <div className="landscape-background">
      <canvas ref={canvasRef} aria-label="イチョウ並木のリアルタイム描画" className={sceneOnly ? 'interactive' : ''} />
      <div className="landscape-shade" />
    </div>
    {cullingDemo && <>
      <div className="culling-demo-frame" aria-hidden="true" />
      <div className="culling-demo-hud">
        <strong>カリング確認モード</strong>
        <span>描画対象: {visibleMeshes ?? '…'} / 32 メッシュ</span>
        <small>破線は狭めた判定範囲の目安です。ドラッグで見回せます。</small>
        <a href={window.location.pathname}>通常表示へ ↗</a>
      </div>
    </>}
    <aside className="landscape-controls" aria-label="イチョウ並木の操作">
      <div className="landscape-heading">
        <span className="landscape-kicker">AUTUMN SCENE</span>
        <span className="landscape-title">イチョウ並木</span>
      </div>
      <div className="scene-actions">
        <button className="scene-view-button" type="button" onClick={onToggleScene} aria-pressed={sceneOnly}>{sceneOnly ? '作品を見る' : '景色を見る'} <span aria-hidden="true">↗</span></button>
        <button className="scene-motion-button" type="button" onClick={togglePause} aria-label={paused ? '背景の動きを再開' : '背景の動きを止める'} aria-pressed={paused}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
      </div>
      {status !== 'ready' && <p className="scene-status" role="status">{status === 'error' ? '描画を開始できませんでした' : '読み込み中…'}</p>}
      {sceneOnly && status === 'ready' && <p className="scene-hint">ドラッグで見回せます</p>}
    </aside>
  </>;
}
