var React = require('react');
var NotificationItem = require('./notification-item');
var Constants = require('./constants');
var Helpers = require('./helpers');

var NotificationContainer = React.createClass({displayName: "NotificationContainer",

  propTypes: {
    position: React.PropTypes.string.isRequired,
    notifications: React.PropTypes.array.isRequired
  },

  _style: {},

  _height: 0,

  _calculateHeight: function(type, height) {
    this._height = (type === 'add') ? this._height + height : this._height - height;
  },

  componentWillMount: function() {
    // Fix position if width is overrided
    this._style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      this._style['marginLeft'] = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  render: function() {
    var self = this;

    if (Helpers.inArray(this.props.position, [Constants.positions.tl, Constants.positions.tr, Constants.positions.tc])) {
      this.props.notifications.reverse();
    }

    console.log(this._height);

    var notifications = this.props.notifications.map(function(notification) {
      var _notification = (
        React.createElement(NotificationItem, {
          key: notification.uid, 
          notification: notification, 
          getStyles: self.props.getStyles, 
          onRemove: self.props.onRemove, 
          noAnimation: self.props.noAnimation, 
          calculateHeight: self._calculateHeight, 
          topPosition: notification.topPosition}
        )
      );

      return _notification;
    });

    return (
      React.createElement("div", {className: 'notifications-' + this.props.position, style: this._style}, 
        notifications
      )
    );
  }
});


module.exports = NotificationContainer;
