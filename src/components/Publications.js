import React from 'react';
import '../styles/Publications.css';

function Publications() {
  return (
    <section id="publications" className="publications-section">
      <h2>Publications</h2>
      <div className="publication-category">
        <h3>Demonstrations and Poster</h3>
        <p>1. <span className="underline-name">Nozomu Iwai</span> and Fabrice Matulic, Bringing Everyday Objects to Life in Augmented Reality with AI-Powered Talking Characters, Extended Abstract on CHI 2025 Late Breaking Work <a href="https://doi.org/10.1145/3706599.3719978"><span className="url-text">[DOI]</span></a></p>
      </div>
      <div className="publication-category">
        <h3>Refereed Domestic Conference</h3>
        <p>1. <span className="underline-name">岩井 望</span>, 阿部 優樹, 坂本 大介. 効率的な遠距離オブジェクトの回転操作を可能とするトラックボール型VRコントローラ. WISS 2025. 第33回インタラクティブシステムとソフトウェアに関するワークショップ. <a href="https://www.wiss.org/WISS2025Proceedings/data/paper/16.pdf"><span className="url-text">[URL]</span></a>
        </p>
        <p>2. <span className="underline-name">岩井 望</span>, 崔 明根, 坂本 大介, 小野哲夫. AR入力デバイスとしての身体装着型トラックボールの検討. インタラクション2024 情報処理学会. <a href="https://www.interaction-ipsj.org/proceedings/2024/data/bib/INT24008.html"><span className="url-text">[URL]</span></a>
        </p>
      </div>
    </section>
  );
}

export default Publications;