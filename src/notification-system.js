var React = require('react');
var merge = require('object-assign');
var NotificationContainer = require('./notification-container');
var Constants = require('./constants');
var Styles = require('./styles');
var Helpers = require('./helpers');

var NotificationSystem = React.createClass({

  uid: 3400,

  _getStyles: {
    overrideStyle: {},

    overrideWidth: null,

    setOverrideStyle: function(style) {
      this.overrideStyle = style;
    },

    wrapper: function() {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.Wrapper || {};
      return merge({}, Styles.Wrapper, this.overrideStyle);
    },

    container: function(position) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.Containers || {};

      this.overrideWidth = Styles.Containers.DefaultStyle.width;

      if (override.DefaultStyle && override.DefaultStyle.width) {
        this.overrideWidth = override.DefaultStyle.width;
      }

      if (override[position] && override[position].width) {
        this.overrideWidth = override[position].width;
      }

      return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
    },

    notification: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.NotificationItem || {};
      return merge({}, Styles.NotificationItem.DefaultStyle, Styles.NotificationItem[level], override.DefaultStyle, override[level]);
    },

    title: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.Title || {};
      return merge({}, Styles.Title.DefaultStyle, Styles.Title[level], override.DefaultStyle, override[level]);
    },

    messageWrapper: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.MessageWrapper || {};
      return merge({}, Styles.MessageWrapper.DefaultStyle, Styles.MessageWrapper[level], override.DefaultStyle, override[level]);
    },

    dismiss: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.Dismiss || {};
      return merge({}, Styles.Dismiss.DefaultStyle, Styles.Dismiss[level], override.DefaultStyle, override[level]);
    },

    action: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.Action || {};
      return merge({}, Styles.Action.DefaultStyle, Styles.Action[level], override.DefaultStyle, override[level]);
    },

    actionWrapper: function(level) {
      if (!this.overrideStyle) return {};
      var override = this.overrideStyle.ActionWrapper || {};
      return merge({}, Styles.ActionWrapper.DefaultStyle, Styles.ActionWrapper[level], override.DefaultStyle, override[level]);
    },

  },

  _didNotificationRemoved: function(uid) {
    var notification;
    var notifications = this.state.notifications.filter(function(toCheck) {
      if (toCheck.uid === uid) {
        notification = toCheck;
      }
			return toCheck.uid !== uid;
	  });

	  if (notification && notification.onRemove) {
      notification.onRemove(notification);
    }

    this.setState({ notifications: notifications });
  },

  getInitialState: function() {
    return {
      notifications: []
    }
  },

  getDefaultProps: function() {
    return {
      style: {},
      noAnimation: false
    }
  },

  addNotification: function(notification) {
    var self = this;
    var notification = merge({}, Constants.notification, notification);

    var error = false;

    try {
      if (!notification.level) {
        throw "notification level is required."
      }

      if (isNaN(notification.autoDismiss)) {
        throw "'autoDismiss' must be a number."
      }

      if (!Helpers.inArray(notification.position, Object.keys(Constants.positions))) {
        throw "'"+ notification.position +"' is not a valid position."
      }

      if (!Helpers.inArray(notification.level, Object.keys(Constants.levels))) {
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

      // Some preparations
      notification.position = notification.position.toLowerCase();
      notification.level = notification.level.toLowerCase();
      notification.autoDismiss = parseInt(notification.autoDismiss);

      notification.uid = notification.uid || this.uid;
      notification.ref = "notification-" + notification.uid;
      this.uid += 1;

      // do not add if the notification already exists
      for (var nI = 0; nI < notifications.length; nI++) {
        if (notifications[nI].uid === notification.uid) return;
      }

      notifications.push(notification);

      this.setState({
        notifications: notifications
      });
    }

  },

  componentDidMount: function() {
    this._getStyles.setOverrideStyle(this.props.style);
  },

  render: function() {
    var self = this;
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = Object.keys(Constants.positions).map(function(position) {

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
              onRemove={self._didNotificationRemoved}
              noAnimation={self.props.noAnimation}
              allowHTML={self.props.allowHTML}
            />
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
