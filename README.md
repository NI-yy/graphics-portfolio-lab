# Graphics Portfolio Lab
https://ni-yy.github.io/graphics-portfolio-lab/


イチョウ並木の風景を Babylon.js で描く、独立したポートフォリオです。
元サイトの自己紹介・作品・研究・経歴を保ち、全画面の描画背景に重ねています。

## 背景

- イチョウ: 一本道の両脇に続く並木を見上げる構図。手続き的な枝と葉に、生成した葉・樹皮の素材を貼り、葉ごとの色、透過光、風による揺れをシェーダーで描画します。輪郭には FXAA と高めの描画解像度を使います。写真そのものは背景に使用していません。
- 「景色を見る」で本文を隠し、ドラッグで視点を変更できます。Escape で本文に戻れます。
- 動きの停止、OS の動きを減らす設定、非表示タブでの描画停止に対応しています。
- `?culling-demo=1` を付けると、破線の内側だけを描画するカリング確認モードを開けます。描画対象メッシュ数も表示します。

```sh
npm ci --legacy-peer-deps
npm start
npm run build
```

背景の管理は `src/createLandscape.js`、イチョウの生成は `src/createGinkgoScene.js`、
UI は `src/components/LandscapeHero.js` にあります。Babylon.js は遅延読み込みします。
`main` への push で GitHub Pages に公開されます。

## Library used

- [React Simple Typewriter](https://www.npmjs.com/package/react-simple-typewriter)
- [Material UI - Card](https://mui.com/material-ui/react-card/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Material UI - Timeline](https://mui.com/material-ui/react-timeline/)

## References

- [Manuel Ernesto Garcia | Website](https://manuelernestog.github.io/)
- [ノグチデザイン(X)](https://x.com/n_seitan)
