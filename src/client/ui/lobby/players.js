class Players extends HTMLElement {
  static get observedAttributes() {
    return ['players'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'players') {
      this.players = JSON.parse(newValue);
      this.render();
    }
  }

  render() {
    this.innerHTML = `
      <div class="lobby-players">
        ${this.players.map(player => (`<div> ${player.userName} </div>`)).join('')}
      </div>
    `;
  }
}

customElements.define('lobby-players', Players);

export default Players;
