import { EcsSystem } from '@krol22/ecs';

class AnimationSystem extends EcsSystem {
  constructor() {
    super(['DRAW', 'ANIMATION']);
  }

  tick() {
    this.systemEntities.forEach(entity => {
      const { frames, animations, currentAnimation, nextAnimation } = entity.getComponent('ANIMATION');

      const currentAnimationData = animations[currentAnimation.name];
      const { sprite } = entity.getComponent('DRAW');

      if (!currentAnimationData) {
        throw new Error(`No animation named ${currentAnimation.name} defined for entity ${entity.id}`);
      }

      if (currentAnimation.ended) {
        return;
      }


      // TODO: this should be handeled by some kind of 'playAnimation' function.
      if (nextAnimation && currentAnimation.name !== nextAnimation) {
        currentAnimation.name = nextAnimation;
        currentAnimation.time = 0;
        currentAnimation.frame = animations[nextAnimation].frames[0];
        currentAnimation.ended = false;

        sprite.texture = frames[currentAnimation.frame];
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
