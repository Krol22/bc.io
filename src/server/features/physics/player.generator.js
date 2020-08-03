import { EcsEntity } from '@krol22/ecs';
import { Bodies, World } from 'matter-js';

import MatterManager from './matter.manager';

import PhysicsComponent from '../../../common/components/physics';
import NetworkComponent from '../../../common/components/network';

import { PLAYER_FRICTION_AIR } from '../../../common/constants';

const generatePlayer = (x, y, width, height, id) => {
  const body = Bodies.rectangle(x, y, width, height, {
    inertia: Infinity,
    frictionAir: PLAYER_FRICTION_AIR,
    friction: 0,
  });

  World.add(MatterManager.engine.world, [body]);

  return new EcsEntity([
    new PhysicsComponent(body.id),
    new NetworkComponent(id),
  ]);
};

export default generatePlayer;
