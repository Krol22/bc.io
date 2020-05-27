const MOVE_UP = 0;
const MOVE_DOWN = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 3;

class NetworkSystem {
  constructor(entities, room) {
    this.room = room;
    this.entities = entities;

    this.room.players.forEach(player => {
      const { id, socket } = player;

      socket.on('CLIENT_EVENT', (({event}) => {
        const entity = this.entities.find(entity => entity.components['Network'].id === id);

        if (!entity) {
          return;
        }

        const physicsComponent = entity.components['Ph'];

        switch(event) {
          case MOVE_UP:
            physicsComponent.ay = -4;
            break;
          case MOVE_DOWN:
            physicsComponent.ay = 4;
            break;
          case MOVE_LEFT:
            physicsComponent.ax = -4;
            break;
          case MOVE_RIGHT:
            physicsComponent.ax = 4;
            break;
        }
      }));
    })
  }

  update() {
    this.room.players.forEach(player => {
      const { socket, roomId } = player;

      socket.emit('GAME_TICK', this.entities);
    });
  }
}

module.exports = NetworkSystem;
