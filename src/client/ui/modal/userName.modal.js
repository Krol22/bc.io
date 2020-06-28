import validator from 'validator';

class UserNameModal extends HTMLElement {
  static get observedAttributes() {
    return ['opened'];
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'opened') {
      this.querySelector('ui-modal').setAttribute('opened', newValue);
    }
  }

  connectedCallback() {
    this.render();

    const nameField = document.querySelector('#name_field');
    const submitButton = document.querySelector('#submit-btn');

    this.uiModal = this.querySelector('ui-modal');

    nameField.addEventListener('change', event => {
      const requireErrorField = document.querySelector('.name_field_err_required');
      const patternErrorField = document.querySelector('.name_field_err_pattern');

      requireErrorField.style.display = 'none';
      patternErrorField.style.display = 'none';

      nameField.classList.toggle('is-error', false);

      const value = event.target.value;

      if (validator.isEmpty(value)) {
        nameField.style.animation = 'shake .2s ease-in-out';
        nameField.classList.toggle('is-error', true);
        requireErrorField.style.display = 'block';

        setTimeout(() => {
          nameField.style.animation = '';
        }, 200);
        return;
      }

      if (!validator.isAlphanumeric(value)) {
        nameField.style.animation = 'shake .2s ease-in-out';
        nameField.classList.toggle('is-error', true);
        patternErrorField.style.display = 'block';

        setTimeout(() => {
          nameField.style.animation = '';
        }, 200);
        return;
      }
    });

    submitButton.addEventListener('click', () => {
      this.uiModal.setAttribute('opened', false);
      this.onSubmitClick(nameField.value);
    });
  }

  render() {
    this.innerHTML = `
      <style>
        .user-name-modal__content {
          text-align: center;
          width: 400px;
        } 

        .user-name-modal__content .error {
          display: none;
        }

        .user-name-modal__content .nes-field {
          margin: 40px 0;
        }

      </style>
      <ui-modal>
        <div class="user-name-modal__content">
          <h2 class="nes-text">You need a name!</h2>
          <div class="nes-field">
            <input type="text" id="name_field" class="nes-input">
            <div class="error name_field_err_required">* Field is required!</div>
            <div class="error name_field_err_pattern">* Use letters and numbers only!</div>
          </div>
          <div class="submit-btn">
            <button id="submit-btn" class="nes-btn">Go!</button>
          </div>
        </div>
      </ui-modal>
    `;
  }
}

customElements.define('user-name-modal', UserNameModal);

export default UserNameModal;
