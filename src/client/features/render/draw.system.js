import { EcsSystem } from '@krol22/ecs';
import * as PIXI from 'pixi.js';

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

      // PixiManager.stage.addChild(sprite);
      PixiManager.graphics = new PIXI.Graphics();

      PixiManager.stage.addChild(PixiManager.graphics);

      // if(entity.hasComponent('PHYSICS')) {
        // const { debug } = entity.getComponent('PHYSICS');
        // drawComponent.debugShape = new PIXI.Polygon(debug.vertices.map(({ x, y }) => ([x, y])).flat());
//
        // PixiManager.stage.addChild(drawComponent.debugShape);
      // }
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

      sprite.x = serverPhysicsComponent.x;
      sprite.y = serverPhysicsComponent.y;

      const { vx, vy, direction } = serverPhysicsComponent;

      sprite.rotation = direction * Math.PI / 2;

      if (vy < -0.01 && vy > 0.01 && vx > 0.01 && vx < -0.01) { 
        animationComponent.play('MOVE');
      } else {
        animationComponent.play('IDLE');
      }

      const { debug } = serverPhysicsComponent;
      PixiManager.graphics.beginFill(0xffff22);
      const points = debug.vertices.map(({x, y}) => ([x, y])).flat()
      PixiManager.graphics.drawPolygon(points);
      PixiManager.graphics.endFill();
    });
  }

  tick() {
    PixiManager.render();
    PixiManager.graphics.clear();
  }
}

export default DrawSystem;
