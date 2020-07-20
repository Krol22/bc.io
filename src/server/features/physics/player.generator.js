import { EcsEntity } from '@krol22/ecs';

import PhysicsComponent from '../../../common/components/physics';
import NetworkComponent from '../../../common/components/network';

import Box2DManager from './box2d.manager';

const generatePlayer = (x, y, width, height, id) => {
  const { Box2D } = Box2DManager; 

  const bodyDefinition = new Box2D.b2BodyDef();

  bodyDefinition.set_type(Box2D.b2_dynamicBody);
  bodyDefinition.set_position(new Box2D.b2Vec2(x, y));

  const shape = new Box2D.b2PolygonShape(); 
  shape.SetAsBox(width, height);

  const body = Box2DManager.world.CreateBody(bodyDefinition);
  body.CreateFixture(shape, 5.0);

  body.SetLinearDamping(0.05);

  return new EcsEntity([
    new PhysicsComponent(body),
    new NetworkComponent(id),
  ]);
};

export default generatePlayer;
