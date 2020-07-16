import 'regenerator-runtime/runtime';

import * as PIXI from 'pixi.js';

import sprite from './assets/tanks.png';

import 'nes.css/css/nes.min.css';

import './states/menu';
import './states/play';
import './states/lobby';

import './ui/lobby/players';
import './ui/modal/modal';
import './ui/modal/userName.modal';


PIXI.Loader.shared.add('tanks', sprite).load(() => {
  const appRoot = document.querySelector('#game-root');

  let roomId = window.location.pathname.split('/')[1];

  if (!roomId) {
    appRoot.innerHTML = '<menu-state></menu-state>';
  }

  if (roomId) {
    appRoot.innerHTML = `<lobby-state roomId="${roomId}"></lobby-state>`;
  }
});


