import io from 'socket.io-client';

import makeId from '../../common/misc/makeId';
import networkEvents from '../../common/constants/networkEvents';

import NetworkManager from '../networkManager';

const { PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_LEFT, ERROR, GAME_STARTED } = networkEvents;

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
    this.render();

    this.elements = {};
    this.elements.connectingBox = document.querySelector('#lobby-connecting');
    this.elements.lobby = document.querySelector('.lobby');

    const userName = localStorage.getItem('userName');

    document.querySelector('#link').addEventListener('click', () => {
      copyToClipboard(`${window.location.href}`);
    });

    document.querySelector('#start-btn').addEventListener('click', () => {
      const appRoot = document.querySelector('#game-root');
      appRoot.innerHTML = '<play-state></play-state>';
    });

    if (!userName) {
      const userNameModal = this.querySelector('user-name-modal');
      userNameModal.setAttribute('opened', true);  
      userNameModal.onSubmitClick = newUserName => {
        localStorage.setItem('userName', newUserName);
        this.connectToServer();
      };

      return;
    }

    this.connectToServer();
  }

  connectToServer() {
    const isRandom = !!this.getAttribute('random');

    //#TODO -> this should be in external state
    const isReturningFromGame = !!this.getAttribute('from-game');

    const userName = localStorage.getItem('userName');

    let roomId = this.getAttribute('roomId');

    // #TODO -> this will be removed in future versions
    if (isRandom || !roomId) {
      roomId = makeId(6);
    }

    window.history.replaceState({ url: roomId }, '', roomId);

    // eslint-disable-next-line no-undef
    const address = `${process.env.SERVER}/?room=${roomId}&uname=${userName}`;
    window.playerSocket = io(address);

    this.networkManager = new NetworkManager(window.playerSocket);

    if (!isReturningFromGame) {
      this.networkManager.addEventListener(PLAYER_CONNECTED, this.onPlayerConnected.bind(this));
    }

    this.networkManager.addEventListener(PLAYER_JOINED, this.onPlayerConnected.bind(this));
    this.networkManager.addEventListener(PLAYER_LEFT, this.onPlayerLeft.bind(this));
    this.networkManager.addEventListener(ERROR, this.onConnectionError.bind(this));
    this.networkManager.addEventListener(GAME_STARTED, this.onGameStarted.bind(this));

    if (isReturningFromGame) {
      this.players = [...window.players];

      this.showLobby();

      return;
    }

    this.elements.connectingBox.classList.add('lobby_connecting--visible');
  }

  disconnectedCallback() {
    this.networkManager.removeEventListener(PLAYER_CONNECTED, this.onPlayerConnected);
    this.networkManager.removeEventListener(PLAYER_JOINED, this.onPlayerJoined);
    this.networkManager.removeEventListener(PLAYER_LEFT, this.onPlayerJoined);
    this.networkManager.removeEventListener(GAME_STARTED, this.onGameStarted);
  }

  showLobby() {
    this.elements.lobby.style.display = 'block';
  }

  onPlayerConnected({ players }) {
    this.elements.connectingBox.classList.remove('lobby_connecting--visible');
    this.players = players;

    window.players = [...this.players];

    this.renderPlayers();
    this.showLobby();
  }

  onPlayerLeft({ id }) {
    this.players = [...this.players.filter(player => {
      return player.id !== id;
    })];

    window.players = [...this.players];

    this.renderPlayers();
  }

  onConnectionError() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<menu-state></menu-state>';
  }

  onGameStarted() {
    const appRoot = document.querySelector('#game-root');
    appRoot.innerHTML = '<play-state started="started"></play-state>';
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
          display: none;
          justify-content: center;
          align-items: center;
          animation: scale 2s infinite ease-in-out;
        }

        .lobby_connecting--visible {
          display: flex;
        }

        .lobby_connecting h1 {
          transform: rotate(15deg);
          animation: rotate 2.5s infinite ease-in-out;
        }

        .lobby {
          display: none;
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
      <user-name-modal></user-name-modal>

      <div id="lobby-connecting" class="lobby_connecting">
        <h1> Connecting </h1>
        <span class="nes-text">(Heroku...)</span>
      </div>
      <section class="lobby">

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
