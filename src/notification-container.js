var React = require('react');
var NotificationItem = require('./notification-item');
var Constants = require('./constants');

var NotificationContainer = React.createClass({

  propTypes: {
    position: React.PropTypes.string.isRequired,
    notifications: React.PropTypes.array.isRequired
  },

  _style: {},

  componentWillMount: function() {
    // Fix position if width is overrided
    this._style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      this._style['marginLeft'] = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  render: function() {
    var self = this;

    if ([Constants.positions.bl, Constants.positions.br, Constants.positions.bc].indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    var notifications = this.props.notifications.map(function(notification) {
      return (
        <NotificationItem
          key={notification.uid}
          notification={notification}
          getStyles={self.props.getStyles}
          onRemove={self.props.onRemove}
          noAnimation={self.props.noAnimation}
          allowHTML={self.props.allowHTML}
        />
      );
    });

    return (
      <div className={'notifications-' + this.props.position} style={this._style}>
        {notifications}
      </div>
    );
  }
});


module.exports = NotificationContainer;
