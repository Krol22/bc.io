import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import PhysicsComponent from '../common/components/physics';

import PhysicsSystem from './systems/physicsSystem';

class ServerNetworkManager {
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

const serverGameLoop = new GameLoop(30);

const GAME_STATES = {
  LOBBY: 'LOBBY',
  PLAY: 'PLAY',
};

class Game {
  constructor() {
    this.players = [];
    this.serverNetworkManager = new ServerNetworkManager(
      this.startGame.bind(this),
      this.endGame.bind(this),
    );
  }

  addPlayer(newPlayer) {
    this.players.push(newPlayer);
    this.serverNetworkManager.onPlayerAdded(newPlayer);
  }

  removePlayer(playerId) {
    this.players = [...this.players.filter(({ id }) => playerId !== id)];
    this.serverNetworkManager.onPlayerRemoved(playerId);
  }

  startGame() {
    this.state = GAME_STATES.PLAY;
    this.ecs = new ECS();

    const physicsSystem = new PhysicsSystem();
    this.ecs.addSystem(physicsSystem);

    this.players.forEach(player => {
      const newEntity = new EcsEntity([
        new PhysicsComponent(33 * this.players.length, 0),
        new NetworkComponent(player.id)
      ]);

      this.ecs.addEntity(newEntity);
    });

    this.serverNetworkManager.setEcs(this.ecs);
    this.loopId = serverGameLoop.start(this.loop.bind(this));

    this.players.forEach(({ socket }) => {
      socket.emit('GAME_STARTED');
    });
  }

  endGame() {
    this.state = GAME_STATES.LOBBY;
    serverGameLoop.stop(this.loopId);

    this.players.forEach(({ socket }) => {
      socket.emit('GAME_ENDED');
    });
  }

  loop() {
    this.ecs.update();
    this.serverNetworkManager.sendClientInfo(this.players);
  }
}

export default Game;
