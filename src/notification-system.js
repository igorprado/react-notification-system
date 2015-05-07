var React = require('react');
var merge = require('object-assign');
var NotificationContainer = require('./notification-container');

var Helpers = {
  inArray: function(needle, haystack) {
  	var length = haystack.length;
  	for(var i=0; i < length; i++) {
  		if(haystack[i] == needle) return true;
  	}
  	return false;
  }
}

var CONSTANTS = {
  positions: ['tl', 'tr', 'tc', 'bl', 'br', 'bc'],
  levels: ['success', 'error', 'warning', 'info'],
  notification: {
    message: null,
    level: null,
    position: 'tr',
    autoDismiss: true,
    autoDismissDelay: 5000,
    dismissible: true,
    action: null
  }
};

var NotificationSystem = React.createClass({

  uid: 3400,

  _getContainerStyle: function(position) {
    var style = {
      fontFamily: 'inherit',
      position: 'fixed',
      width: '280px',
      padding: '0 10px',
      zIndex: 9998,
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      overflow: 'hidden'
    };

    var y = position.slice(0, 1);

  	if(y === "t") {
  		style.top = "0px";
  		style.bottom = "auto";
  	} else {
  		style.top = "auto";
  		style.bottom = "0px";
  	}

  	var x = position.slice(1, 2);
  	if(x == "l") {
  		style.left = "0px";
  		style.right = "auto";
  	} else if(x == "r") {
  		style.left = "auto";
  		style.right = "0px";
  	}

    return style;
  },

  _getNotificationStyle: function(level) {
    var style = {
      position: 'relative',
      fontSize: '14px',
      border: '1px solid black',
      margin: '10px 0',
      padding: '10px',
      display: 'block',
      width: '100%',
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      boxSizing: 'border-box'
    };

    if (level === 'success') {
      style.borderColor = 'green';
    }

    if (level === 'error') {
      style.borderColor = 'red';
    }

    if (level === 'warning') {
      style.borderColor = 'yellow';
    }

    if (level === 'info') {
      style.borderColor = 'blue';
    }

    return style;
  },

  _getDismissStyle: function(level) {
    var style = {
      position: 'absolute',
      top: '0',
      right: '4px'
    };

    if (level === 'success') {
      style.color = 'green';
    }

    if (level === 'error') {
      style.color = 'red';
    }

    if (level === 'warning') {
      style.color = 'yellow';
    }

    if (level === 'info') {
      style.color = 'blue';
    }

    return style;
  },

  _getActionStyle: function(level) {
    var style = {
      background: '#ffffff',
      borderWidth: '1px 1px 1px 4px',
      borderStyle: 'solid',
      padding: '6px',
      fontWeight: 'bold',
      margin: '10px 0 0 0'
    };

    if (level === 'success') {
      style.borderColor = 'green';
    }

    if (level === 'error') {
      style.borderColor = 'red';
    }

    if (level === 'warning') {
      style.borderColor = 'yellow';
    }

    if (level === 'info') {
      style.borderColor = 'blue';
    }

    return style;
  },

  _didNotificationRemoved: function(uid) {
    var notifications = this.state.notifications.filter(function(notification) {
			return notification.uid !== uid;
		});

		this.setState({ notifications: notifications });
  },

  getInitialState: function() {
    return {
      notifications: []
    }
  },

  addNotification: function(notification) {
    var self = this;
    var _notification = merge({}, CONSTANTS.notification, notification);

    try {
      if (!notification.message) {
        throw "notification message is required."
      }

      if (!notification.level) {
        throw "notification level is required."
      }

      if (!Helpers.inArray(notification.position, CONSTANTS.positions)) {
        throw "'"+ notification.position +"' is not a valid position."
      }

      if (!Helpers.inArray(notification.level, CONSTANTS.levels)) {
        throw "'"+ notification.level +"' is not a valid level."
      }

      var notifications = this.state.notifications;

      _notification.uid = this.uid;
      _notification.ref = "notification-" + this.uid;
      this.uid += 1;

      notifications.push(_notification);

      this.setState({
        notifications: notifications
      });

    } catch(err) {
      console.error('Error adding notification: '+err);
    }

  },

  componentDidMount: function() {
  },

  render: function() {
    var self = this;
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = CONSTANTS.positions.map(function(position) {

        var _notifications = notifications.filter(function(notification) {
          return position === notification.position;
        });

        if (_notifications.length) {
          return (
            <NotificationContainer
              key={position}
              position={position}
              notifications={_notifications}
              style={self._getContainerStyle(position)}
              notificationStyle={self._getNotificationStyle}
              dismissStyle={self._getDismissStyle}
              actionStyle={self._getActionStyle}
              onRemove={self._didNotificationRemoved} />
          );
        }
      });
    }


    return (
      <div className="notifications-container">
        {containers}
      </div>

    );
  }
});

module.exports = NotificationSystem;
