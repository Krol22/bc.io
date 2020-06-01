const { EcsSystem } = require('@krol22/paula');

const { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } = require('../../common/networkActions');

class PhysicsSystem extends EcsSystem { 
  constructor() {
    super(['PHYSICS']);

    this.networkActions = {
      [MOVE_UP]: entity => {
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.ay = -4;
      },
      [MOVE_DOWN]: entity => {
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.ay = 4;
      },
      [MOVE_LEFT]: entity => {
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.ax = -4;
      },
      [MOVE_RIGHT]: entity => {
        const physicsComponent = entity.getComponent('PHYSICS');
        physicsComponent.ax = 4;
      }
    };
  }

  tick(delta) {
    this.systemEntities.forEach(entity => {
      const physicsComponent = entity.getComponent('PHYSICS');

      const { vx, vy, ax, ay } = physicsComponent;

      physicsComponent.x += vx;
      physicsComponent.y += vy;

      physicsComponent.vx += ax;
      physicsComponent.vy += ay;

      physicsComponent.ax = 0;
      physicsComponent.ay = 0;

      physicsComponent.vx *= 0.9;
      physicsComponent.vy *= 0.9;
    });
  }
};

module.exports = PhysicsSystem;
