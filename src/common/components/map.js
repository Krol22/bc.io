import { EcsComponent } from '@krol22/ecs';

class MapComponent extends EcsComponent {
  constructor(number, map) {
    super('MAP');

    this.number = number;
    this.map = map;
  }
}

export default MapComponent;
