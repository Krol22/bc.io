const { EcsComponent } = require('@krol22/ecs');

class PhysicsComponent extends EcsComponent {
  constructor(body) {
    super('PHYSICS');

    this.body = body;
  }

  toString() {
    const physicsComponent = {
      x: this.body.GetPosition().get_x(),
      y: this.body.GetPosition().get_y(),
      angle: this.body.GetAngle(),
      ...this,
    };

    delete physicsComponent.body;

    return JSON.stringify(physicsComponent);
  }
}

module.exports = PhysicsComponent;
