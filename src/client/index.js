import io from 'socket.io-client';
import InputManager from './inputManager';
import GameLoop from '../common/engine/GameLoop';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

let playerId;
let socket;
let inputManager;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACE = 32;

const clientGameLoop = new GameLoop(60);

function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function connect() {
  let roomId = window.location.pathname.split('/')[1];

  if(!roomId) {
    roomId = makeId(6);
    window.location.pathname = roomId;
    return;
  } 

  const address = `http://localhost:3000/?room=${roomId}`;

  socket = io(address);

  socket.on('joined', data => {
    playerId = data.id;

    document.querySelector('#message').innerHTML = 'Connected';
  });

  socket.on('player_disconnected', data => {
    console.log('disconnected');

    document.querySelector('#message').innerHTML = 'Not connected';
  });

  socket.on('GAME_TICK', entities => {
    entities.forEach((entity, index) => {
      const element = document.querySelector(`#entity_${index}`);
      const physicsComponent = entity.components.find(({ _type }) => _type === 'PHYSICS');
      element.style.top = physicsComponent.y + 'px';
      element.style.left = physicsComponent.x + 'px';
    });
  });

  inputManager = new InputManager();

}

function loop() {
  inputManager.update();

  if (inputManager.keys[LEFT].isDown) {
    socket.emit('CLIENT_EVENT', { event: MOVE_LEFT });
  } else if (inputManager.keys[RIGHT].isDown) {
    socket.emit('CLIENT_EVENT', { event: MOVE_RIGHT });
  } else if (inputManager.keys[UP].isDown) {
    socket.emit('CLIENT_EVENT', { event: MOVE_UP });
  } else if (inputManager.keys[DOWN].isDown) {
    socket.emit('CLIENT_EVENT', { event: MOVE_DOWN });
  }
}

connect();
clientGameLoop.start(loop);
