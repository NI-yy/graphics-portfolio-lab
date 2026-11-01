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
      こんにちは、岩井望です。ゲームエンジニアとして活動しています。y_yというユーザーネームをよく使います。<br />
      <br />
      大学では、
      <a href="https://x.com/gamma_game_com" className="gamma-link">
        北大ゲーム開発コミュニティGamma
      </a>
      の部長としてゲーム開発に取り組みました。また、Human-Computer Interactionの分野で、XRを活用したユーザー支援や、XRデバイスを使いやすくするインタフェースを研究しました。<br />
      <br />
      XRデバイスに強い関心があり、ゲームやXRのグラフィックス開発を専門とするエンジニアを目指しています。
      </text>
      </div>
    </section>
  );
}

export default Header;
