import { EcsSystem } from '@krol22/ecs';

import { TEST_DESTROY_MAP } from '../../common/constants/playerActions';

export default class MapSystem extends EcsSystem {
  constructor() {
    super(['MAP']);

    this.networkActions = {
      [TEST_DESTROY_MAP]: () => {
        const entity = this.systemEntities.find(entity => entity.hasComponent('MAP'));

        if (!entity) {
          return;
        }

        const mapComponent = entity.getComponent('MAP');

        mapComponent.map = [...mapComponent.map.splice(1, mapComponent.map.length - 1)];
      }
    };
  }

  tick() {}
}
