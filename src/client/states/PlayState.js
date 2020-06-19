import { ECS } from '@krol22/ecs';
import io from 'socket.io-client';

import InputManager from '../inputManager';
import ClientNetworkManager from '../clientNetworkManager';

import makeId from '../../common/misc/makeId';
import GameLoop from '../../common/engine/GameLoop';

import DrawSystem from '../systems/draw';

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
  } 

  connectedCallback() {
    this.innerHTML = this.render();
    this.onStart();

    clientGameLoop.start(this.update);
  }

  onStart() {
    let socket = 'teest';
    let roomId = window.location.pathname.split('/')[1];

    if(!roomId) {
      roomId = makeId(6);
    } 

    const address = `${process.env.SERVER}/?room=${roomId}`;

    socket = io(address);

    const canvas = document.querySelector('#canvas');
    this.ecs.addSystem(new DrawSystem(canvas.getContext('2d')));

    this.clientNetworkManager = new ClientNetworkManager(socket, this.ecs);
  }

  onEnd() {

  }

  update() {
    this.inputManager.update();

    if (this.inputManager.keys[LEFT].isDown) {
      this.clientNetworkManager.sendClientEvent({ event: MOVE_LEFT });
    } else if (this.inputManager.keys[RIGHT].isDown) {
      this.clientNetworkManager.sendClientEvent({ event: MOVE_RIGHT });
    } else if (this.inputManager.keys[UP].isDown) {
      this.clientNetworkManager.sendClientEvent({ event: MOVE_UP });
    } else if (this.inputManager.keys[DOWN].isDown) {
      this.clientNetworkManager.sendClientEvent({ event: MOVE_DOWN });
    }

    this.ecs.update();
  }

  render() {
    return `
      <section class="play">
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
