class ServerNetworkManager {
  constructor(entities, systems, game) {
    this.entities = entities;
    this.systems = systems;
    this.game = game;

    this.players = [];
  }

  sendClientInfo() {
    this.players.forEach(player => {
      const { socket } = player;

      socket.emit('GAME_TICK', this.entities);
    });
  }

  startGame() {
    this.players.forEach(({ socket }) => {
      socket.emit('GAME_STARTED');
    });
  }

  endGame() {
    this.players.forEach(({ socket }) => {
      socket.emit('GAME_ENDED');  
    });
  }

  addPlayer(newPlayer) {
    const { id, socket } = newPlayer;

    this.players.push(newPlayer);

    socket.on('GAME_START', () => {
      console.log('test23');
      this.game.start();
    });

    socket.on('GAME_END', () => {
      this.game.end();
    });

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
