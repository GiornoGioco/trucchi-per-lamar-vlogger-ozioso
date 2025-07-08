// driftTimer.js
// A timer that measures elapsed time but compensates for possible drift using performance.now()

class DriftTimer {
  constructor(callback, intervalMs = 1000) {
    this.callback = callback;
    this.interval = intervalMs;
    this._expected = null;
    this._timeoutId = null;
  }

  _step() {
    const drift = performance.now() - this._expected;
    if (drift > this.interval) {
      // If drift is too high, skip missed intervals
      this._expected = performance.now() + this.interval;
    } else {
      this._expected += this.interval;
    }
    this.callback();

    this._timeoutId = setTimeout(() => this._step(), Math.max(0, this.interval - drift));
  }

  start() {
    if (this._timeoutId !== null) return; // already running
    this._expected = performance.now() + this.interval;
    this._timeoutId = setTimeout(() => this._step(), this.interval);
  }

  stop() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
  }
}

// Usage example:
// const timer = new DriftTimer(() => console.log('Tick', new Date()), 1000);
// timer.start();

export default DriftTimer;
