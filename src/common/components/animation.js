const { EcsComponent } = require('@krol22/paula');

class AnimationComponent extends EcsComponent {
  constructor(currentFrame, name, animations) {
    super('ANIMATION');

    this.currentFrame = currentFrame;
    this.name = name;
    this.animations = animations;
  }
}

module.exports = AnimationComponent;
