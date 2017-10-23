class TimeEmitter {
  constructor () {
    this.time = 0;
    this.isPaused = false;

    this._atHandlers = new Map();
    this._everyHandlers = new Map();

    this._timer = 0;
  }

  start(interval = 1000) {
    // run only once
    if (this._timer !== 0) {
      return this;
    }

    // for 0
    this._fireByTime(this.time);

    this._timer = setInterval(() => {
      if (this.isPaused) {
        return;
      }

      this.time++;
      this._fireByTime(this.time);
    }, interval);

    return this;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  destroy() {
    this._atHandlers.clear();
    this._everyHandlers.clear();

    clearInterval(this._timer);
    this._timer = 0;

    return this;
  }

  at(time, handler) {
    if (typeof time !== 'number') { return; }
    if (typeof handler !== 'function') { return; }

    // accept > 0
    if (time < 0) {
      time = 0;
    }

    if (this._atHandlers.has(time)) {
      this._atHandlers.get(time).push(handler);
    } else {
      this._atHandlers.set(time, [handler]);
    }

    return this;
  }

  every(time, handler) {
    if (typeof time !== 'number') { return; }
    if (typeof handler !== 'function') { return; }

    // accept > 1
    if (time < 1) {
      time = 1;
    }

    if (this._everyHandlers.has(time)) {
      this._everyHandlers.get(time).push(handler);
    } else {
      this._everyHandlers.set(time, [handler]);
    }

    return this;
  }

  reset() {
    this.time = 0;
    this._fireByTime(this.time);

    return this;
  }

  _fireByTime(time) {
    const atHandlers = this._atHandlers.get(time);
    if (atHandlers) {
      for (let handler of atHandlers) {
        handler(time);
      }
    }

    const everyKeys = this._everyHandlers.keys();
    for (let key of everyKeys) {
      if (time > 0 && time % key === 0) {
        const handlers = this._everyHandlers.get(key);
        if (handlers) {
          for (let handler of handlers) {
            handler(time);
          }
        }
      }
    }
  }
}

export default TimeEmitter;
