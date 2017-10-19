var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var NotificationItem = require('./NotificationItem');
var Constants = require('./constants');
var classnames = require('classnames');

var NotificationContainer = createReactClass({

  propTypes: {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    getStyles: PropTypes.object
  },

  _style: {},

  componentWillMount: function() {
    // Fix position if width is overrided
    this._style = this.props.getStyles.container(this.props.position);

    if (this.props.getStyles.overrideWidth && (this.props.position === Constants.positions.tc || this.props.position === Constants.positions.bc)) {
      this._style.marginLeft = -(this.props.getStyles.overrideWidth / 2);
    }
  },

  render: function() {
    var self = this;
    var notifications;
    var classNameContainer = this.props.classNameContainer;

    var classNameSelector = classnames(
      'notification-container',
      'notifications-' + this.props.position, {
        [classNameContainer]: !!classNameContainer
      }
    );

    if ([Constants.positions.bl, Constants.positions.br, Constants.positions.bc].indexOf(this.props.position) > -1) {
      this.props.notifications.reverse();
    }

    notifications = this.props.notifications.map(notification => (
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
    ));

    return (
      <div className={ classNameSelector } style={ this._style }>
        { notifications }
      </div>
    );
  }
});


module.exports = NotificationContainer;
