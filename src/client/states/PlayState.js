import { ECS, EcsEntity } from '@krol22/ecs';

import InputManager from '../inputManager';
import NetworkManager from '../networkManager';

import GameLoop from '../../common/engine/GameLoop';

import DrawSystem from '../systems/draw';

import DrawComponent from '../../common/components/draw';
import NetworkComponent from '../../common/components/network';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../../common/networkActions';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const clientGameLoop = new GameLoop(60);

class PlayState extends HTMLElement {
  constructor() {
    super();

    this.ecs = new ECS();
    this.inputManager = new InputManager();

    this.update = this.update.bind(this);

    this.networkManager = new NetworkManager(window.playerSocket);
  } 

  connectedCallback() {
    this.innerHTML = this.render();

    const canvas = document.querySelector('#canvas');
    this.ecs.addSystem(new DrawSystem(canvas.getContext('2d')));

    window.players.forEach(player => {
      const newEntity = new EcsEntity([
        new NetworkComponent(player.id),
        new DrawComponent(0, 0, 32, 32, window.assets.sprite),
      ]);

      this.ecs.addEntity(newEntity);
    });

    if (!this.getAttribute('started')) {
      this.networkManager.sendClientEvent('GAME_START', {});
      this.networkManager.addEventListener('GAME_STARTED', this.onGameStarted.bind(this));
    } else {
      this.onGameStarted();
    }

    this.onStart();
  }

  disconnectedCallback() {
    this.networkManager.removeEventListener('GAME_STARTED', this.onGameStarted);
    this.networkManager.removeEventListener('PLAYER_LEFT', this.onPlayerLeft);
    this.networkManager.removeEventListener('GAME_ENDED', this.onGameEnded);
    this.networkManager.removeEventListener('GAME_TICK', this.onGameTick);
  }

  onStart() {
    this.networkManager.addEventListener('PLAYER_LEFT', this.onPlayerLeft.bind(this));
    this.networkManager.addEventListener('GAME_ENDED', this.onGameEnded.bind(this));
    this.networkManager.addEventListener('GAME_TICK', this.onGameTick.bind(this));
  }

  onPlayerLeft({ id }) {
    const clientEntity = this.ecs.__getEntities().find((entity) => entity.getComponent('NETWORK').id === id);

    this.ecs.removeEntity(clientEntity.id);

    window.players = [...window.players.filter(player => {
      return player.id !== id;
    })];
  }

  onGameStarted() {
    console.log('started');
    clientGameLoop.start(this.update);
  }

  onGameEnded() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<lobby-state from-game="true"></lobby-state>'
  }

  onGameTick(serverEntities) {
    const systems = this.ecs.__getSystems();  
    
    systems.forEach(system => {
      if(system.onServerTick) {
        system.onServerTick(serverEntities);
      } 
    });
  }

  onEnd() {

  }

  update() {
    this.inputManager.update();

    if (this.inputManager.keys[LEFT].isDown) {
      this.networkManager.sendClientEvent('CLIENT_EVENT', { event: MOVE_LEFT });
    } else if (this.inputManager.keys[RIGHT].isDown) {
      this.networkManager.sendClientEvent('CLIENT_EVENT', { event: MOVE_RIGHT });
    } else if (this.inputManager.keys[UP].isDown) {
      this.networkManager.sendClientEvent('CLIENT_EVENT', { event: MOVE_UP });
    } else if (this.inputManager.keys[DOWN].isDown) {
      this.networkManager.sendClientEvent('CLIENT_EVENT', { event: MOVE_DOWN });
    } else if (this.inputManager.keys[32].isDown) {
      this.networkManager.sendClientEvent('GAME_END');
    }

    this.ecs.update();
  }

  render() {
    return `
      <section class="play">
        <h3>Press SPACE to end game</h3>
        <canvas
          class="canvas"
          id="canvas"
          width="600"
          height="600">
        </canvas>
      </section>
    `;
  }
}

customElements.define('play-state', PlayState);

export default PlayState;
