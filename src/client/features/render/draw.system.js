import { EcsSystem } from '@krol22/ecs';
import * as PIXI from 'pixi.js';

import PixiManager from './pixi.manager';

import { GAME_SCALE } from '../../../common/constants';
import { TANK } from '../../../common/constants/renderLayers';

class DrawSystem extends EcsSystem {
  constructor() {
    super(['DRAW']);
  }

  initializePixi() {
    PixiManager.initialize();

    this.systemEntities.forEach(entity => {
      const drawComponent = entity.getComponent('DRAW');

      const { sprite } = drawComponent;

      PixiManager.graphics = new PIXI.Graphics();

      PixiManager.layers[TANK].addChild(sprite);
      PixiManager.layers[TANK].addChild(PixiManager.graphics);
    });

    document.querySelector('#canvas').appendChild(PixiManager.renderer.view);
  }

  onServerTick(serverEntities) {
    serverEntities.forEach(serverEntity => {
      const networkId = serverEntity.components.find(({ _type }) => _type === 'NETWORK').id;
      const clientEntity = this.systemEntities.find((entity) => entity.getComponent('NETWORK').id === networkId);
      
      if (!clientEntity) {
        return;
      }

      const serverPhysicsComponent = serverEntity.components.find(({ _type }) => _type === 'PHYSICS');

      const { sprite } = clientEntity.getComponent('DRAW');
      const animationComponent = clientEntity.getComponent('ANIMATION');

      sprite.x = serverPhysicsComponent.x * GAME_SCALE;
      sprite.y = serverPhysicsComponent.y * GAME_SCALE;

      const { vx, vy, direction } = serverPhysicsComponent;

      sprite.rotation = direction * Math.PI / 2;

      if (vy < -0.01 || vy > 0.01 || vx > 0.01 || vx < -0.01) { 
        animationComponent.play('MOVE');
      } else {
        animationComponent.play('IDLE');
      }
    });
  }

  tick() {
    PixiManager.render();
    PixiManager.graphics.clear();
  }
}

export default DrawSystem;
