var React = require('react');
var merge = require('object-assign');
var NotificationContainer = require('./notification-container');
var Constants = require('./constants');
var Styles = require('./styles');

var Helpers = {
  inArray: function(needle, haystack) {
    needle = needle.toLowerCase();
  	var length = haystack.length;
  	for(var i=0; i < length; i++) {
      var hs = haystack[i].toLowerCase();
  		if(hs === needle) return true;
  	}
  	return false;
  }
}

var NotificationSystem = React.createClass({

  uid: 3400,

  _getStyles: {
    overrideStyle: {},

    overrideWidth: null,

    setOverrideStyle: function(style) {
      this.overrideStyle = style;
    },

    wrapper: function() {
      var override = this.overrideStyle.Wrapper || {};
      return merge({}, Styles.Wrapper, this.overrideStyle);
    },

    container: function(position) {
      var override = this.overrideStyle.Containers || {};

      // Check if it's changing width
      if (override.DefaultStyle && override.DefaultStyle.width) { this.overrideWidth = override.DefaultStyle.width; }
      return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
    },

    notification: function(level) {
      var override = this.overrideStyle.NotificationItem || {};
      return merge({}, Styles.NotificationItem.DefaultStyle, Styles.NotificationItem[level], override.DefaultStyle, override[level]);
    },

    messageWrapper: function(level) {
      var override = this.overrideStyle.MessageWrapper || {};
      return merge({}, Styles.MessageWrapper.DefaultStyle, Styles.MessageWrapper[level], override.DefaultStyle, override[level]);
    },

    dismiss: function(level) {
      var override = this.overrideStyle.Dismiss || {};
      return merge({}, Styles.Dismiss.DefaultStyle, Styles.Dismiss[level], override.DefaultStyle, override[level]);
    },

    action: function(level) {
      var override = this.overrideStyle.Action || {};
      return merge({}, Styles.Action.DefaultStyle, Styles.Action[level], override.DefaultStyle, override[level]);
    },

    actionWrapper: function(level) {
      var override = this.overrideStyle.ActionWrapper || {};
      return merge({}, Styles.ActionWrapper.DefaultStyle, Styles.ActionWrapper[level], override.DefaultStyle, override[level]);
    },

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

  getDefaultProps: function() {
    return {
      overrideStyle: {}
    }
  },

  addNotification: function(notification) {
    var self = this;
    var notification = merge({}, Constants.notification, notification);
    var error = false;

    try {
      if (!notification.message) {
        throw "notification message is required."
      }

      if (!notification.level) {
        throw "notification level is required."
      }

      if (!Helpers.inArray(notification.position, Constants.positionsArray)) {
        throw "'"+ notification.position +"' is not a valid position."
      }

      if (!Helpers.inArray(notification.level, Constants.levelsArray)) {
        throw "'"+ notification.level +"' is not a valid level."
      }

      if (!notification.dismissible && !notification.action) {
        throw "You need to set notification dismissible to true or set an action, otherwise user will not be able to dismiss the notification."
      }

    } catch(err) {
      error = true;
      console.error('Error adding notification: '+err);
    }

    if (!error) {
      var notifications = this.state.notifications;

      notification.position = notification.position.toLowerCase();
      notification.level = notification.level.toLowerCase();

      notification.uid = this.uid;
      notification.ref = "notification-" + this.uid;
      this.uid += 1;

      notifications.push(notification);

      this.setState({
        notifications: notifications
      });
    }

  },

  componentDidMount: function() {
    this._getStyles.setOverrideStyle(this.props.overrideStyle);
  },

  render: function() {
    var self = this;
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = Constants.positionsArray.map(function(position) {

        var _notifications = notifications.filter(function(notification) {
          return position === notification.position;
        });

        if (_notifications.length) {
          return (
            <NotificationContainer
              key={position}
              position={position}
              notifications={_notifications}
              getStyles={self._getStyles}
              onRemove={self._didNotificationRemoved} />
          );
        }
      });
    }


    return (
      <div className="notifications-wrapper" style={this._getStyles.wrapper()}>
        {containers}
      </div>

    );
  }
});

module.exports = NotificationSystem;
