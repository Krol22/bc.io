const { EcsComponent } = require('@krol22/ecs');

class AnimationComponent extends EcsComponent {
  constructor(currentFrame, name, animations) {
    super('ANIMATION');

    this.currentFrame = currentFrame;
    this.name = name;
    this.animations = animations;
  }
}

module.exports = AnimationComponent;
