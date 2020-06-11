const { EcsComponent } = require('@krol22/ecs');

class NetworkComponent extends EcsComponent {
  constructor(id) {
    super('NETWORK');

    this.id = id
  }
};

module.exports = NetworkComponent;
