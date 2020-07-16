import { EcsComponent } from '@krol22/ecs';

import * as PIXI from 'pixi.js';

export default class DrawComponent extends EcsComponent {
  constructor(x, y, texture) {
    super('DRAW');

    this.sprite = new PIXI.Sprite(texture);

    this.sprite.x = x;
    this.sprite.y = y;

    this.sprite.anchor.set(0.5, 0.5);
  }
}
