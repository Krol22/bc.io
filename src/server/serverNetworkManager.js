export default class ServerNetworkManager {
  constructor(onGameStart, onGameEnd) {
    this.players = [];

    this.onGameStart = onGameStart;
    this.onGameEnd = onGameEnd;
  }

  setEcs(ecs) {
    this.ecs = ecs;
  }

  onPlayerAdded(newPlayer) {
    const { id, socket } = newPlayer;

    socket.on('GAME_START', () => {
      this.onGameStart();
    });

    socket.on('GAME_END', () => {
      this.onGameEnd();
    });

    socket.on('CLIENT_EVENT', (({event}) => {
      const entity = 
        this.ecs.__getEntities()
          .find(entity => entity.getComponent('NETWORK').id === id);

      if (!entity) {
        return;
      }

      const systemsWithNetworkActions = 
        this.ecs.__getSystems().filter(system => {
          return !!system.networkActions[event];
        });

      systemsWithNetworkActions.forEach(system => system.networkActions[event](entity));
    }));
  }

  onPlayerRemoved() {

  }

  sendClientInfo(players) {
    players.forEach(player => {
      const { socket } = player;

      socket.emit('GAME_TICK', this.ecs.__getEntities());
    });
  }
}
