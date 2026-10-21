import React from 'react';
import '../styles/Header.css';
import { Typewriter } from 'react-simple-typewriter'

function Header() {
  const words = ['Unity.', 'AR/VR devices.','Action & Story-driven Games.', 'watching the animation artworks.', ''];

  return (
    <section id="about" className="header-section">
      <div class="text-block-1">
        <text class="tex-line-1">
        Hello👋
        </text>
      </div>
      <div class="text-block-2">
        <text class="tex-line-2">
        I'm Nozomu Iwai, Game Software Engineer.
        </text>
      </div>
      <div class="text-block-3">
        <text class="tex-line-3">
        I like {' '}
        </text>
        <Typewriter
        words={words}
        loop={0}
        cursor
        cursorStyle='|'
        typeSpeed={150}
        deleteSpeed={50}
        delaySpeed={1000}
      />
      </div>
      <div class="text-block-4">
      <text className="text-lg">
      こんにちは、北海道大学 大学院情報科学院 修士2年の岩井望です。<br />
      y_yというユーザネームをよく使います。<br />
      <br />
      <a href="https://x.com/gamma_game_com" className="gamma-link">
        北大ゲーム開発コミュニティGamma
      </a>
      の部長を務めながらゲーム開発を行ってきました。<br />
      そしてXRのデバイスに強い興味があり、ゲーム、そしてXRデバイスのグラフィックスエンジニアを目指しています。
      大学ではHuman-Computer Interactionという領域において、XRによるユーザ支援や
      XRデバイスをより使いやすくするためのインタフェースに関する研究を行っています。<br />
      <br />
      アクションゲームとストーリー重視のゲームが好きです。<br />
      またアニメを見ることが好きで、web系アニメーターの方々の作画を見るのが好きです。<br />
      <br />
      </text>
      </div>
    </section>
  );
}

export default Header;
