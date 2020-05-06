var React = require('react');
var PropTypes = require('prop-types');
var merge = require('object-assign');
var NotificationContainer = require('./NotificationContainer');
var Constants = require('./constants');
var Styles = require('./styles');

class NotificationSystem extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: []
    };
    this.uid = 3400;
    this._isMounted = false;
    this.overrideWidth = null;
    this.overrideStyle = {};
    this.elements = {
      notification: 'NotificationItem',
      title: 'Title',
      messageWrapper: 'MessageWrapper',
      dismiss: 'Dismiss',
      action: 'Action',
      actionWrapper: 'ActionWrapper'
    };

    this.setOverrideStyle = this.setOverrideStyle.bind(this);
    this.wrapper = this.wrapper.bind(this);
    this.container = this.container.bind(this);
    this.byElement = this.byElement.bind(this);
    this._didNotificationRemoved = this._didNotificationRemoved.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.getNotificationRef = this.getNotificationRef.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.editNotification = this.editNotification.bind(this);
    this.clearNotifications = this.clearNotifications.bind(this);

    this._getStyles = {
      overrideWidth: this.overrideWidth,
      overrideStyle: this.overrideStyle,
      elements: this.elements,
      setOverrideStyle: this.setOverrideStyle,
      wrapper: this.wrapper,
      container: this.container,
      byElement: this.byElement
    };
  }

  componentDidMount() {
    this.setOverrideStyle(this.props.style);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setOverrideStyle(style) {
    this.overrideStyle = style;
  }

  wrapper() {
    if (!this.overrideStyle) return {};
    return merge({}, Styles.Wrapper, this.overrideStyle.Wrapper);
  }

  container(position) {
    var override = this.overrideStyle.Containers || {};
    if (!this.overrideStyle) return {};

    this.overrideWidth = Styles.Containers.DefaultStyle.width;

    if (override.DefaultStyle && override.DefaultStyle.width) {
      this.overrideWidth = override.DefaultStyle.width;
    }

    if (override[position] && override[position].width) {
      this.overrideWidth = override[position].width;
    }

    return merge(
      {},
      Styles.Containers.DefaultStyle,
      Styles.Containers[position],
      override.DefaultStyle,
      override[position]
    );
  }

  byElement(element) {
    return (level) => {
      var _element = this.elements[element];
      var override = this.overrideStyle[_element] || {};
      if (!this.overrideStyle) return {};
      return merge(
        {},
        Styles[_element].DefaultStyle,
        Styles[_element][level],
        override.DefaultStyle,
        override[level]
      );
    };
  }

  _didNotificationRemoved(uid) {
    var notification;
    var notifications = this.state.notifications.filter(function(toCheck) {
      if (toCheck.uid === uid) {
        notification = toCheck;
        return false;
      }
      return true;
    });

    if (this._isMounted) {
      this.setState({ notifications: notifications });
    }

    if (notification && notification.onRemove) {
      notification.onRemove(notification);
    }
  }

  addNotification(notification) {
    var _notification = merge({}, Constants.notification, notification);
    var notifications = this.state.notifications;
    var i;


    if (!_notification.level) {
      throw new Error('notification level is required.');
    }

    if (Object.keys(Constants.levels).indexOf(_notification.level) === -1) {
      throw new Error("'" + _notification.level + "' is not a valid level.");
    }

    // eslint-disable-next-line
    if (isNaN(_notification.autoDismiss)) {
      throw new Error("'autoDismiss' must be a number.");
    }

    if (
      Object.keys(Constants.positions).indexOf(_notification.position) === -1
    ) {
      throw new Error("'" + _notification.position + "' is not a valid position.");
    }

    // Some preparations
    _notification.position = _notification.position.toLowerCase();
    _notification.level = _notification.level.toLowerCase();
    _notification.autoDismiss = parseInt(_notification.autoDismiss, 10);

    _notification.uid = _notification.uid || this.uid;
    _notification.ref = 'notification-' + _notification.uid;
    this.uid += 1;


    // do not add if the notification already exists based on supplied uid
    for (i = 0; i < notifications.length; i += 1) {
      if (notifications[i].uid === _notification.uid) {
        return false;
      }
    }

    if (this.props.newOnTop) {
      notifications.unshift(_notification);
    } else {
      notifications.push(_notification);
    }


    if (typeof _notification.onAdd === 'function') {
      notification.onAdd(_notification);
    }

    this.setState({
      notifications: notifications
    });

    return _notification;
  }

  getNotificationRef(notification) {
    var foundNotification = null;

    Object.keys(this.refs).forEach((container) => {
      if (container.indexOf('container') > -1) {
        Object.keys(this.refs[container].refs).forEach((_notification) => {
          var uid = notification.uid ? notification.uid : notification;
          if (_notification === 'notification-' + uid) {
            // NOTE: Stop iterating further and return the found notification.
            // Since UIDs are uniques and there won't be another notification found.
            foundNotification = this.refs[container].refs[_notification];
          }
        });
      }
    });

    return foundNotification;
  }

  removeNotification(notification) {
    var foundNotification = this.getNotificationRef(notification);
    return foundNotification && foundNotification._hideNotification();
  }

  editNotification(notification, newNotification) {
    var foundNotification = null;
    // NOTE: Find state notification to update by using
    // `setState` and forcing React to re-render the component.
    var uid = notification.uid ? notification.uid : notification;

    var newNotifications = this.state.notifications.filter(function(stateNotification) {
      if (uid === stateNotification.uid) {
        foundNotification = stateNotification;
        return false;
      }

      return true;
    });

    if (!foundNotification) {
      return;
    }

    newNotifications.push(merge({}, foundNotification, newNotification));

    this.setState({
      notifications: newNotifications
    });
  }

  clearNotifications() {
    Object.keys(this.refs).forEach((container) => {
      if (container.indexOf('container') > -1) {
        Object.keys(this.refs[container].refs).forEach((_notification) => {
          this.refs[container].refs[_notification]._hideNotification();
        });
      }
    });
  }

  render() {
    var containers = null;
    var notifications = this.state.notifications;

    if (notifications.length) {
      containers = Object.keys(Constants.positions).map((position) => {
        var _notifications = notifications.filter((notification) => {
          return position === notification.position;
        });

        if (!_notifications.length) {
          return null;
        }

        return (
          <NotificationContainer
            ref={ 'container-' + position }
            key={ position }
            position={ position }
            notifications={ _notifications }
            getStyles={ this._getStyles }
            onRemove={ this._didNotificationRemoved }
            noAnimation={ this.props.noAnimation }
            allowHTML={ this.props.allowHTML }
          />
        );
      });
    }

    return (
      <div className="notifications-wrapper" style={ this.wrapper() }>
        {containers}
      </div>
    );
  }
}

NotificationSystem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  noAnimation: PropTypes.bool,
  allowHTML: PropTypes.bool,
  newOnTop: PropTypes.bool
};

NotificationSystem.defaultProps = {
  style: {},
  noAnimation: false,
  allowHTML: false,
  newOnTop: false
};

module.exports = NotificationSystem;
