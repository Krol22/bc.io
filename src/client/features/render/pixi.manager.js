import * as PIXI from 'pixi.js';

const PixiManager = {
  initialize: () => {
    PixiManager.renderer = PIXI.autoDetectRenderer(800, 600, {
      antialias: false,
      transparent: false,
    });

    PixiManager.stage = new PIXI.Container();
  },

  render: () => {
    PixiManager.renderer.render(PixiManager.stage);
  },
};

PixiManager.initialize();

export default PixiManager;

