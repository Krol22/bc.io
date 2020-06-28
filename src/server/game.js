import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import PhysicsComponent from '../common/components/physics';

import PhysicsSystem from './systems/physicsSystem';
import ServerNetworkManager from './serverNetworkManager';

const GAME_STATES = {
  LOBBY: 'LOBBY',
  PLAY: 'PLAY',
};

const serverGameLoop = new GameLoop(30);

class Game {
  constructor() {
    this.entities = [];
    this.players = [];
    this.networkEntities = [];

    this.state = GAME_STATES.LOBBY;

    this.ecs = new ECS();
  }

  addPlayer(newPlayer) {
    this.serverNetworkManager.addPlayer(newPlayer);
    this.players.push(newPlayer);
  }

  restartGame() {}

  removePlayer(playerId) {
    this.players = [...this.players.filter(({ id }) => playerId !== id)];
  }

  loop() {
    this.ecs.update();
    this.serverNetworkManager.sendClientInfo();
  }

  start() {
    this.state = GAME_STATES.PLAY;

    console.log('gameStart');

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

    this.serverNetworkManager = new ServerNetworkManager(
      this.ecs.__getEntities(),
      [physicsSystem],
      this
    );

    this.serverNetworkManager.startGame();
    this.loopId = serverGameLoop.start(this.loop.bind(this));
  }

  end() {
    this.state = GAME_STATES.LOBBY;
    this.serverNetworkManager.endGame();
    serverGameLoop.stop(this.loopId);
  }
}

export default Game;
