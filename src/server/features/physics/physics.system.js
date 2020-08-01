import { EcsSystem } from '@krol22/ecs';
import { Body } from 'matter-js';

import Box2DManager from './matter.manager';

import { PLAYER_SPEED, FRAME_WIDTH, FRAME_HEIGHT } from '../../../common/constants';

// TODO: move to constants
const correctionDifference = 0.25;

const MAX_PLAYER_VELOCITY_X = 0.54;
const MAX_PLAYER_VELOCITY_Y = 0.54;

/*
  Corrects player position for easier movement. 
  F.e. if player position x is 0.13 he couldn't easly move through corridors. 
  This function is responsible for moving player to position x = 0.
*/
const correctPosition = entityBody => {
  const restX = Math.abs(((entityBody.position.x - FRAME_WIDTH / 2) / FRAME_WIDTH) % 1);
  const restY = Math.abs(((entityBody.position.y - FRAME_HEIGHT / 2) / FRAME_HEIGHT) % 1);

  if (entityBody.prevDirection === entityBody.direction) {
    return;
  }

  if (restX > 0 && restX < correctionDifference) {
    Body.setPosition(
      entityBody,
      { x: (Math.floor(entityBody.position.x / FRAME_WIDTH) + 0.5) * FRAME_WIDTH, y: entityBody.position.y },
    );
  }

  if (restX < 1 && restX > 1 - correctionDifference) {
    Body.setPosition(
      entityBody,
      { x: (Math.ceil(entityBody.position.x / FRAME_WIDTH) - 0.5) * FRAME_WIDTH, y: entityBody.position.y },
    );
  }

  if (restY > 0 && restY < correctionDifference) {
    Body.setPosition(
      entityBody,
      { y: (Math.floor(entityBody.position.y / FRAME_HEIGHT) + 0.5) * FRAME_HEIGHT, x: entityBody.position.x },
    );
  }

  if (restY < 1 && restY > 1 - correctionDifference) {
    Body.setPosition(
      entityBody,
      { y: (Math.ceil(entityBody.position.y / FRAME_HEIGHT) - 0.5) * FRAME_HEIGHT, x: entityBody.position.x },
    );
  }
};

const clampVelocity = playerBody => {
  const currentVelocity = playerBody.velocity;

  if (Math.abs(currentVelocity.x) > MAX_PLAYER_VELOCITY_X) {
    Body.setVelocity(
      playerBody,
      { x: Math.sign(currentVelocity.x) * MAX_PLAYER_VELOCITY_X, y: currentVelocity.y },
    );
  }

  if (Math.abs(currentVelocity.y) > MAX_PLAYER_VELOCITY_Y) {
    Body.setVelocity(
      playerBody,
      { x: currentVelocity.x, y: Math.sign(currentVelocity.y) * MAX_PLAYER_VELOCITY_Y },
    );
  }
};

export default class PhysicsSystem extends EcsSystem {
  constructor() {
    super(['PHYSICS']);

    this.networkActions = {
      ['MOVE_UP']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.set(entityBody, {
          frictionAir: 0.2,
        });
        entityBody.direction = 0;
        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: 0, y: -PLAYER_SPEED });
        physics.direction = 0;

        correctPosition(entityBody);

        entityBody.prevDirection = 0;
        clampVelocity(entityBody);
      },
      ['MOVE_DOWN']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.set(entityBody, {
          frictionAir: 0.2,
        });
        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: 0, y: PLAYER_SPEED });
        entityBody.direction = 2;
        physics.direction = 2;

        correctPosition(entityBody);

        entityBody.prevDirection = 2;
        clampVelocity(entityBody);
      },
      ['MOVE_LEFT']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.set(entityBody, {
          frictionAir: 0.2,
        });
        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: -PLAYER_SPEED, y: 0 });
        physics.direction = 3;
        entityBody.direction = 3;

        correctPosition(entityBody);

        entityBody.prevDirection = 3;
        clampVelocity(entityBody);
      },
      ['MOVE_RIGHT']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.set(entityBody, {
          frictionAir: 0.2,
        });
        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: PLAYER_SPEED, y: 0 });
        physics.direction = 1;
        entityBody.direction = 1;

        correctPosition(entityBody);

        entityBody.prevDirection = 1;
        clampVelocity(entityBody);
      },
    };   
  }

  tick(delta) {
    Box2DManager.tick(delta);

    this.systemEntities.forEach(entity => {
      const physics = entity.getComponent('PHYSICS');

      const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

      physics.x = entityBody.position.x;
      physics.y = entityBody.position.y;

      physics.vx = entityBody.velocity.x;
      physics.vy = entityBody.velocity.y;
    });
  }
}
