class GameLoop {
  constructor(frameRate) {
    this.frameRate = frameRate;
    this.time = 0;
  }

  loop(callback) {
    return window.requestAnimationFrame(() => {
      let now = Date.now();
      let elapsed = now - this.time;

      if (elapsed > 999) {
        elapsed = 1 / this.frameRate;
      } else {
        elapsed /= 1000;
      }

      this.time = now;
      callback(elapsed);
    });
  }

  start(callback) {
    const self = this;

    if (typeof window === 'undefined') {
      return setInterval(() => {
        callback()
      }, 10);
    }

    return this.loop(function tick(elapsed) {
      callback(elapsed);
      self.loop(tick);
    });
  }

  stop(id) {
    if (typeof window === 'undefined') {
      clearInterval(id);
      return;
    }

    window.cancelAnimationFrame(id);
  }
}

module.exports = GameLoop;
