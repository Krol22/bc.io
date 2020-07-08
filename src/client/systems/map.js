import { EcsSystem } from '@krol22/ecs';

class MapSystem extends EcsSystem {
  constructor(context) {
    super(['MAP']);

    this.context = context;
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
