import { EcsSystem } from '@krol22/ecs';

class DrawSystem extends EcsSystem {
  constructor(context) {
    console.log('est123');
    super(['DRAW']);

    console.log('est123');

    this.context = context;
  }

  tick(delta) {
    this.context.fillRect(0, 0, 1000, 1000);

    this.systemEntities.forEach(entity => {
      const drawComponent = entity.getComponent('DRAW');

      // should be in draw component and in each frame of animation component,
      const frameWidth = 16;
      const frameHeight = 16;

      const {
        x, y, width, height, image, dir
      } = drawComponent;

      if (!entity.hasComponent('ANIMATION')) {
        // draw just image,
        this.context.save();
        this.context.translate(x, y);

        this.context.translate(width / 2, height / 2);
        this.context.rotate((Math.PI / 2) * dir);
        this.context.translate(-width / 2, -height / 2);

        this.context.drawImage(image, 0, 0, frameWidth, frameHeight, 0, 0, width, height);

        this.context.restore();
        return;
      };

      // draw frame from animation,
      const animationComponent = entity.getComponent('ANIMATION');
      const { currentFrame } = animationComponent;

      this.context.save();
      this.context.translate(x, y);

      this.context.drawImage(image, frameWidth * currentFrame, 0, frameWidth, frameHeight, 0, 0, width, height);

      this.context.restore();
    });
  }
};

export default DrawSystem;
