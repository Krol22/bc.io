import * as PIXI from 'pixi.js';

import { TERRAIN, TANK, FOREST } from '../../../common/constants/renderLayers';

const GROUPS = {
  [TERRAIN]: 0,
  [TANK]: 1,
  [FOREST]: 2,
};

const PixiManager = {
  initialize: () => {
    PixiManager.renderer = PIXI.autoDetectRenderer(800, 600, {
      antialias: false,
      transparent: false,
    });

    PixiManager.stage = new PIXI.Container();
    
    PixiManager.layers = {};

    Object.keys(GROUPS).forEach(group => {
      const layer = new PIXI.Container();

      PixiManager.layers[group] = layer;

      PixiManager.stage.addChild(layer);
      PixiManager.stage.setChildIndex(layer, GROUPS[group]);
    });
  },

  render: () => {
    PixiManager.renderer.render(PixiManager.stage);
  },
};

PixiManager.initialize();

export default PixiManager;

