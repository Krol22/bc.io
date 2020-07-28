import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import MapComponent from '../common/components/map';

import MapSystem from './features/map/map.system';
import PhysicsSystem from './features/physics/physics.system.new';

import ServerNetworkManager from './serverNetworkManager';
import generatePlayer from './features/physics/player.generator';

import { loadMap } from './map/map.utils';

import './features/physics/matter.manager';

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
    const mapTestSystem = new MapSystem();

    this.ecs.addSystem(mapTestSystem);
    this.ecs.addSystem(physicsSystem);

    this.players.forEach((player, index) => {
      const newEntity = generatePlayer(40 * index + 200, 40 * index, 16, 16, player.id);

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

    mapTestSystem.buildMap({ map });

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
