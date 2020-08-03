class GameLoop {
  constructor(frameRate) {
    this.frameRate = frameRate;
    this.time = 0;
    this.animationFrameId = undefined;
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

    this.animationFrameId = this.loop(function tick(elapsed) {
      callback(elapsed);
      if (self.end) {
        return;
      }

      self.animationFrameId = self.loop(tick, self.animationFrameId);
    });

    return this.animationFrameId;
  }

  stop(id) {
    if (typeof window === 'undefined') {
      clearInterval(id);
      return;
    }

    this.end = true;
    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = undefined;
  }
}

module.exports = GameLoop;
