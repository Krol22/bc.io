import { ECS } from '@krol22/ecs';

import InputManager from '../inputManager';
import NetworkManager from '../features/network/networkManager';
import ReducerManager from '../features/network/reducerManager';

import GameLoop from '../../common/engine/GameLoop';

import DrawSystem from '../features/render/draw.system';
import MapSystem from '../features/map/map.system';
import AnimationSystem from '../features/render/animation.system';

import PixiManager from '../features/render/pixi.manager';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, TEST_DESTROY_MAP } from '../../common/constants/playerActions';
import { GAME_SCALE } from '../../common/constants';
import generatePlayer from '../features/player/player.generator';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

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
    const drawSystem = new DrawSystem();
    const mapSystem = new MapSystem();

    this.ecs.addSystem(drawSystem);
    this.ecs.addSystem(new AnimationSystem());
    this.ecs.addSystem(mapSystem);
    // this.ecs.addSystem(new MapSystem());

    window.players.forEach(player => this.ecs.addEntity(generatePlayer(player.id)));

    if (!this.getAttribute('started')) {
      this.networkManager.sendClientEvent('GAME_START', {});
      this.networkManager.addEventListener('GAME_STARTED', this.onGameStarted.bind(this));
    } else {
      this.onGameStarted();
    }

    drawSystem.initializePixi(); 

    this.clientGameLoop = new GameLoop(60);

    const matterCheckbox = document.querySelector('#matter_show');

    matterCheckbox.addEventListener('change', () => {
      this.debug = matterCheckbox.checked;
    });

    this.onStart();
  }

  disconnectedCallback() {
    this.networkManager.removeEventListener('GAME_STARTED', this.onGameStarted);
    this.networkManager.removeEventListener('PLAYER_LEFT', this.onPlayerLeft);
    this.networkManager.removeEventListener('GAME_ENDED', this.onGameEnded);
    this.networkManager.removeEventListener('GAME_TICK', this.onGameTick);

    this.onEnd();
  }

  onStart() {
    this.networkManager.addEventListener('PLAYER_LEFT', this.onPlayerLeft.bind(this));
    this.networkManager.addEventListener('GAME_ENDED', this.onGameEnded.bind(this));
    this.networkManager.addEventListener('GAME_TICK', this.onGameTick.bind(this));

    this.reducerManager = new ReducerManager(this.networkManager, this.ecs); 
  }

  onPlayerLeft({ id }) {
    const clientEntity = this.ecs.__getEntities().find((entity) => entity.getComponent('NETWORK').id === id);

    this.ecs.removeEntity(clientEntity.id);

    window.players = [...window.players.filter(player => {
      return player.id !== id;
    })];
  }

  onGameStarted() {
    this.clientGameLoop.start(this.update);
  }

  onGameEnded() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<lobby-state from-game="true"></lobby-state>';
  }

  onGameTick({ entities: serverEntities, debug }) {
    const systems = this.ecs.__getSystems();  

    systems.forEach(system => {
      if(system.onServerTick) {
        system.onServerTick(serverEntities);
      } 
    });

    if (!this.debug) {
      return;
    }

    debug.forEach(({ vertices }) => {
      const points = vertices.map(({ x, y }) => ([x * GAME_SCALE, y * GAME_SCALE])).flat();
      PixiManager.graphics.lineStyle(1, 0xFF00FF);
      PixiManager.graphics.drawPolygon(points);
      PixiManager.graphics.endFill();
    });
  }

  onEnd() {
    this.clientGameLoop.stop();
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
    } else if (this.inputManager.keys[65].isDown) {
      this.networkManager.sendClientEvent('CLIENT_EVENT', { event: TEST_DESTROY_MAP });
    }

    this.ecs.update();
  }

  render() {
    return `
      <section class="play">
        <h3 class="">Press SPACE to end game</h3>
        <div>
          <label>
            <input id="matter_show" type="checkbox" class="nes-checkbox" />
            <span>Show matter body</span>
          </label>
        </div>
        <div class="canvas" id="canvas"></div>
      </section>
    `;
  }
}

customElements.define('play-state', PlayState);

export default PlayState;
