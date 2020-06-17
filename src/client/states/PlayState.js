import { ECS } from '@krol22/ecs';

import InputManager from '../inputManager';
import ClientNetworkManager from '../clientNetworkManager';
import GameState from '../../common/engine/state/GameState';

import DrawSystem from '../systems/draw';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

class PlayState extends GameState {
  constructor() {
    super('PLAY');

    this.ecs = new ECS();
    this.inputManager = new InputManager();
  } 

  onStart() {
    let socket = 'teest';

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
}

export default PlayState;
