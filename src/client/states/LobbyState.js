import io from 'socket.io-client';

import makeId from '../../common/misc/makeId';

import NetworkManager from '../networkManager';

import networkEvents from '../../common/constants/networkEvents';

const { PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_LEFT } = networkEvents;

class LobbyState extends HTMLElement {
  constructor() {
    super();

    this.players = [];
  }

  connectedCallback() {
    const random = this.getAttribute('random');
    const join = this.getAttribute('join');
    // #TODO remove this later -> it's only for testing purposes
    const roomId = this.getAttribute('roomId');

    if (roomId) {
      const userName = localStorage.getItem('userName');
      window.history.replaceState({ url: roomId }, '', roomId);

      // eslint-disable-next-line no-undef
      const address = `${process.env.SERVER}/?room=${roomId}&uname=${userName}`;
      window.playerSocket = io(address);

      this.roomId = roomId;

    } else if (random) {
      const roomId = makeId(6);
      const userName = localStorage.getItem('userName');

      window.history.replaceState({ url: roomId }, '', roomId);

      // eslint-disable-next-line no-undef
      const address = `${process.env.SERVER}/?room=${roomId}&uname=${userName}`;

      window.playerSocket = io(address);

      this.roomId = roomId;
    } else if (join) {
      console.log('join');
    }

    this.networkManager = new NetworkManager(window.playerSocket);

    console.log(PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_LEFT);

    this.networkManager.addEventListener(PLAYER_CONNECTED, this.onPlayerConnected.bind(this));
    this.networkManager.addEventListener(PLAYER_JOINED, this.onPlayerConnected.bind(this));
    this.networkManager.addEventListener(PLAYER_LEFT, this.onPlayerLeft.bind(this));

    this.render();
  }

  disconnectedCallback() {
    this.networkManager.removeEventListener(PLAYER_CONNECTED, this.onPlayerConnected);
    this.networkManager.removeEventListener(PLAYER_JOINED, this.onPlayerJoined);
    this.networkManager.removeEventListener(PLAYER_LEFT, this.onPlayerJoined);
  }

  onPlayerJoined() {
    
  }

  onPlayerLeft({ id }) {
    console.log(JSON.stringify(this.players));
    console.log(id);

    this.players = [...this.players.filter(player => {
      return player.id !== id;
    })];

    this.render();

    const connectingBox = document.querySelector('#lobby-connecting');
    connectingBox.style.display = 'none';
  }

  onPlayerConnected({ players }) {
    this.players = players;

    this.render();

    const connectingBox = document.querySelector('#lobby-connecting');
    connectingBox.style.display = 'none';
  }

  render() {
    this.innerHTML = `
      <style>
        @keyframes scale {
          50% {
            transform: scale(1.5);
          }
        }

        @keyframes rotate {
          50% {
            transform: rotate(-15deg);
          }
        }

        .lobby_connecting {
          position: absolute;  
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: scale 2s infinite ease-in-out;
        }

        .lobby_connecting h1 {
          transform: rotate(15deg);
          animation: rotate 2.5s infinite ease-in-out;
        }
      </style>
      <section class="lobby">
        <div id="lobby-connecting" class="lobby_connecting">
          <h1> Connecting </h1>
        </div>
        <div class="lobby-title">
          <h2>Lobby</h2>
        </div>
        <div class="users nes-container with-title">
          <p class="title">Room: ${this.roomId} players</p>
          <lobby-players players=${JSON.stringify(this.players)}></lobby-players>
          <div class="start-btn">
            <button id="start-btn" class="nes-btn">Start</button>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lobby-state', LobbyState);

export default LobbyState;
