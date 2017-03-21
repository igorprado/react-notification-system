var React = require('react');
var merge = require('object-assign');
var NotificationContainer = require('./NotificationContainer');
var Constants = require('./constants');
var Styles = require('./styles');

var NotificationSystem = React.createClass({

  uid: 3400,

  _isMounted: false,

  getStyles: {
    overrideStyle: {},

    overrideWidth: null,

    setOverrideStyle: function setOverrideStyle(style) {
      this.overrideStyle = style;
    },

    wrapper: function wrapper() {
      if (!this.overrideStyle) return {};
      return merge({}, Styles.Wrapper, this.overrideStyle.Wrapper);
    },

    container: function container(position) {
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

    byElement: function byElement(element) {
      var self = this;
      return function byElementReturn(level) {
        var elementFromMap = self.elements[element];
        var override = self.overrideStyle[elementFromMap] || {};
        if (!self.overrideStyle) return {};
        return merge({}, Styles[elementFromMap].DefaultStyle, Styles[elementFromMap][level], override.DefaultStyle, override[level]);
      };
    }
  },

  didNotificationRemoved: function didNotificationRemoved(uid) {
    var notification;
    var notifications = this.state.notifications.filter(function filterCallback(toCheck) {
      if (toCheck.uid === uid) {
        notification = toCheck;
      }
      return toCheck.uid !== uid;
    });

    if (notification && notification.onRemove) {
      notification.onRemove(notification);
    }

    if (this._isMounted) {
      this.setState({ notifications: notifications });
    }
  },

  getInitialState: function getInitialState() {
    return {
      notifications: []
    };
  },

  propTypes: {
    style: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.object
    ]),
    noAnimation: React.PropTypes.bool,
    allowHTML: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      style: {},
      noAnimation: false,
      allowHTML: false
    };
  },

  addNotification: function addNotification(notification) {
    var notificationToBeAdded = merge({}, Constants.notification, notification);
    var notifications = this.state.notifications;
    var i;

    if (!notificationToBeAdded.level) {
      throw new Error('notification level is required.');
    }

    if (Object.keys(Constants.levels).indexOf(notificationToBeAdded.level) === -1) {
      throw new Error('\'' + notificationToBeAdded.level + '\' is not a valid level.');
    }

    if (isNaN(notificationToBeAdded.autoDismiss)) {
      throw new Error('\'autoDismiss\' must be a number.');
    }

    if (Object.keys(Constants.positions).indexOf(notificationToBeAdded.position) === -1) {
      throw new Error('\'' + notificationToBeAdded.position + '\' is not a valid position.');
    }

    // Some preparations
    notificationToBeAdded.position = notificationToBeAdded.position.toLowerCase();
    notificationToBeAdded.level = notificationToBeAdded.level.toLowerCase();
    notificationToBeAdded.autoDismiss = parseInt(notificationToBeAdded.autoDismiss, 10);

    notificationToBeAdded.uid = notificationToBeAdded.uid || this.uid;
    notificationToBeAdded.ref = 'notification-' + notificationToBeAdded.uid;
    this.uid += 1;

    // do not add if the notification already exists based on supplied uid
    for (i = 0; i < notifications.length; i += 1) {
      if (notifications[i].uid === notificationToBeAdded.uid) {
        return false;
      }
    }

    notifications.push(notificationToBeAdded);

    if (typeof notificationToBeAdded.onAdd === 'function') {
      notification.onAdd(notificationToBeAdded);
    }

    this.setState({
      notifications: notifications
    });

    return notificationToBeAdded;
  },

  removeNotification: function removeNotification(notificationToBeRemoved) {
    var self = this;
    Object.keys(this.refs).forEach(function forEachCallback(container) {
      if (container.indexOf('container') > -1) {
        Object.keys(self.refs[container].refs).forEach(function forEachCallback2(notification) {
          var uid = notificationToBeRemoved.uid ? notificationToBeRemoved.uid : notificationToBeRemoved;
          if (notification === 'notification-' + uid) {
            self.refs[container].refs[notification].hideNotification();
          }
        });
      }
    });
  },

  clearNotifications: function clearNotifications() {
    var self = this;
    Object.keys(this.refs).forEach(function forEachCallback(container) {
      if (container.indexOf('container') > -1) {
        Object.keys(self.refs[container].refs).forEach(function forEachCallback2(notification) {
          self.refs[container].refs[notification].hideNotification();
        });
      }
    });
  },

  componentDidMount: function componentDidMount() {
    this.getStyles.setOverrideStyle(this.props.style);
    this._isMounted = true;
  },

  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
  },

  render: function render() {
    var self = this;
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = Object.keys(Constants.positions).map(function mapCallback(position) {
        var notificationsFiltered = notifications.filter(function filterCallback(notification) {
          return position === notification.position;
        });

        if (!notificationsFiltered.length) {
          return null;
        }

        return (
          <NotificationContainer
            ref={ 'container-' + position }
            key={ position }
            position={ position }
            notifications={ notificationsFiltered }
            getStyles={ self.getStyles }
            onRemove={ self.didNotificationRemoved }
            noAnimation={ self.props.noAnimation }
            allowHTML={ self.props.allowHTML }
          />
        );
      });
    }


    return (
      <div className="notifications-wrapper" style={ this.getStyles.wrapper() }>
        { containers }
      </div>

    );
  }
});

module.exports = NotificationSystem;
