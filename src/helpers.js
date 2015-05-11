var Helpers = {
  inArray: function(needle, haystack) {
    needle = needle.toLowerCase();
  	var length = haystack.length;
  	for(var i=0; i < length; i++) {
      var hs = haystack[i].toLowerCase();
  		if(hs === needle) return true;
  	}
  	return false;
  },

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
