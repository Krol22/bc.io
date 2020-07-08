import { EcsComponent } from '@krol22/ecs';

export default class AnimationComponent extends EcsComponent {
  constructor(currentFrame, name, animations) {
    super('ANIMATION');

    this.currentFrame = currentFrame;
    this.name = name;
    this.animations = animations;
  }
}
