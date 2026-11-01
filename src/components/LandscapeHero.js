import { useEffect, useRef, useState } from 'react';
import '../styles/LandscapeHero.css';
export default function LandscapeHero({ sceneOnly, cullingDemo, onToggleScene }) {
  const canvasRef = useRef(null), renderer = useRef(null);
  const sceneOnlyRef = useRef(sceneOnly);
  const cullingDemoRef = useRef(cullingDemo);
  const showStatsRef = useRef(false);
  sceneOnlyRef.current = sceneOnly;
  cullingDemoRef.current = cullingDemo;
  const [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(false);
  const [visibleMeshes, setVisibleMeshes] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  showStatsRef.current = showStats;
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyP' && !event.repeat) {
        event.preventDefault();
        setShowStats((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  useEffect(() => {
    let disposed = false;
    import('../createLandscape').then(({ createLandscape }) => {
      if (disposed) return;
      renderer.current = createLandscape(canvasRef.current, { onCullingChange: setVisibleMeshes, onStatsChange: setStats });
      renderer.current.setSceneOnly(sceneOnlyRef.current);
      renderer.current.setCullingDemo(cullingDemoRef.current);
      renderer.current.setStatsEnabled(showStatsRef.current);
      setStatus('ready');
    }).catch((error) => { if (!disposed) setStatus('error'); console.warn(error); });
    return () => { disposed = true; renderer.current?.dispose(); renderer.current = null; };
  }, []);
  useEffect(() => { renderer.current?.setSceneOnly(sceneOnly); }, [sceneOnly]);
  useEffect(() => { renderer.current?.setCullingDemo(cullingDemo); }, [cullingDemo]);
  useEffect(() => { renderer.current?.setStatsEnabled(showStats); }, [showStats]);
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
        <span>描画対象: {visibleMeshes?.visibleMeshes ?? '…'} / {visibleMeshes?.totalMeshes ?? '…'} メッシュ</span>
        <small>破線の内側だけ描画しています。ドラッグで見回せます。</small>
        <a href={window.location.pathname}>通常表示へ ↗</a>
      </div>
    </>}
    {showStats && <aside className="performance-hud" aria-label="描画性能" aria-live="off">
      <div className="performance-hud-header"><strong>描画性能</strong><button type="button" onClick={() => setShowStats(false)} aria-label="計測パネルを閉じる">×</button></div>
      <small>Alt + Shift + P で表示切替</small>
      {paused || reducedMotion ? <p>連続描画停止中</p> : status !== 'ready' ? <p>読み込み中…</p> : !stats ? <p>計測中…</p> : <dl>
        <div><dt>実測 FPS</dt><dd>{stats.fps} <small>/ 上限 {stats.targetFps}</small></dd></div>
        <div><dt>フレーム間隔 P95</dt><dd>{stats.frameP95?.toFixed(1) ?? '—'} ms</dd></div>
        <div><dt>描画処理 CPU 平均</dt><dd>{stats.renderMs.toFixed(1)} ms</dd></div>
        <div><dt>表示中の樹木メッシュ</dt><dd>{stats.visibleMeshes} / {stats.totalMeshes}</dd></div>
        <div><dt>描画対象の樹木三角形</dt><dd>{Math.round(stats.visibleTriangles / 1000)}k / {Math.round(stats.totalTriangles / 1000)}k</dd></div>
        <div><dt>描画解像度</dt><dd>{stats.width} × {stats.height}</dd></div>
        <div><dt>実効ピクセル比</dt><dd>{stats.pixelRatio.toFixed(2)}×</dd></div>
      </dl>}
      <small>ドラッグ中に測ると操作時の負荷が分かります。描画処理時間は GPU 実行時間を含みません。</small>
    </aside>}
    <aside className="landscape-controls" aria-label="イチョウ並木の操作">
      <div className="landscape-heading">
        <span className="landscape-title">日常で見た風景を描いています</span>
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
