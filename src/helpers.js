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

  totalHeight: function(element) {
    var styles = window.getComputedStyle(element);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);

    return Math.ceil(element.offsetHeight + margin);
  }
}

module.exports = Helpers;
