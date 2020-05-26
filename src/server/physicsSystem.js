const FRICTION = 1.2;

class PhysicsSystem { 
  constructor(entities) {
    this.systemEntities = entities.filter(entity => entity.componentTypes.includes('Ph'));
  }

  update() {
    this.systemEntities.forEach(entity => {
      const physicsComponent = entity.components['Ph'];

      // const { ax, ay } = physicsComponent;

      // physicsComponent.x += ax;
      // physicsComponent.y += Math.floor((Math.random() * 3) - 1);

      // physicsComponent.vx += ax;
      // physicsComponent.vy += ay;
//
      // physicsComponent.vx *= FRICTION;
      // physicsComponent.vy *= FRICTION;
    });
  }
};

module.exports = PhysicsSystem;
