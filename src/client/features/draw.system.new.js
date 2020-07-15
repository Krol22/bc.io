import { EcsSystem } from '@krol22/ecs';

import * as PIXI from 'pixi.js';

class DrawSystem extends EcsSystem {
  constructor() {
    super(['DRAW']);
  }

  initializePixi() {
    this.renderer = PIXI.autoDetectRenderer(800, 600, {
      antialias: false,
      transparent: false,
    });

    this.stage = new PIXI.Container();

    this.systemEntities.forEach(entity => {
      const drawComponent = entity.getComponent('DRAW');

      const { sprite } = drawComponent;

      sprite.anchor.set(0.5, 0.5);

      this.stage.addChild(sprite);
    });

    document.querySelector('#canvas').appendChild(this.renderer.view);
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

      sprite.x = serverPhysicsComponent.x;
      sprite.y = serverPhysicsComponent.y;

      const { vx, vy } = serverPhysicsComponent;

      if (vy < 0) {
        sprite.rotation = 0;
      } else if (vy > 0) {
        sprite.rotation = Math.PI;
      } else if (vx > 0) {
        sprite.rotation = Math.PI / 2;
      } else if (vx < 0) {
        sprite.rotation = 3 * Math.PI / 2;
      }
    });
  }

  tick() {
    this.renderer.render(this.stage);
  }
}

export default DrawSystem;
