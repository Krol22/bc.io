import io from 'socket.io-client';

import makeId from '../../common/misc/makeId';

class LobbyState extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.render();

    const random = this.getAttribute('random');
    const join = this.getAttribute('join');

    const connectingBox = document.querySelector('#lobby-connecting');

    if (random) {
      const roomId = makeId(6);
      const userName = localStorage.getItem('userName');

      window.history.replaceState({ url: roomId }, '', roomId);

      // eslint-disable-next-line no-undef
      const address = `${process.env.SERVER}/?room=${roomId}&uname=${userName}`;

      window.playerSocket = io(address);

      connectingBox.style.display = 'none';
    }

    if (join) {
      console.log('join');
    }
  }

  render() {
    return `
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
          <p class="title">Room: l1gj-d9 players</p>
          <div class="lobby-players">
            <div class="lobby-player">
              <div class="player-nick">Test1</div> <div class="remove-player">X</div>
            </div>
            <div class="lobby-player">
              <div class="player-nick">Test1</div> <div class="remove-player">X</div>
            </div>
            <div class="lobby-player">
              <div class="player-nick">Test1</div> <div class="remove-player">X</div>
            </div>
          </div>
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
