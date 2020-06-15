import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import PhysicsComponent from '../common/components/physics';

import PhysicsSystem from './systems/physicsSystem';
import ServerNetworkManager from './serverNetworkManager';

const serverGameLoop = new GameLoop(30);

class Game {
  constructor() {
    this.entities = [];
    this.networkEntities = [];
    this.ecs = new ECS();

    const physicsSystem = new PhysicsSystem();

    this.serverNetworkManager = new ServerNetworkManager(this.entities, [physicsSystem]);

    this.ecs.addSystem(physicsSystem);
  }

  addPlayer(newPlayer) {
    const players = this.ecs.__getEntities();

    const newEntity = new EcsEntity([new PhysicsComponent(33 * players.length, 0), new NetworkComponent(newPlayer.id)]);

    this.entities.push(newEntity);
    this.ecs.addEntity(newEntity);

    this.serverNetworkManager.addPlayer(newPlayer);
  }

  removePlayer(playerId) {
    const entityToRemoveId = this.ecs.__getEntities().find(entity => entity.getComponent('NETWORK').id === playerId).id;

    this.ecs.removeEntity(entityToRemoveId);
    this.serverNetworkManager.removePlayer(playerId);
  }

  loop() {
    this.ecs.update();
    this.serverNetworkManager.sendClientInfo();
  }

  start() {
    serverGameLoop.start(this.loop.bind(this));
  }
}

module.exports = Game;
