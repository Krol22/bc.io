import { EcsSystem } from '@krol22/ecs';

class MapSystem extends EcsSystem {
  constructor(context) {
    super(['MAP']);

    this.context = context;
  }

  onServerTick(serverEntities) {
    const mapServerEntity = serverEntities.find(entity => entity.components.find(({ _type }) => _type === 'MAP'));

    if (!mapServerEntity) {
      return;
    }

    const networkId = mapServerEntity.components.find(({ _type }) => _type === 'NETWORK').id;
    const serverMapComponent = mapServerEntity.components.find(({ _type }) => _type === 'MAP');

    const mapEntity = this.systemEntities.find(( entity ) => entity.hasComponent('NETWORK') && entity.getComponent('NETWORK').id === networkId);

    const mapComponent = mapEntity.getComponent('MAP');

    mapComponent.map = [...serverMapComponent.map];
    mapComponent.number = serverMapComponent.number;
  }

  tick() {
    this.systemEntities.forEach(entity => {
      const mapComponent = entity.getComponent('MAP');

      mapComponent.map.forEach(({x, y, type}) => {

        switch(type) {

        case 'BLOCK':
          this.context.save();
          this.context.translate(x * 32, y * 32);
          this.context.drawImage(window.assets.sprite, 16 * 16, 0 * 16, 16, 16, 0, 0, 32, 32);
          this.context.restore();
          break;
        case 'WATER':
          this.context.save();
          this.context.translate(x * 32, y * 32);
          this.context.drawImage(window.assets.sprite, 16 * 16, 2 * 16, 16, 16, 0, 0, 32, 32);
          this.context.restore();
          break;
        case 'GRASS':
          this.context.save();
          this.context.translate(x * 32, y * 32);
          this.context.drawImage(window.assets.sprite, 17 * 16, 2 * 16, 16, 16, 0, 0, 32, 32);
          this.context.restore();
          break;
        case 'METAL':
          this.context.save();
          this.context.translate(x * 32, y * 32);
          this.context.drawImage(window.assets.sprite, 16 * 16, 1 * 16, 16, 16, 0, 0, 32, 32);
          this.context.restore();
          break;
        case 'ICE':
          this.context.save();
          this.context.translate(x * 32, y * 32);
          this.context.drawImage(window.assets.sprite, 18 * 16, 2 * 16, 16, 16, 0, 0, 32, 32);
          this.context.restore();
          break;

        }

      });
    });
  }
}

export default MapSystem;
