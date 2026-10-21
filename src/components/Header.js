import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <div className="about-panel">
      <div className="about-panel__intro">
        <p className="about-panel__eyebrow">ABOUT / NOZOMU IWAI</p>
        <h2>Technology for<br /><em>felt experiences.</em></h2>
        <p className="about-panel__role">Game Software Engineer<br />Graphics & XR</p>
      </div>
      <div className="about-panel__body">
        <p className="about-panel__lead">
          ゲームと XR を通じて、そこにいると感じられる体験をつくりたい。
        </p>
        <p>
          岩井望です。y_y というユーザーネームでも活動しています。
          <a href="https://x.com/gamma_game_com" target="_blank" rel="noopener noreferrer">北大ゲーム開発コミュニティ Gamma</a>
          の部長を務めながらゲーム開発に取り組んできました。
          ゲームや XR デバイスのグラフィックスエンジニアを目指しています。
        </p>
        <p>
          大学では Human-Computer Interaction の領域で、XR によるユーザー支援や、
          XR デバイスをより使いやすくするインターフェースについて研究しています。
        </p>
        <p>
          アクションゲームとストーリー重視のゲームが好きです。
          アニメーション、とくに web 系アニメーターの方々の作画にも惹かれています。
        </p>
      </div>
    </div>
  );
}

export default Header;
