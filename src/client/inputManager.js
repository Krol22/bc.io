class InputManager {
  constructor() {
    this.keys = {};
    for (let i = 8; i < 222; i++){
      this.keys[i] = {
        isDown: false,
        isPressed: false
      };
    }

    window.addEventListener('keydown', (event) => {
      try {
        this.keys[event.which].isDown = true;
      } catch(e) {}
    });

    window.addEventListener('keyup', (event) => {
      try { 
        this.keys[event.which].isDown = false;
        this.keys[event.which].prevIsDown = false;
        this.keys[event.which].isPressed = false;
      } catch(e) {}
    });
  }

  update() {
    for(let i = 8; i < 222; i++){
      if(!this.keys[i].isDown) {
        continue;
      }

      this.keys[i].isPressed = this.keys[i].isDown === this.keys[i].prevIsDown;
      this.keys[i].prevIsDown = this.keys[i].isDown;
    }
  }
};

export default InputManager;
