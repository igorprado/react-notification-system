var React = require('react');
var NotificationItem = require('./notification-item');

var NotificationContainer = React.createClass({
  render: function() {
    var self = this;
    var notifications = this.props.notifications.map(function(notification) {
      return (
        <NotificationItem
          key={notification.uid}
          notification={notification}
          style={self.props.notificationStyle(notification.level)}
          dismissStyle={self.props.dismissStyle}
          actionStyle={self.props.actionStyle}
          onRemove={self.props.onRemove}
        />
      );
    });

    return (
      <div className={'notifications-' + this.props.position} style={this.props.style}>
        {notifications}
      </div>
    );
  }
});


module.exports = NotificationContainer;
