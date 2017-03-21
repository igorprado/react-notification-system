var Helpers = {
  Timer: function Timer(callback, delay) {
    var timerId;
    var start;
    var remaining = delay;

    this.pause = function pause() {
      clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    this.resume = function resume() {
      start = new Date();
      clearTimeout(timerId);
      timerId = setTimeout(callback, remaining);
    };

    this.clear = function clear() {
      clearTimeout(timerId);
    };

    this.resume();
  }
};

module.exports = Helpers;
