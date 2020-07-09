import { EcsComponent } from '@krol22/ecs';

export default class DrawComponent extends EcsComponent {
  constructor(x, y, width, height, image) {
    super('DRAW');

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.dir = 0;

    this.image = image;
  }
}
