const FRICTION = .7;

class PhysicsSystem { 
  constructor(entities) {
    this.systemEntities = entities.filter(entity => entity.componentTypes.includes('Ph'));
  }

  update() {
    this.systemEntities.forEach(entity => {
      const physicsComponent = entity.components['Ph'];

      const { vx, vy, ax, ay } = physicsComponent;

      physicsComponent.x += vx;
      physicsComponent.y += vy;

      physicsComponent.vx += ax;
      physicsComponent.vy += ay;
//

      physicsComponent.ax = 0;
      physicsComponent.ay = 0;

      physicsComponent.vx *= 0.9;
      physicsComponent.vy *= 0.9;
    });
  }
};

module.exports = PhysicsSystem;
