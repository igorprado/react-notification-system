var React = require('react');
var merge = require('object-assign');
var NotificationContainer = require('./notification-container');
var Constants = require('./constants');
var Styles = require('./styles');

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
      return merge({}, Styles.Wrapper, this.overrideStyle);
    },

    container: function(position) {
      var override = this.overrideStyle.Containers || {};
      if (!this.overrideStyle) return {};

      this.overrideWidth = Styles.Containers.DefaultStyle.width;

      if (override.DefaultStyle && override.DefaultStyle.width) {
        this.overrideWidth = override.DefaultStyle.width;
      }

      if (override[position] && override[position].width) {
        this.overrideWidth = override[position].width;
      }

      return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
    },

    elements: {
      notification: 'NotificationItem',
      title: 'Title',
      messageWrapper: 'MessageWrapper',
      dismiss: 'Dismiss',
      action: 'Action',
      actionWrapper: 'ActionWrapper'
    },

    byElement: function(element) {
      var self = this;
      return function(level) {
        var _element = self.elements[element];
        var override = self.overrideStyle[_element] || {};
        if (!self.overrideStyle) return {};
        return merge({}, Styles[_element].DefaultStyle, Styles[_element][level], override.DefaultStyle, override[level]);
      };
    }
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
    };
  },

  propTypes: {
    style: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.object
    ])
  },

  getDefaultProps: function() {
    return {
      style: {},
      noAnimation: false
    };
  },

  addNotification: function(notification) {
    var _notification = merge({}, Constants.notification, notification);
    var notifications = this.state.notifications;
    var error = false;
    var i;

    try {
      if (!_notification.level) {
        throw 'notification level is required.';
      }

      if (isNaN(_notification.autoDismiss)) {
        throw '\'autoDismiss\' must be a number.';
      }

      if (Object.keys(Constants.positions).indexOf(_notification.position) === -1) {
        throw '\'' + _notification.position + '\' is not a valid position.';
      }

      if (Object.keys(Constants.levels).indexOf(_notification.level) === -1) {
        throw '\'' + _notification.level + '\' is not a valid level.';
      }
    } catch (err) {
      error = true;
      console.error('Error adding notification: ' + err);
    }

    if (!error) {
      // Some preparations
      _notification.position = _notification.position.toLowerCase();
      _notification.level = _notification.level.toLowerCase();
      _notification.autoDismiss = parseInt(_notification.autoDismiss, 10);

      _notification.uid = _notification.uid || this.uid;
      _notification.ref = 'notification-' + _notification.uid;
      this.uid += 1;

      // do not add if the notification already exists based on supplied uid
      for (i = 0; i < notifications.length; i++) {
        if (notifications[i].uid === _notification.uid) {
          return false;
        }
      }

      notifications.push(_notification);

      this.setState({
        notifications: notifications
      });

      return _notification;
    }
  },

  removeNotification: function(notification) {
    var container = this.refs['container-' + notification.position];
    var _notification;

    if (container) {
      _notification = container.refs['notification-' + notification.uid];
      if (_notification) {
        _notification._hideNotification();
      }
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
              ref={ 'container-' + position }
              key={ position }
              position={ position }
              notifications={ _notifications }
              getStyles={ self._getStyles }
              onRemove={ self._didNotificationRemoved }
              noAnimation={ self.props.noAnimation }
              allowHTML={ self.props.allowHTML }
            />
          );
        }
      });
    }


    return (
      <div className='notifications-wrapper' style={ this._getStyles.wrapper() }>
        { containers }
      </div>

    );
  }
});

module.exports = NotificationSystem;
