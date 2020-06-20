class Modal extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="modal">
        <div class="modal-content">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }
}

customElements.define('game-modal', Modal);

export default Modal;
