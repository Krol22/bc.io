import { ECS, EcsEntity } from '@krol22/ecs';

import GameLoop from '../common/engine/GameLoop';

import NetworkComponent from '../common/components/network';
import MapComponent from '../common/components/map';

import MapSystem from './features/map/map.system';
import PhysicsSystem from './features/physics/physics.system.new';

import ServerNetworkManager from './serverNetworkManager';
import generatePlayer from './features/physics/player.generator';

import { loadMap } from './map/map.utils';

import MatterManager from './features/physics/matter.manager';

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
    MatterManager.initialize();
    this.ecs = new ECS();

    const physicsSystem = new PhysicsSystem();
    const mapTestSystem = new MapSystem();

    this.ecs.addSystem(mapTestSystem);
    this.ecs.addSystem(physicsSystem);

    const { number, map } = loadMap('map01');

    const spawnPoints = map.filter(({ type }) => type === 'SPAWN');

    this.players.forEach((player, index) => {
      if (!spawnPoints[index]) {
        console.error(`Not enough spawn points - player ${player.id} not spawned`);
        return;
      }
      const newEntity = generatePlayer(spawnPoints[index].x * 16, spawnPoints[index].y * 16, 16, 16, player.id);

      this.ecs.addEntity(newEntity);
    });

    this.serverNetworkManager.setEcs(this.ecs);
    this.loopId = serverGameLoop.start(this.loop.bind(this));

    this.players.forEach(({ socket }) => {
      socket.emit('GAME_STARTED');
    });
  
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
