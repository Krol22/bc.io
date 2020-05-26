const { ECS, Entity } = require('./ecs');
const PhysicsSystem = require('./physicsSystem');
const NetworkSystem = require('./networkSystem');

class PhysicsComponent {
  constructor(x = 0, y = 0) {
    this.n = 'Ph';
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }
}

class NetworkComponent {
  constructor(id) {
    this.n = 'Network';
    this.id = id;
  }
}

class Game {
  constructor(room) {
    this.entities = [];
    this.networkEntities = [];

    // async - listen on clients events/actions input,
    room.players.forEach(({ id, socket }) => {
      this.entities.push(
        new Entity([new PhysicsComponent(0, 0), new NetworkComponent(id)]),
      );

      socket.on('event', data => {});
    });

    const physicsSystem = new PhysicsSystem(this.entities);
    this.networkSystem = new NetworkSystem(this.entities, room);
    
    this.ecs = new ECS([physicsSystem]);

    console.log(this.ecs);
  }

  loop() {
    // async - loop through ECS,
    this.ecs.update();

    this.networkSystem.update();
  }
}

module.exports = Game;
