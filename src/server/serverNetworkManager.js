class ServerNetworkManager {
  constructor(entities, systems) {
    this.entities = entities;
    this.systems = systems;

    this.players = [];
  }

  sendClientInfo() {
    this.players.forEach(player => {
      const { socket } = player;

      socket.emit('GAME_TICK', this.entities);
    });
  }

  addPlayer(newPlayer) {
    const { id, socket } = newPlayer;

    this.players.push(newPlayer);

    socket.on('CLIENT_EVENT', (({event}) => {
      const entity = this.entities.find(entity => entity.getComponent('NETWORK').id === id);

      if (!entity) {
        return;
      }

      const systemsWithNetworkActions = this.systems.filter(system => {
        return !!system.networkActions[event];
      });

      systemsWithNetworkActions.forEach(system => system.networkActions[event](entity));
    }));
  }

  removePlayer(playerId) {
    this.players = this.players.filter(({ id }) => playerId !== id);
  }
}

module.exports = ServerNetworkManager;
