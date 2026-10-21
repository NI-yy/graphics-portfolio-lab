# Graphics Portfolio Lab
https://ni-yy.github.io/graphics-portfolio-lab/


Babylon.js による海と草原の描画を試す、独立したポートフォリオです。
元のサイト `NI-yy.github.io` とは別のリポジトリで公開します。

## Interactive landscape

The opening scene is rendered with Babylon.js. A fragment shader traces view
rays against animated ocean and rolling terrain height fields. The sky, clouds,
water reflections, grass colors, and atmospheric haze are procedural. **THE SEA**
and **THE FIELD** switch environments; dragging rotates the view. There is no
photographic backdrop in the interactive landscape. This uses shader-based
height-field tracing, not hardware ray tracing or path tracing. Text and
navigation remain available if WebGL cannot start.

```sh
npm install
npm start
npm run build
```

The scene lives in `src/createLandscape.js`; its React wrapper and responsive
layout are in `src/components/LandscapeHero.js` and
`src/styles/LandscapeHero.css`. The Babylon.js bundle loads only when the
opening scene mounts.

## Library used

- [React Simple Typewriter](https://www.npmjs.com/package/react-simple-typewriter)
- [Animated Burger Components](https://march08.github.io/animated-burgers/)
- [Material UI - Card](https://mui.com/material-ui/react-card/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Material UI - Timeline](https://mui.com/material-ui/react-timeline/)

## References

- [Manuel Ernesto Garcia | Website](https://manuelernestog.github.io/)
- [ノグチデザイン(X)](https://x.com/n_seitan)
