import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import PhysicsComponent from '../common/components/physics';
import MapComponent from '../common/components/map';

import PhysicsSystem from './systems/physicsSystem';

import ServerNetworkManager from './serverNetworkManager';

import { loadMap } from './map/map.utils';

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

    const { number, map } = loadMap('map01');
  
    this.ecs.addEntity(new EcsEntity([
      new MapComponent(number, map),
      new NetworkComponent(444),
    ]));

    this.players.forEach(({ socket }) => {
      socket.emit('MAP_LOAD', {
        number, map, networkId: 444,
      });
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
