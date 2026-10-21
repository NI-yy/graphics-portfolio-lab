# Graphics Portfolio Lab
https://ni-yy.github.io/graphics-portfolio-lab/


日常で撮影した風景を Babylon.js で再現する、独立したポートフォリオです。
元サイトの自己紹介・作品・研究・経歴を保ち、全画面の描画背景に重ねています。

## 背景

- イチョウ: 写真の見上げる構図を参考にした手続き的な枝と葉。生成した葉・樹皮の素材を立体に貼り、葉ごとの色、透過光、風による揺れをシェーダーで描画します。写真そのものは背景に使用していません。
- 海・草原: 高さ場をレイでたどるシェーダーによる描画。ハードウェアレイトレーシングやパストレーシングではありません。
- 「風景だけ見る」で本文を隠し、ドラッグで視点を変更できます。Escape で本文に戻れます。
- 動きの停止、OS の動きを減らす設定、非表示タブでの描画停止に対応しています。

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
