import { EcsEntity } from '@krol22/ecs';

import PixiManager from '../render/pixi.manager';

import MapComponent from '../../../common/components/map';
import NetworkComponent from '../../../common/components/network';

import { FRAME_WIDTH, FRAME_HEIGHT } from '../../../common/constants/index';

// TODO this could receive only certain types of entities.
export default function (entities, { type, payload }) {
  switch(type) {

  case 'MAP_LOAD': {
    const { number, map, meta, networkId } = payload;

    // This should go to global state?
    const rendererWidth = PixiManager.renderer.width;
    const rendererHeight = PixiManager.renderer.height;

    const { width, height } = meta;

    // TODO should react on resizing.
    PixiManager.stage.setTransform(
      rendererWidth / 2 - width * FRAME_WIDTH,
      rendererHeight / 2 - height * FRAME_HEIGHT,
    );

    return new EcsEntity([
      new MapComponent(number, map, meta),      
      new NetworkComponent(networkId),
    ]);
  }
  default: {
    break;
  }

  }
}
