import io from 'socket.io-client';

import makeId from '../../common/misc/makeId';

import NetworkManager from '../networkManager';

import networkEvents from '../../common/constants/networkEvents';

const { PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_LEFT } = networkEvents;

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

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
    const fromGame = this.getAttribute('from-game');

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

    if (!fromGame) {
      this.networkManager.addEventListener(PLAYER_CONNECTED, this.onPlayerConnected.bind(this));
    }
    
    this.networkManager.addEventListener(PLAYER_JOINED, this.onPlayerConnected.bind(this));
    this.networkManager.addEventListener(PLAYER_LEFT, this.onPlayerLeft.bind(this));
    this.networkManager.addEventListener('ERROR', this.onConnectionError.bind(this));
    this.networkManager.addEventListener('GAME_STARTED', this.onGameStarted.bind(this));

    if (fromGame) {
      this.players = [...window.players];
    }

    this.render();

    if (fromGame) {
      const connectingBox = document.querySelector('#lobby-connecting');
      connectingBox.style.display = 'none';
    }

    document.querySelector('#link').addEventListener('click', () => {
      copyToClipboard(`${window.location.href}`);
    });

    document.querySelector('#start-btn').addEventListener('click', () => {
      const appRoot = document.querySelector('#game-root');
      appRoot.innerHTML = '<play-state></play-state>';
    });

    const modal = document.querySelector('user-name-modal');
    modal.setAttribute('opened', true);
    modal.onSubmitClick = (val) => {
      console.log(val);
    };
  }

  disconnectedCallback() {
    this.networkManager.removeEventListener(PLAYER_CONNECTED, this.onPlayerConnected);
    this.networkManager.removeEventListener(PLAYER_JOINED, this.onPlayerJoined);
    this.networkManager.removeEventListener(PLAYER_LEFT, this.onPlayerJoined);
    this.networkManager.removeEventListener('GAME_STARTED', this.onGameStarted);
  }

  onGameStarted() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<play-state started="started"></play-state>';
  }

  onPlayerJoined() {
  }

  onPlayerLeft({ id }) {
    this.players = [...this.players.filter(player => {
      return player.id !== id;
    })];

    window.players = [...this.players];

    this.renderPlayers();
  }

  onPlayerConnected({ players }) {
    this.players = players;
    window.players = [...this.players];

    this.renderPlayers();
  }

  onConnectionError() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<menu-state></menu-state>';
  }

  renderPlayers() {
    const lobbyPlayersElement = this.querySelector('lobby-players');
    lobbyPlayersElement.setAttribute('players', JSON.stringify(this.players));
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

        .lobby_game-link {
          margin-top: 2rem;
          text-align: center;
        }

        .link {
          text-decoration: underline;
          cursor: pointer;
        }

      </style>
      <section class="lobby">
        <user-name-modal></user-name-modal>
        <div id="lobby-connecting" class="lobby_connecting">
          <h1> Connecting </h1>
        </div>
        <div class="lobby-title">
          <h2>Lobby</h2>
        </div>
        <div class="users nes-container with-title">
          <h3>Players: </h3>
          <lobby-players players=${JSON.stringify(this.players)}></lobby-players>
          <div class="start-btn">
            <button id="start-btn" class="nes-btn">Start</button>
          </div>
        </div>
        <div class="lobby_game-link">
          Copy <span id="link" class="link">link</span> to invite other players.
        </div>
      </section>
    `;

  }
}

customElements.define('lobby-state', LobbyState);

export default LobbyState;
