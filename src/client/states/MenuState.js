class MenuState extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.render();

    // const joinBtn = document.querySelector('#join-btn');
    const createBtn = document.querySelector('#create-btn');
    // const joinRoomBtn = document.querySelector('#join-room-btn');

    const nameField = document.querySelector('#name_field');

    // joinBtn.addEventListener('click', () => {
      // const userName = nameField.value;
      // localStorage.setItem('userName', userName);
//
      // const appRoot = document.querySelector('#game-root');
      // appRoot.innerHTML = '<lobby-state join></play-state>';
    // });

    createBtn.addEventListener('click', () => {
      const userName = nameField.value;
      localStorage.setItem('userName', userName);

      const appRoot = document.querySelector('#game-root');
      appRoot.innerHTML = '<lobby-state random="random"></lobby-state>';
    });

    // joinRoomBtn.addEventListener('click', () => {
      // const userName = nameField.value;
      // const roomId = document.querySelector('#room_field').value;
      // localStorage.setItem('userName', userName);
//
      // const appRoot = document.querySelector('#game-root');
      // appRoot.innerHTML = `<lobby-state roomId=${roomId}></lobby-state>`;
    // });

    if (localStorage.getItem('userName')) {
      const userName = localStorage.getItem('userName');

      nameField.value = userName;
    }
  }

  render() {
    return `
      <style>
        .menu {
          text-align: center;
        }

        .menu h1 {
          font-size: 3rem;
          margin-bottom: 5rem;
        }

        .nes-field {
          margin: 2rem 0;  
        }

        .menu_buttons {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }

        .menu_buttons button {
          margin-top: 1rem;
          width: 60%;
          display: block;
        }
      </style>
      <section class="menu">
        <game-modal>
          <div slot="modal-content">Test123</div>
        </game-modal>

        <h1>BC.io</h1>
        <div class="nes-field">
          <label for="name_field">Name</label>
          <input type="text" id="name_field" class="nes-input">
        </div>
        <!--
          <div class="nes-field">
            <label for="room_field">RoomId</label>
            <input type="text" id="room_field" class="nes-input">
          </div>
        -->
        <div class="menu_buttons">
          <button id="create-btn" class="nes-btn">Create Room</button>
          <!-- <button id="join-btn" class="nes-btn">Join Random</button> -->
          <!-- <button id="join-room-btn" class="nes-btn">Join Room</button> -->
        </div>
      </section>
    `;
  }
}

customElements.define('menu-state', MenuState);

export default MenuState;
