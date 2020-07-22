import { EcsSystem } from '@krol22/ecs';

import PixiManager from './pixi.manager';

import { PIXEL_PER_METER, GAME_SCALE } from '../../../common/constants';

class DrawSystem extends EcsSystem {
  constructor() {
    super(['DRAW']);
  }

  initializePixi() {
    this.systemEntities.forEach(entity => {
      const drawComponent = entity.getComponent('DRAW');

      const { sprite } = drawComponent;

      PixiManager.stage.addChild(sprite);
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
      // const animationComponent = clientEntity.getComponent('ANIMATION');

      sprite.x = serverPhysicsComponent.x * PIXEL_PER_METER * GAME_SCALE;
      sprite.y = serverPhysicsComponent.y * PIXEL_PER_METER * GAME_SCALE;

      // const { vx, vy } = serverPhysicsComponent;

      // if (vy < 0) {
        // sprite.rotation = 0;
        // animationComponent.play('MOVE');
      // } else if (vy > 0) {
        // sprite.rotation = Math.PI;
        // animationComponent.play('MOVE');
      // } else if (vx > 0) {
        // sprite.rotation = Math.PI / 2;
        // animationComponent.play('MOVE');
      // } else if (vx < 0) {
        // sprite.rotation = 3 * Math.PI / 2;
        // animationComponent.play('MOVE');
      // } else {
        // animationComponent.play('IDLE');
      // }
    });
  }

  tick() {
    PixiManager.render();
  }
}

export default DrawSystem;
