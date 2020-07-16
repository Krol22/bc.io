import mapReducer from './features/map/map.reducer';

import networkEvents from '../common/constants/networkEvents';

const reducers = [
  mapReducer,
];

class NetworkLayer {
  constructor(networkManager, ecs) {
    this.networkManager = networkManager;
    this.ecs = ecs;

    Object
      .keys(networkEvents)
      .forEach(event => {
        if (event === 'GAME_TICK') { return; }
        this.networkManager.addEventListener(event, this.applyToReducer.bind(this, event)); 
      });
  }

  applyToReducer(event, payload) {
    reducers.forEach(reducer => {
      const newEntity = reducer(this.ecs.__getEntities(), {
        type: event,
        payload,
      });

      if (!newEntity) {
        return;
      }

      // TODO: here I could handle removing event.
      this.ecs.addEntity(newEntity);

      // TODO: this should be implemented in ECS.
      this.ecs.__getSystems().forEach(system => system.onEntityAdded && system.onEntityAdded());
    });
  }

  removeEventListeners() {
    Object
      .keys(networkEvents)
      .forEach(event => {
        this.networkManager.removeEventListener(event, this.applyToReducer); 
      });
  }
}

export default NetworkLayer;
