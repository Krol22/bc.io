import mapReducer from '../map/map.reducer';

import networkEvents from '../../../common/constants/networkEvents';

const reducers = [
  mapReducer,
];

/**
  * ReducerManager class - responsible for launching reducers on server events 
  */
class ReducerManager {
  /**
    * Adds event listeners to networkManager for each server event (except 'GAME_TICK') which will launch all reducer functions
    * @constructor
    * @param {object} networkManager - game networkManager,
    * @param {object} ecs - game ECS engine,
    * @param {array} skipEvents - Array of events that will be skipped by reducerManager
    */
  constructor(networkManager, ecs, skipEvents) {
    this.networkManager = networkManager;
    this.ecs = ecs;

    Object
      .keys(networkEvents)
      .forEach(event => {
        if (skipEvents.includes(event)) { return; }
        this.networkManager.addEventListener(event, this._applyToReducer.bind(this, event)); 
      });
  }

  /**
    * Remove all event listeners 
    */
  removeEventListeners() {
    Object
      .keys(networkEvents)
      .forEach(event => {
        this.networkManager.removeEventListener(event, this._applyToReducer); 
      });
  }

  _applyToReducer(event, payload) {
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

}

export default ReducerManager;
