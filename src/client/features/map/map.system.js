import { EcsSystem } from '@krol22/ecs';

import PixiManager from '../render/pixi.manager';

import * as PIXI from 'pixi.js';

import { SPAWN, TREES } from '../../../common/constants/mapTypes';
import { FRAME_WIDTH, FRAME_HEIGHT, GAME_SCALE } from '../../../common/constants';
import { TERRAIN, FOREST } from '../../../common/constants/renderLayers';

const mapElements = {
  BLOCK: new PIXI.Rectangle(16 * FRAME_WIDTH, 0 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
  WATER: new PIXI.Rectangle(16 * FRAME_WIDTH, 2 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
  TREES: new PIXI.Rectangle(17 * FRAME_WIDTH, 2 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
  METAL: new PIXI.Rectangle(16 * FRAME_WIDTH, 1 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
  ICE: new PIXI.Rectangle(18 * FRAME_WIDTH, 2 * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT),
};

class MapSystem extends EcsSystem {
  constructor() {
    super(['MAP']);
  }

  onEntityAdded() {
    const spriteSheet = new PIXI.BaseTexture.from(PIXI.Loader.shared.resources['tanks'].url);

    this.systemEntities.forEach(mapEntity => {
      const { map } = mapEntity.getComponent('MAP');

      map
        .filter(({ type }) => type !== SPAWN)
        .forEach(({ x, y, type }) => {
          const texture = new PIXI.Texture(spriteSheet, mapElements[type]);

          const mapSprite = new PIXI.Sprite(texture);

          mapSprite.x = x * FRAME_WIDTH * GAME_SCALE;
          mapSprite.y = y * FRAME_HEIGHT * GAME_SCALE;

          mapSprite.scale.set(GAME_SCALE, GAME_SCALE);

          if (type === TREES) {
            PixiManager.layers[FOREST].addChild(mapSprite);
            return;
          }

          PixiManager.layers[TERRAIN].addChild(mapSprite);
        });
    });
  }

  tick() {}
}

export default MapSystem;
