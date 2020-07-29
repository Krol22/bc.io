import { EcsSystem } from '@krol22/ecs';
import { Bodies, World } from 'matter-js';

import MatterManager from '../physics/matter.manager';
import { FRAME_WIDTH, FRAME_HEIGHT } from '../../../common/constants';

export default class MapSystem extends EcsSystem {
  constructor() {
    super(['MAP']);

    this.networkActions = {};
  }

  buildMap(mapData) {
    const { map } = mapData;

    map.forEach(({x, y, type}) => {
      if (type === 'GRASS' || type === 'ICE') {
        return;
      }

      const mapBody = Bodies.rectangle(x * FRAME_WIDTH + 8, y * FRAME_HEIGHT + 8, FRAME_WIDTH, FRAME_HEIGHT, {
        isStatic: true,
      });

      World.add(MatterManager.engine.world, [mapBody]);
    });

    World.add(MatterManager.engine.world, [
      Bodies.rectangle(16 - 8 + 48, 0 - 8 + 48, 16 * 32, 16, { isStatic: true }),
      Bodies.rectangle(0 - 8 + 48, 16 - 8 + 48, 16, 32 * 16, { isStatic: true }),
      Bodies.rectangle(0 + 48, 15 * 16 - 8 + 48, 32 * 16, 16, { isStatic: true }),
      Bodies.rectangle(15 * 16 - 8 + 48, 16 + 48, 16, 16 * 32, { isStatic: true }),
    ]);
  }

  tick() {

  }
}
