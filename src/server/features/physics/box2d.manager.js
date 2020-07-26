import { Engine } from 'matter-js';

const MatterJsManager = {
  initialize: () => {
    MatterJsManager.engine = Engine.create();
    MatterJsManager.engine.world.gravity.y = 0;
  },

  tick: (delta) => {
    Engine.update(MatterJsManager.engine, delta);
  }
};

MatterJsManager.initialize();

export default MatterJsManager;
