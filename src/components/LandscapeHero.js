import { useEffect, useRef, useState } from 'react';
import '../styles/LandscapeHero.css';
const scenes = [{ id: 'ginkgo', label: 'イチョウ' }, { id: 'ocean', label: '海' }, { id: 'meadow', label: '草原' }];
export default function LandscapeHero({ sceneOnly, onToggleScene }) {
  const canvasRef = useRef(null), renderer = useRef(null), selected = useRef('ginkgo');
  const [mode, setMode] = useState('ginkgo');
  const [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let disposed = false;
    import('../createLandscape').then(({ createLandscape }) => {
      if (disposed) return;
      renderer.current = createLandscape(canvasRef.current);
      renderer.current.setMode(selected.current);
      setStatus('ready');
    }).catch((error) => { if (!disposed) setStatus('error'); console.warn(error); });
    return () => { disposed = true; renderer.current?.dispose(); renderer.current = null; };
  }, []);
  const select = (value) => { selected.current = value; setMode(value); renderer.current?.setMode(value); };
  const togglePause = () => { setPaused(!paused); renderer.current?.setPaused(!paused); };
  return <>
    <div className={`landscape-background landscape-background--${mode}`}>
      <canvas ref={canvasRef} aria-label={`${scenes.find((item) => item.id === mode).label}のリアルタイム描画`} className={sceneOnly ? 'interactive' : ''} />
      <div className="landscape-shade" />
    </div>
    <aside className="landscape-controls" aria-label="背景の設定">
      <p className="landscape-note">日常で見つけた風景を、<br />少しずつ描いています。</p>
      <div className="scene-tabs" role="group" aria-label="背景を選ぶ">
        {scenes.map((item) => <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => select(item.id)}>{item.label}</button>)}
      </div>
      <div className="scene-actions">
        <button type="button" onClick={onToggleScene} aria-pressed={sceneOnly}>{sceneOnly ? 'ポートフォリオに戻る' : '風景だけ見る'} <span aria-hidden="true">↗</span></button>
        <button type="button" onClick={togglePause} aria-label={paused ? '背景の動きを再開' : '背景の動きを止める'} aria-pressed={paused}>{paused ? '再生' : '停止'}</button>
      </div>
      <p className="scene-status" role="status">{status === 'error' ? 'この環境では描画を開始できませんでした' : status === 'loading' ? '風景を読み込み中…' : sceneOnly ? 'ドラッグで見回せます' : 'Babylon.js で描画しています'}</p>
    </aside>
  </>;
}
