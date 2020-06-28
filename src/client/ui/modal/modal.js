class Modal extends HTMLElement {
  static get observedAttributes() {
    return ['opened'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'opened') {
      const modal = document.querySelector('.modal');
      modal.classList.toggle('modal--opened', newValue === 'true');
    }
  }

  render() {
    this.innerHTML = `
      <style>
        .modal-content {
          padding: 30px;
        }

      </style>
      <div class="modal">
        <div class="modal-content">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }
}

customElements.define('ui-modal', Modal);

export default Modal;
