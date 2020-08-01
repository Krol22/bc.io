import { EcsEntity } from '@krol22/ecs';
import { Bodies, World, Body } from 'matter-js';

import PhysicsComponent from '../../../common/components/physics';
import NetworkComponent from '../../../common/components/network';

import MatterManager from './matter.manager';

const generatePlayer = (x, y, width, height, id) => {
  const body = Bodies.rectangle(x, y, width, height, {
    inertia: Infinity,
    // TODO: move to constants -> here and in server/physics.system.js
    frictionAir: 0.2,
    friction: 0,
  });

  // TODO move to constants,
  Body.set(body, {
    label: 'player',
  });

  World.add(MatterManager.engine.world, [body]);

  return new EcsEntity([
    new PhysicsComponent(body.id),
    new NetworkComponent(id),
  ]);
};

export default generatePlayer;
