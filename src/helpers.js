var Helpers = {
  timer: function(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
    };

    this.clear = function() {
      clearTimeout(timerId);
    }

    this.resume();
  }
}

module.exports = Helpers;
