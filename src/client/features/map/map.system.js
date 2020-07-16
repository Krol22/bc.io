import { EcsSystem } from '@krol22/ecs';

import PixiManager from '../render/pixi.manager';

import * as PIXI from 'pixi.js';

const frameWidth = 16;
const frameHeight = 16;

const mapElements = {
  BLOCK: new PIXI.Rectangle(16 * frameWidth, 0 * frameHeight, frameWidth, frameHeight),
  WATER: new PIXI.Rectangle(16 * frameWidth, 2 * frameHeight, frameWidth, frameHeight),
  GRASS: new PIXI.Rectangle(17 * frameWidth, 2 * frameHeight, frameWidth, frameHeight),
  METAL: new PIXI.Rectangle(16 * frameWidth, 1 * frameHeight, frameWidth, frameHeight),
  ICE: new PIXI.Rectangle(18 * frameWidth, 2 * frameHeight, frameWidth, frameHeight),
};

class MapSystem extends EcsSystem {
  constructor() {
    super(['MAP']);
  }

  onEntityAdded() {
    const spriteSheet = new PIXI.BaseTexture.from(PIXI.Loader.shared.resources['tanks'].url);

    this.systemEntities.forEach(mapEntity => {

      const { map } = mapEntity.getComponent('MAP');

      map.forEach(({ x, y, type }) => {
        const texture = new PIXI.Texture(spriteSheet, mapElements[type]);

        const mapSprite = new PIXI.Sprite(texture);

        mapSprite.x = x * frameWidth;
        mapSprite.y = y * frameWidth;

        PixiManager.stage.addChild(mapSprite);
      });
    });
  }

  tick() {}
}

export default MapSystem;
