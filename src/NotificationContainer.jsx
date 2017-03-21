var React = require('react');
var NotificationItem = require('./NotificationItem');
var Constants = require('./constants');

var NotificationContainer = React.createClass({

  propTypes: {
    position: React.PropTypes.string.isRequired,
    notifications: React.PropTypes.array.isRequired,
    getStyles: React.PropTypes.object
  },

  style: {},

  componentWillMount: function componentWillMount() {
    // Fix position if width is overrided
    this.style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth &&
        (this.props.position === Constants.positions.tc ||
          this.props.position === Constants.positions.bc)) {
      this.style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  render: function render() {
    var self = this;
    var notifications;
    var reversePositions = [Constants.positions.bl, Constants.positions.br, Constants.positions.bc];

    if (reversePositions.indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    notifications = this.props.notifications.map(function mapNotifications(notification) {
      return (
        <NotificationItem
          ref={ 'notification-' + notification.uid }
          key={ notification.uid }
          notification={ notification }
          getStyles={ self.props.getStyles }
          onRemove={ self.props.onRemove }
          noAnimation={ self.props.noAnimation }
          allowHTML={ self.props.allowHTML }
          children={ self.props.children }
        />
      );
    });

    return (
      <div className={ 'notifications-' + this.props.position } style={ this.style }>
        { notifications }
      </div>
    );
  }
});


module.exports = NotificationContainer;
