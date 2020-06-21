import { EcsSystem } from '@krol22/ecs';

class DrawSystem extends EcsSystem {
  constructor(context) {
    super(['DRAW']);

    this.context = context;
  }

  onServerTick(serverEntities) {
    serverEntities.forEach(serverEntity => {
      const networkId = serverEntity.components.find(({ _type }) => _type === 'NETWORK').id;

      const clientEntity = this.systemEntities.find((entity) => entity.getComponent('NETWORK').id === networkId);
      
      if (!clientEntity) {
        return;
      }

      const serverPhysicsComponent = serverEntity.components.find(({ _type }) => _type === 'PHYSICS');

      const drawComponent = clientEntity.getComponent('DRAW');

      drawComponent.x = serverPhysicsComponent.x;
      drawComponent.y = serverPhysicsComponent.y;

      const { vx, vy } = serverPhysicsComponent;

      if (vy < 0) {
        drawComponent.dir = 0;
      } else if (vy > 0) {
        drawComponent.dir = 2;
      } else if (vx > 0) {
        drawComponent.dir = 1;
      } else if (vx < 0) {
        drawComponent.dir = 3;
      }

    });
  }

  tick() {
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
