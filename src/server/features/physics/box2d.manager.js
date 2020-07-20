import Box2D from '../../box2d_v2.3.1_min';

const Box2DManager = {
  initialize: async () => {
    Box2DManager.Box2D = await Box2D();

    const gravity = new Box2DManager.Box2D.b2Vec2(0, 0);

    Box2DManager.world = new Box2DManager.Box2D.b2World(gravity);
  },

  tick: (delta) => {
    Box2DManager.world.Step(10, 2, 2);
  }
};

Box2DManager.initialize();

export default Box2DManager;
