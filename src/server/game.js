const { ECS, EcsEntity } = require('@krol22/ecs');

const GameLoop = require('../common/engine/GameLoop');

const NetworkComponent = require('../common/components/network');
const PhysicsComponent = require('../common/components/physics');

const PhysicsSystem = require('./systems/physicsSystem');
const ServerNetworkManager = require('./serverNetworkManager');

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
