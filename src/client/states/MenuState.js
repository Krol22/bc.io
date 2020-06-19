import GameState from '../../common/engine/state/GameState';

class MenuState extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.render();

    const joinBtn = document.querySelector('#join-btn');

    joinBtn.addEventListener('click', () => {
      const appRoot = document.querySelector('#game-root');
      appRoot.innerHTML = '<play-state></play-state>';
    });
  }

  render() {
    return `
      <section class="menu">
        <h1>BC.io</h1>
        <div class="nes-field">
          <label for="name_field">Name</label>
          <input type="text" id="name_field" class="nes-input">
        </div>
        <div class="nes-field">
          <label for="name_field">Room ID</label>
          <input type="text" id="name_field" class="nes-input">
        </div>
        <button id="join-btn" class="nes-btn">Join</button>
      </section>
    `;
  }
}

customElements.define('menu-state', MenuState);

export default MenuState;
