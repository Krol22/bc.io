import { EcsEntity } from '@krol22/ecs';

import MapComponent from '../../../common/components/map';
import NetworkComponent from '../../../common/components/network';

// TODO this could receive only certain types of entities.
export default function (entities, { type, payload }) {
  switch(type) {

  case 'MAP_LOAD': {
    const { number, map, networkId } = payload;

    return new EcsEntity([
      new MapComponent(number, map),      
      new NetworkComponent(networkId),
    ]);
  }
  default: {
    break;
  }

  }
}
