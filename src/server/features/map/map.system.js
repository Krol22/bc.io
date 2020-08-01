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
    const { map, meta } = mapData;

    map.forEach(({x, y, type}) => {
      if (type === 'GRASS' || type === 'ICE' || type === 'SPAWN') {
        return;
      }

      // TODO: WHY OH WHY I NEED TO FRAME_WIDTH / 2 BUT PLAYER WORKS FINE.
      const mapBody = Bodies.rectangle(x * FRAME_WIDTH + FRAME_WIDTH / 2, y * FRAME_HEIGHT + FRAME_HEIGHT / 2, FRAME_WIDTH, FRAME_HEIGHT, {
        isStatic: true,
      });

      World.add(MatterManager.engine.world, [mapBody]);
    });

    const { width, height } = meta;

    World.add(MatterManager.engine.world, [
      Bodies.rectangle( // TOP
        FRAME_WIDTH / 2 * width,
        (-1) * FRAME_HEIGHT + FRAME_HEIGHT / 2,
        FRAME_WIDTH * width,
        FRAME_HEIGHT,
        { isStatic: true },
      ),
      Bodies.rectangle( // RIGHT
        width * FRAME_WIDTH + FRAME_WIDTH / 2,
        FRAME_HEIGHT / 2 * height,
        FRAME_WIDTH,
        FRAME_HEIGHT * height,
        { isStatic: true },
      ),
      Bodies.rectangle( // BOTTOM
        FRAME_WIDTH / 2 * width,
        height * FRAME_HEIGHT + FRAME_HEIGHT / 2,
        FRAME_WIDTH * width,
        FRAME_HEIGHT,
        { isStatic: true },
      ),
      Bodies.rectangle( // LEFT
        (-1) * FRAME_WIDTH + FRAME_WIDTH / 2,
        FRAME_HEIGHT / 2 * height,
        FRAME_WIDTH,
        FRAME_HEIGHT * height,
        { isStatic: true }
      ),
    ]);
  }

  tick() {

  }
}
