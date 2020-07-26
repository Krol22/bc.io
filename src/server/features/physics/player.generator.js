import { EcsEntity } from '@krol22/ecs';
import { Bodies, World } from 'matter-js';

import PhysicsComponent from '../../../common/components/physics';
import NetworkComponent from '../../../common/components/network';

import Box2DManager from './box2d.manager';

const generatePlayer = (x, y, width, height, id) => {
  console.log(width, height);
  const body = Bodies.rectangle(x, y, width, height, {
    density: 10,
    frictionAir: 0.2
  });

  World.add(Box2DManager.engine.world, [body]);

  return new EcsEntity([
    new PhysicsComponent(body.id),
    new NetworkComponent(id),
  ]);
};

export default generatePlayer;
