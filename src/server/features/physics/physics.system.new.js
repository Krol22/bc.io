import { EcsSystem } from '@krol22/ecs';

import Box2DManager from './box2d.manager';

import { PLAYER_SPEED } from '../../../common/constants';

export default class PhysicsSystem extends EcsSystem {
  constructor() {
    super(['PHYSICS']);

    this.networkActions = {
      ['MOVE_UP']: entity => {
        const { body } = entity.getComponent('PHYSICS');
        const vel = new Box2DManager.Box2D.b2Vec2(0, -PLAYER_SPEED);
        body.SetLinearVelocity(vel);
      },
      ['MOVE_DOWN']: entity => {
        const { body } = entity.getComponent('PHYSICS');
        const vel = new Box2DManager.Box2D.b2Vec2(0, PLAYER_SPEED);
        body.SetLinearVelocity(vel);
      },
      ['MOVE_LEFT']: entity => {
        const { body } = entity.getComponent('PHYSICS');
        const vel = new Box2DManager.Box2D.b2Vec2(-PLAYER_SPEED, 0);
        body.SetLinearVelocity(vel);
      },
      ['MOVE_RIGHT']: entity => {
        const { body } = entity.getComponent('PHYSICS');
        const vel = new Box2DManager.Box2D.b2Vec2(PLAYER_SPEED, 0);
        body.SetLinearVelocity(vel);
      },
    };   
  }

  tick(delta) {
    Box2DManager.tick(delta);

    this.systemEntities.forEach(entity => {
      const physics = entity.getComponent('PHYSICS');

      physics.x = physics.body.GetPosition().get_x();
      physics.y = physics.body.GetPosition().get_y();
    });
  }
}
