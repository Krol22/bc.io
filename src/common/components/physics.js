const { EcsComponent } = require('@krol22/paula');

class PhysicsComponent extends EcsComponent {
  constructor(x = 0, y = 0) {
    super('PHYSICS');

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }
}

module.exports = PhysicsComponent;
