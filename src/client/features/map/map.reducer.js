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
  case 'MAP_CHANGE': {
    const { number, map, networkId } = payload;
    
    const mapEntity = entities.find(entity => entity.hasComponent('NETWORK') && entity.getComponent('NETWORK').id === networkId);
    const mapComponent = mapEntity.getComponent('MAP');
    
    mapComponent.number = number;
    mapComponent.map = map;

    break;
  }
  default: {
    break;
  }

  }
}
