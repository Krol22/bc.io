import "regenerator-runtime/runtime";

import io from 'socket.io-client';
import { ECS, EcsEntity } from '@krol22/ecs';

import InputManager from './inputManager';
import GameLoop from '../common/engine/GameLoop';
import DrawSystem from './systems/draw';

import DrawComponent from '../common/components/draw';
import NetworkComponent from '../common/components/network';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

import sprite from './assets/tanks.png';

let socket;
let inputManager;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const clientGameLoop = new GameLoop(60);
const ecs = new ECS();

const messsageElement = document.querySelector('#message');

const canvas = document.querySelector('#canvas');
const system = new DrawSystem(canvas.getContext('2d'));

ecs.addSystem(system);

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

  socket.on('PLAYER_JOINED', ({ players }) => {
    messsageElement.innerHTML = 'Connected';

    players.forEach(({ id }) => {
      const newEntity = new EcsEntity([
        new NetworkComponent(id),
        new DrawComponent(0, 0, 32, 32, window.assets.sprite),
      ]);
      ecs.addEntity(newEntity);
    })
  });

  socket.on('PLAYER_DISCONNECTED', ({ id }) => {
    const clientEntity = ecs.__getEntities().find((entity) => entity.getComponent('NETWORK').id === id);
    ecs.removeEntity(clientEntity.id);
  });

  socket.on('GAME_TICK', serverEntities => {
    serverEntities.forEach(serverEntity => {
      const networkId = serverEntity.components.find(({ _type }) => _type === 'NETWORK').id;
      const serverPhysicsComponent = serverEntity.components.find(({ _type }) => _type === 'PHYSICS');

      const clientEntity = ecs.__getEntities().find((entity) => entity.getComponent('NETWORK').id === networkId);
      
      if (!clientEntity) {
        return;
      }

      const drawComponent = clientEntity.getComponent('DRAW');

      drawComponent.x = serverPhysicsComponent.x;
      drawComponent.y = serverPhysicsComponent.y;

      const { vx, vy } = serverPhysicsComponent;

      if (vy < 0) {
        drawComponent.dir = 0;
      }

      if (vy > 0) {
        drawComponent.dir = 2;
      }

      if (vx > 0) {
        drawComponent.dir = 1;
      }

      if (vx < 0) {
        drawComponent.dir = 3;
      }
    });
  });

  inputManager = new InputManager();
}

const loadAsset = (imageSrc, isAudio) => {
  return new Promise(resolve => {
    const asset = isAudio ? new Audio() : new Image();
    asset.src = imageSrc;
    asset.onload = () => {
      resolve(asset);
    }

    asset.onerror = e => {
      console.log(e);
    }
  });
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

  ecs.update();
}

const start = async () => {
  window.assets = {};
  window.assets.sprite = await loadAsset(sprite);
  connect();
  clientGameLoop.start(loop);
}

start();
