class NetworkSystem {
  constructor(entities, room) {
    this.room = room;
    this.entities = entities;

    this.room.players.forEach(player => {
      const { socket } = player;

      socket.on('CLIENT_UPDATE', (data) => {
        const entity = this.entities.find(entity => entity.components['Network'].id === data.playerId)

        console.log(data);

        if (!entity) {
          return;
        }

        entity.components['Ph'].x = data.x;
        entity.components['Ph'].y = data.y;
      });
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
