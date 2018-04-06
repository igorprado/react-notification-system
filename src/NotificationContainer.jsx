var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var NotificationItem = require('./NotificationItem');
var Constants = require('./constants');

var NotificationContainer = createReactClass({

  propTypes: {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    getStyles: PropTypes.object,

    renderContainer: PropTypes.func,
    renderItem: PropTypes.func,

    containerClassName: PropTypes.string,
    itemClassName: PropTypes.string
  },

  _style: {},

  componentWillMount: function() {
    // Fix position if width is overridden
    this._style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      this._style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  _renderDefault: function(notifications) {
    return (
      <div className={ 'notifications-' + this.props.position + ' ' + this.props.containerClassName } style={ this._style }>
        { notifications }
      </div>
    )
  },

  render: function() {
    var self = this;
    var notifications;

    if ([Constants.positions.bl, Constants.positions.br, Constants.positions.bc].indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    notifications = this.props.notifications.map(function(notification) {
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
          renderItem={ self.props.renderItem }
          itemClassName={ self.props.itemClassName }
        />
      );
    });

    return (this.props.renderContainer || this._renderDefault)(notifications);
  }
});


module.exports = NotificationContainer;
