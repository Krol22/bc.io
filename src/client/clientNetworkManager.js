import _ from 'lodash';

import { EcsEntity } from '@krol22/ecs';

import DrawComponent from '../common/components/draw';
import NetworkComponent from '../common/components/network';

export default class ClientNetworkManager {
  constructor(socket, ecs) {
    this.connected = false;
    this.socket = socket;
    this.ecs = ecs;

    this.players = [];

    socket.on('PLAYER_CONNECTED', this.onPlayerConnected.bind(this));
    socket.on('PLAYER_DISCONNECTED', this.onPlayerDisconnected.bind(this));
    socket.on('PLAYER_JOINED', this.onPlayerJoined.bind(this));
    socket.on('PLAYER_LEFT', this.onPlayerLeft.bind(this));
    socket.on('GAME_TICK', this.onGameTick.bind(this));
  }

  sendClientEvent(event) {
    this.socket.emit('CLIENT_EVENT',event);
  }

  onGameTick(serverEntities) {
    const systems = this.ecs.__getSystems();  
    
    systems.forEach(system => {
      if(system.onServerTick) {
        system.onServerTick(serverEntities);
      } 
    });
  }

  onPlayerConnected({ players }) {
    if (this.connected) {
      return;
    }

    this.players = [...players];

    players.forEach(({ id }) => {
      const newEntity = new EcsEntity([
        new NetworkComponent(id),
        new DrawComponent(0, 0, 32, 32, window.assets.sprite),
      ]);

      this.ecs.addEntity(newEntity);
    });

    document.querySelector('#message').innerHTML = 'Connected';

    this.connected = true;
  }

  onPlayerDisconnected() {
    this.connected = false;
  }

  onPlayerJoined({ players }) {
    const playersToAdd = _.differenceBy(players, this.players, 'id');

    playersToAdd.forEach(({ id }) => {
      const newEntity = new EcsEntity([
        new NetworkComponent(id),
        new DrawComponent(0, 0, 32, 32, window.assets.sprite),
      ]);

      this.ecs.addEntity(newEntity);
    });

    this.players = [...this.players, ...playersToAdd];
  }

  onPlayerLeft({ id }) {
    const clientEntity = this.ecs.__getEntities().find((entity) => entity.getComponent('NETWORK').id === id);

    this.ecs.removeEntity(clientEntity.id);
    this.players = this.players.filter(player => player.getComponent('NETWORK').id === id);
  }
}
