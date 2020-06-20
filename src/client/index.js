import "regenerator-runtime/runtime";

import io from 'socket.io-client';
import { ECS } from '@krol22/ecs';

import InputManager from './inputManager';
import ClientNetworkManager from './clientNetworkManager';

import DrawSystem from './systems/draw';

import GameLoop from '../common/engine/GameLoop';
import makeId from '../common/misc/makeId';

import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

import sprite from './assets/tanks.png';

import 'nes.css/css/nes.min.css';

import './states/MenuState';
import './states/PlayState';
import './states/LobbyState';

import './ui/lobby/players';

let socket;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const clientGameLoop = new GameLoop(60);
const inputManager = new InputManager();
const ecs = new ECS();

let clientNetworkManager;

function connect() {
  let roomId = window.location.pathname.split('/')[1];

  if(!roomId) {
    roomId = makeId(6);
    window.location.pathname = roomId;
    return;
  } 

  const address = `${process.env.SERVER}/?room=${roomId}`;

  socket = io(address);

  const canvas = document.querySelector('#canvas');
  ecs.addSystem(new DrawSystem(canvas.getContext('2d')));

  clientNetworkManager = new ClientNetworkManager(socket, ecs);
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
    clientNetworkManager.sendClientEvent({ event: MOVE_LEFT });
  } else if (inputManager.keys[RIGHT].isDown) {
    clientNetworkManager.sendClientEvent({ event: MOVE_RIGHT });
  } else if (inputManager.keys[UP].isDown) {
    clientNetworkManager.sendClientEvent({ event: MOVE_UP });
  } else if (inputManager.keys[DOWN].isDown) {
    clientNetworkManager.sendClientEvent({ event: MOVE_DOWN });
  }

  ecs.update();
}

const start = async () => {
  window.assets = {};
  window.assets.sprite = await loadAsset(sprite);
}

start()
  .then(() => {
    const appRoot = document.querySelector('#game-root');

    let roomId = window.location.pathname.split('/')[1];

    if (!roomId) {
      appRoot.innerHTML = '<menu-state></menu-state>';
    }

    if (roomId) {
      appRoot.innerHTML = `<lobby-state roomId="${roomId}"></lobby-state>`
    }

  });

