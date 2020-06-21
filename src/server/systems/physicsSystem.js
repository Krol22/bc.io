import { EcsSystem } from '@krol22/ecs';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../../common/networkActions';

class PhysicsSystem extends EcsSystem { 
  constructor() {
    super(['PHYSICS']);

    this.networkActions = {
      [MOVE_UP]: entity => {
        console.log('move_up');
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.vx = 0;
        physicsComponent.ay = -0.4;
      },
      [MOVE_DOWN]: entity => {
        console.log('move_down');
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.vx = 0;
        physicsComponent.ay = .4;
      },
      [MOVE_LEFT]: entity => {
        console.log('move_left');
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.vy = 0;
        physicsComponent.ax = -.4;
      },
      [MOVE_RIGHT]: entity => {
        console.log('move_right');
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.vy = 0;
        physicsComponent.ax = .4;
      },
    };
  }

  tick(delta) {
    this.systemEntities.forEach(entity => {
      const physicsComponent = entity.getComponent('PHYSICS');

      const { vx, vy, ax, ay } = physicsComponent;

      physicsComponent.vx += ax;
      physicsComponent.vy += ay;

      physicsComponent.x += vx;
      physicsComponent.y += vy;

      physicsComponent.vx *= 0.9;
      physicsComponent.vy *= 0.9;

      physicsComponent.ax = 0;
      physicsComponent.ay = 0;
    });
  }
};

module.exports = PhysicsSystem;
