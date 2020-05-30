const { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } = require('../common/networkActions');

class PhysicsSystem { 
  constructor(entities) {
    this.systemEntities = entities.filter(entity => entity.componentTypes.includes('Ph'));
    this.networkActions = {
      [MOVE_UP]: entity => {
        const physicsComponent = entity.components['Ph'];
        physicsComponent.ay = -4;
      },
      [MOVE_DOWN]: entity => {
        const physicsComponent = entity.components['Ph'];
        physicsComponent.ay = 4;
      },
      [MOVE_LEFT]: entity => {
        const physicsComponent = entity.components['Ph'];
        physicsComponent.ax = -4;
      },
      [MOVE_RIGHT]: entity => {
        const physicsComponent = entity.components['Ph'];
        physicsComponent.ax = 4;
      }
    };
  }

  update() {
    this.systemEntities.forEach(entity => {
      const physicsComponent = entity.components['Ph'];

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
