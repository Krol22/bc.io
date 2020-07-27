import { EcsEntity } from '@krol22/ecs';
import { Bodies, World } from 'matter-js';

import PhysicsComponent from '../../../common/components/physics';
import NetworkComponent from '../../../common/components/network';

import Box2DManager from './box2d.manager';

const generatePlayer = (x, y, width, height, id) => {
  const body = Bodies.rectangle(x, y, width, height, {
    inertia: Infinity,
    frictionAir: 0.2,
    friction: 0,
  });

  World.add(Box2DManager.engine.world, [body]);

  return new EcsEntity([
    new PhysicsComponent(body.id),
    new NetworkComponent(id),
  ]);
};

export default generatePlayer;
