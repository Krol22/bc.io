const { EcsSystem } = require('@krol22/paula');

class NetworkSystem {
  constructor(entities, room, systems) {
    this.room = room;
    this.entities = entities;

    this.room.players.forEach(player => {
      const { id, socket } = player;

      socket.on('CLIENT_EVENT', (({event}) => {
        const entity = this.entities.find(entity => entity.getComponent('Network').id === id);

        if (!entity) {
          return;
        }

        const systemsWithNetworkActions = systems.filter(system => {
          return !!system.networkActions[event];
        });

        systemsWithNetworkActions.forEach(system => system.networkActions[event](entity));
      }));
    })
  }

  sendClientInfo() {
    this.room.players.forEach(player => {
      const { socket, roomId } = player;

      socket.emit('GAME_TICK', this.entities);
    });
  }
}

module.exports = NetworkSystem;
