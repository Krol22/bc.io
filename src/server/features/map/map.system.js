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
      Bodies.rectangle(0, -16, 16 * 16, 16, { isStatic: true }),
      Bodies.rectangle(-16, 0, 16, 16 * 16, { isStatic: true }),
      Bodies.rectangle(0, 16 * 16, 16 * 16, 16, { isStatic: true }),
      Bodies.rectangle(16 * 16, 0, 16, 16 * 16, { isStatic: true }),
    ]);
  }

  tick() {

  }
}
