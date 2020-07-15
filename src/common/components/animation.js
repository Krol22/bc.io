import { EcsComponent } from '@krol22/ecs';

/*
  example:

  frames: [
    new PIXI.Texture(spriteSheet, 4 * frameWidth, 4 * frameHeight, frameWidth, frameHeight),
    new PIXI.Texture(spriteSheet, 5 * frameWidth, 4 * frameHeight, frameWidth, frameHeight),
  ],
  animations: {
    IDLE: {
      frames: [0],
      loop: false,
    },
    MOVE: {
      frames: [0, 1],
      loop: true,
      time: 200,
    }
  }
*/

export default class AnimationComponent extends EcsComponent {
  constructor({ currentAnimation, frames, animations }) {
    super('ANIMATION');

    this.currentAnimation = currentAnimation;
    this.frames = frames;
    this.animations = animations;
  }
}
