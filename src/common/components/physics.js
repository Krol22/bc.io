class PhysicsComponent {
  constructor(x = 0, y = 0) {
    this.n = 'Ph';
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }
}

module.exports = PhysicsComponent;
