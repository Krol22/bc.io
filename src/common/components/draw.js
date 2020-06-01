const { EcsComponent } = require('@krol22/paula');

class DrawComponent extends EcsComponent {
  constructor(x, y, width, height, image) {
    super('DRAW');

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.image = image;
  }
}

module.exports = DrawComponent;
