var React = require('react');
var NotificationItem = require('./notification-item');
var Constants = require('./constants');

var NotificationContainer = React.createClass({displayName: "NotificationContainer",

  propTypes: {
    position: React.PropTypes.string.isRequired,
    notifications: React.PropTypes.array.isRequired
  },

  render: function() {
    var self = this;
    var notifications = this.props.notifications.map(function(notification) {
      return (
        React.createElement(NotificationItem, {
          key: notification.uid, 
          notification: notification, 
          getStyles: self.props.getStyles, 
          onRemove: self.props.onRemove}
        )
      );
    });

    // Fix positions if width is overrided
    var style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      style['marginLeft'] = -(this.props.getStyles.overrideWidth / 2);
    }

    return (
      React.createElement("div", {className: 'notifications-' + this.props.position, style: style}, 
        notifications
      )
    );
  }
});


module.exports = NotificationContainer;
