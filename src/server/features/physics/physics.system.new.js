import { EcsSystem } from '@krol22/ecs';
import { Body } from 'matter-js';

import Box2DManager from './box2d.manager';

import { PLAYER_SPEED } from '../../../common/constants';

export default class PhysicsSystem extends EcsSystem {
  constructor() {
    super(['PHYSICS']);

    this.networkActions = {
      ['MOVE_UP']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.setVelocity(entityBody, { x: 0, y: -0 });
        Body.applyForce(entityBody, entityBody.position, { x: 0, y: -PLAYER_SPEED });
        physics.direction = 0;
      },
      ['MOVE_DOWN']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: 0, y: PLAYER_SPEED });
        physics.direction = 2;
      },
      ['MOVE_LEFT']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.setVelocity(entityBody, { x: -0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: -PLAYER_SPEED, y: 0 });
        physics.direction = 3;
      },
      ['MOVE_RIGHT']: entity => {
        const physics = entity.getComponent('PHYSICS');
        const entityBody = Box2DManager.engine.world.bodies.find(({ id }) => id === physics.body); 

        Body.setVelocity(entityBody, { x: 0, y: 0 });
        Body.applyForce(entityBody, entityBody.position, { x: PLAYER_SPEED, y: 0 });
        physics.direction = 1;
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

      physics.debug = {
        render: entityBody.render,
        vertices: entityBody.vertices.map(({ x, y }) => ({ x, y })),
      }
    });
  }
}
