import { EcsSystem } from '@krol22/ecs';

export default class PlayerSystem extends EcsSystem {
  constructor() {
    super(['PLAYER']);
  }

  tick(delta) {

  }
}
