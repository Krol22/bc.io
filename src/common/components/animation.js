import { EcsComponent } from '@krol22/ecs';

/*
  example:

  currentAnimation: {
    name: 'MOVE',
    time: 100,
    frame: 1,
  },
  nextAnimation: 'IDLE',
  frames: [
    new PIXI.Texture(spriteSheet, 4 * frameWidth, 4 * frameHeight, frameWidth, frameHeight),
    new PIXI.Texture(spriteSheet, 5 * frameWidth, 4 * frameHeight, frameWidth, frameHeight),
  ],
  animations: {
    IDLE: {
      frames: [0],
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

  play(animationName) {
    if (!this.animations[animationName]) {
      throw new Error(`No animation named ${animationName}!`);
    }

    if (this.currentAnimation.name === animationName) {
      return;
    }

    this.currentAnimation = {
      name: animationName,
      time: 0,
      frame: this.animations[animationName].frames[0],
      ended: false,
    };
  }
}
