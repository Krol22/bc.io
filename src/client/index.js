import "regenerator-runtime/runtime";

import io from 'socket.io-client';
import { ECS, EcsEntity } from '@krol22/paula';

import InputManager from './inputManager';
import GameLoop from '../common/engine/GameLoop';
import DrawSystem from './systems/draw';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

import sprite from './assets/tanks.png';

let playerId;
let socket;
let inputManager;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACE = 32;

const clientGameLoop = new GameLoop(60);
const ecs = new ECS();

const canvas = document.querySelector('#canvas');

console.log(DrawSystem);

const system = new DrawSystem();

ecs.addSystem(system);

class NetworkComponent {
  constructor(id) {
    this._type = 'Network';
    this.id = id;
  }
}

class PhysicsComponent {
  constructor(x = 0, y = 0) {
    this._type = 'PHYSICS';

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }
}

class DrawComponent {
  constructor(x, y, width, height, image) {
    this._type = 'DRAW';

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.image = image;
  }
}

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

  socket.on('PLAYER_JOINED', ({ id }) => {
    console.log(`Player ${id} has joined.`);
    const newEntity = new EcsEntity([
      new PhysicsComponent(0, 0),
      new NetworkComponent(id),
      new DrawComponent(0, 0, 16, 16, window.assets.sprite),
    ]);
    ecs.addEntity(newEntity);

    console.log(newEntity);
  });

  socket.on('PLAYER_DISCONNECTED', ({ id }) => {
    const clientEntity = ecs.__getEntities().find((entity) => entity.getComponent('Network').id === id);
    ecs.removeEntity(clientEntity.id);
  });

  socket.on('GAME_TICK', serverEntities => {
    serverEntities.forEach(serverEntity => {
      const networkId = serverEntity.components.find(({ _type }) => _type === 'Network').id;
      const serverPhysicsComponent = serverEntity.components.find(({ _type }) => _type === 'PHYSICS');

      // Should be officialy supported
      const clientEntity = ecs.__getEntities().find((entity) => entity.getComponent('Network').id === networkId);
      
      if (!clientEntity) {
        console.log('bug!');
        return;
      }

      const physicsComponent = clientEntity.getComponent('PHYSICS');

      physicsComponent.x = serverPhysicsComponent.x;
      physicsComponent.y = serverPhysicsComponent.y;

      const element = document.querySelector('#entity_1');

      element.style.top = physicsComponent.y + 'px';
      element.style.left = physicsComponent.x + 'px';
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
