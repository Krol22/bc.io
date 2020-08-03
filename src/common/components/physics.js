const { EcsComponent } = require('@krol22/ecs');

class PhysicsComponent extends EcsComponent {
  constructor(body) {
    super('PHYSICS');

    this.body = body;
  }
}

module.exports = PhysicsComponent;
