const { ECS, EcsEntity } = require('@krol22/paula');
const GameLoop = require('../common/engine/GameLoop');

const PhysicsSystem = require('./systems/physicsSystem');
const NetworkSystem = require('./systems/networkSystem');

const PhysicsComponent = require('../common/components/physics');

const serverGameLoop = new GameLoop(30);

class NetworkComponent {
  constructor(id) {
    this._type = 'Network';
    this.id = id;
  }
}

class Game {
  constructor(room) {
    this.entities = [];
    this.networkEntities = [];
    this.ecs = new ECS();

    const physicsSystem = new PhysicsSystem();

    room.players.forEach(({ id }) => {
      const newEntity = new EcsEntity([new PhysicsComponent(0, 0), new NetworkComponent(id)]);
      this.entities.push(newEntity);
      this.ecs.addEntity(newEntity);
    });

    this.networkSystem = new NetworkSystem(this.entities, room, [physicsSystem]);

    this.ecs.addSystem(physicsSystem);
  }

  loop() {
    this.ecs.update();
    this.networkSystem.sendClientInfo();
  }

  start() {
    serverGameLoop.start(this.loop.bind(this));
  }
}

module.exports = Game;
