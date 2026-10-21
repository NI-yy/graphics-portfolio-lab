import { useState } from 'react';
import LandscapeHero from './components/LandscapeHero';
import Header from './components/Header';
import Works from './components/Works';
import Publications from './components/Publications';
import Awards from './components/Awards';
import History from './components/History';
import ashiart from './img/AshiArt.jpg';
import sugosuba from './img/sugosuba.png';
import arCharacter from './img/AR_character.png';
import './App.css';

const featured = [
  {
    number: '01',
    type: 'ALGORITHM / EXPERIENCE',
    name: 'AhiArt',
    description: '一筆書きの絵を、実際に走れるルートへ。計算と体験をつなぐ GPS アート。',
    image: ashiart,
    link: 'https://ashiart.vercel.app/home',
    award: 'JPHACKS 2025 · BEST HACK',
  },
  {
    number: '02',
    type: 'GAME / REALTIME GRAPHICS',
    name: 'すごいすばやいすぴーど',
    description: '地表すれすれの低空飛行を楽しむ、スピード感のあるアクションゲーム。',
    image: sugosuba,
    link: 'https://unityroom.com/games/low_altitude_flight',
    award: 'UNITY 1 WEEK',
  },
  {
    number: '03',
    type: 'XR / HUMAN INTERACTION',
    name: 'おしゃべり AR キャラクター',
    description: '身の回りの物体に個性を与え、対話できる存在へ変える AR 体験。',
    image: arCharacter,
    link: 'https://tech.preferred.jp/ja/blog/%e3%81%8a%e3%81%97%e3%82%83%e3%81%b9%e3%82%8aar%e3%82%ad%e3%83%a3%e3%83%a9%e3%82%af%e3%82%bf%e3%83%bc/',
    award: 'PREFERRED NETWORKS · CHI 2025',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site">
      <header className="site-header">
        <a className="site-brand" href="#top" onClick={closeMenu} aria-label="Nozomu Iwai, top">
          <span className="site-brand__mark">N<span>.</span></span>
          <span className="site-brand__name">NOZOMU<br />IWAI</span>
        </a>
        <button className="site-menu-button" type="button" aria-expanded={menuOpen}
          aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'CLOSE' : 'MENU'} <span aria-hidden="true">{menuOpen ? '×' : '+'}</span>
        </button>
        <nav id="site-navigation" className={menuOpen ? 'site-nav site-nav--open' : 'site-nav'} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>ABOUT</a>
          <a href="#works" onClick={closeMenu}>WORKS</a>
          <a href="#approach" onClick={closeMenu}>APPROACH</a>
          <a href="#contact" onClick={closeMenu}>CONTACT <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main>
        <div id="top"><LandscapeHero /></div>
        <section id="about" className="site-section site-section--about">
          <div className="section-kicker"><span>01 / INTRODUCTION</span><span>SCROLL TO DISCOVER</span></div>
          <Header />
        </section>

        <section id="works" className="site-section site-section--works">
          <div className="section-kicker"><span>02 / SELECTED WORK</span><span>2024 — 2026</span></div>
          <div className="section-heading">
            <h2>Things made<br /><em>to be felt.</em></h2>
            <p>ゲーム、XR、アルゴリズム。技術を体験へ変えたプロジェクトを紹介します。</p>
          </div>
          <div className="featured-list">
            {featured.map((work) => (
              <a className="featured-work" href={work.link} key={work.number} target="_blank" rel="noopener noreferrer">
                <div className="featured-work__image"><img src={work.image} alt="" loading="lazy" /></div>
                <div className="featured-work__info">
                  <div className="featured-work__meta"><span>{work.number} / {work.type}</span><span>↗</span></div>
                  <h3>{work.name}</h3>
                  <p>{work.description}</p>
                  <span className="featured-work__award">{work.award}</span>
                </div>
              </a>
            ))}
          </div>
          <details className="archive-disclosure">
            <summary>すべての作品を見る <span aria-hidden="true">＋</span></summary>
            <Works />
          </details>
        </section>

        <section id="approach" className="site-section site-section--approach">
          <div className="section-kicker"><span>03 / APPROACH</span><span>LIGHT · MOTION · PRESENCE</span></div>
          <div className="approach-grid">
            <h2>Making the<br /><em>invisible tangible.</em></h2>
            <div>
              <p className="approach-lead">画面の向こうに、空気を感じる体験を。</p>
              <p>リアルタイム描画、インタラクション、空間コンピューティングを横断し、人の感覚に届く表現を探求しています。</p>
              <div className="approach-tags"><span>REALTIME GRAPHICS</span><span>GAME DEVELOPMENT</span><span>XR / HCI</span><span>CREATIVE CODING</span></div>
            </div>
          </div>
        </section>

        <section className="site-section site-section--record" aria-label="Publications, awards and history">
          <div className="section-kicker"><span>04 / RECORD</span><span>RESEARCH & EXPERIENCE</span></div>
          <div className="record-grid">
            <div><Publications /></div>
            <div><Awards /></div>
            <div><History /></div>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <p className="site-footer__kicker">LET'S MAKE SOMETHING REAL</p>
        <h2>Beyond the<br /><em>screen.</em></h2>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} NOZOMU IWAI</span>
          <div><a href="https://github.com/NI-yy" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="https://x.com/yy88804046" target="_blank" rel="noopener noreferrer">X ↗</a><a href="https://www.linkedin.com/in/nozomu-iwai-b3a218325/" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a></div>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
