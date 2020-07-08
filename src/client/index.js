import 'regenerator-runtime/runtime';

import sprite from './assets/tanks.png';

import 'nes.css/css/nes.min.css';

import './states/menu';
import './states/play';
import './states/lobby';

import './ui/lobby/players';
import './ui/modal/modal';
import './ui/modal/userName.modal';

const loadAsset = (imageSrc, isAudio) => {
  return new Promise(resolve => {
    const asset = isAudio ? new Audio() : new Image();
    asset.src = imageSrc;
    asset.onload = () => {
      resolve(asset);
    };

    asset.onerror = e => {
      console.log(e);
    };
  });
};

const start = async () => {
  window.assets = {};
  window.assets.sprite = await loadAsset(sprite);
};

start()
  .then(() => {
    const appRoot = document.querySelector('#game-root');

    let roomId = window.location.pathname.split('/')[1];

    if (!roomId) {
      appRoot.innerHTML = '<menu-state></menu-state>';
    }

    if (roomId) {
      appRoot.innerHTML = `<lobby-state roomId="${roomId}"></lobby-state>`;
    }
  });

