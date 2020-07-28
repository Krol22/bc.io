import { Engine, Events, Body } from 'matter-js';

const mapToDirection = dir => {
  if (!dir) {
    return { x: 0, y: -1 };
  }
  if (dir === 1) {
    return { x: 1, y: 0 };
  }
  if (dir === 2) {
    return { x: 0, y: 1 };
  }
  if (dir === 3) {
    return { x: -1, y: 0 };
  }
};

const getAngle = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

const MatterJsManager = {
  initialize: () => {
    MatterJsManager.engine = Engine.create();
    MatterJsManager.engine.world.gravity.y = 0;

    Events.on(MatterJsManager.engine, 'beforeUpdate', () => {
      MatterJsManager.engine.world.bodies.forEach(body => {
        const currentVelocity = body.velocity;
        const direction = mapToDirection(body.direction);

        let angle = getAngle(currentVelocity, direction);

        if (body.direction === 0 || body.direction === 2) {
          angle += Math.PI / 2;
        }

        if (Math.abs(body.speed) < 0.001) {
          return;
        }

        if (angle !== Math.PI / 2 || angle !== -Math.PI / 2) {
          if (direction.x !== 0 && Math.abs(currentVelocity.y) > 0.5) {
            Body.applyForce(body, body.position, { x: 0, y: -Math.sign(currentVelocity.y) * 0.001 });
          }

          if (direction.y !== 0 && Math.abs(currentVelocity.x) > 0.5) {
            Body.applyForce(body, body.position, { x: -Math.sign(currentVelocity.x) * 0.001, y: 0 });
          }
        }
      });
    });
  },

  tick: (delta) => {
    Engine.update(MatterJsManager.engine, delta);
  }
};

MatterJsManager.initialize();

export default MatterJsManager;
