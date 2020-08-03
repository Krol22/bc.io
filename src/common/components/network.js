import { EcsComponent } from '@krol22/ecs';

export default class NetworkComponent extends EcsComponent {
  constructor(id) {
    super('NETWORK');

    this.id = id;
  }
}
