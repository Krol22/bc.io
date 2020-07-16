import { EcsSystem } from '@krol22/ecs';

class AnimationSystem extends EcsSystem {
  constructor() {
    super(['DRAW', 'ANIMATION']);
  }

  tick() {
    this.systemEntities.forEach(entity => {
      const { frames, animations, currentAnimation } = entity.getComponent('ANIMATION');
      const { sprite } = entity.getComponent('DRAW');

      const currentAnimationData = animations[currentAnimation.name];

      sprite.texture = frames[currentAnimation.frame];

      if (currentAnimation.ended) {
        return;
      }

      // It's static 1 sprite,
      if (typeof currentAnimationData.time === 'undefined') {
        return;
      }

      if (currentAnimation.time > currentAnimationData.time) {
        const isCurrentAnimationFinished = !currentAnimationData.loop && currentAnimation.frame >= currentAnimationData.frames.length - 1;

        if (isCurrentAnimationFinished) {
          currentAnimation.ended = true;

          return;
        }

        currentAnimation.time = 0;
        currentAnimation.frame = (currentAnimation.frame + 1) >= currentAnimationData.frames.length
          ? 0
          : currentAnimation.frame + 1;

        sprite.texture = frames[currentAnimation.frame];

        return;
      }

      currentAnimation.time += 1;
    });
  }
}

export default AnimationSystem;
