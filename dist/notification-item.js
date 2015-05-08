var React = require('react');
var tweenState = require('react-tween-state');
var objectAssign = require('object-assign');
var Constants = require('./constants');
var Styles = require('./styles');

var NotificationItem = React.createClass({displayName: "NotificationItem",

  mixins: [tweenState.Mixin],

  propTypes: {
    notification: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      onRemove: function(uid) {}
    }
  },

  getInitialState: function() {
    var state = {};

    var prop = this._getCssPropertyByPosition();

    state[prop] = -(Styles.Containers.DefaultStyle.width);
    state.opacity = 0;

    return state;
  },

  _notificationInterval: null,

  _getCssPropertyByPosition: function() {
    var position = this.props.notification.position;
    var cssProperty;

    switch (position) {
      case Constants.positions.tl:
      case Constants.positions.bl:
        cssProperty = 'left';
        break;

      case Constants.positions.tr:
      case Constants.positions.br:
        cssProperty = 'right';
        break;

      case Constants.positions.tc:
        cssProperty = 'top';
        break;

      case Constants.positions.bc:
        cssProperty = 'bottom';
        break;
    }

    return cssProperty;
  },

  _defaultAction: function(event) {
    event.preventDefault();
    var notification = this.props.notification;
    this._hideNotification();
    notification.action.callback();
  },

  _hideNotification: function() {
    var self = this;
    var notification = this.props.notification;
    var property = this._getCssPropertyByPosition();

    if (this._notificationInterval) {
      clearInterval(this._notificationInterval);
    }

    this.tweenState(property, {
      easing: tweenState.easingTypes.easeInOut,
      duration: Constants.animations.notificationItem.hide,
      endValue: -(Styles.Containers.DefaultStyle.width),
      onEnd: function() {
        self.props.onRemove(notification.uid)
      }
    });
  },

  _dismiss: function() {
    if (!this.props.notification.dismissible) {
      return;
    }

    this._hideNotification();
  },

  _showNotification: function() {
    var property = this._getCssPropertyByPosition();

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.easeInOut,
      duration: Constants.animations.notificationItem.show,
      endValue: 1
    });

    this.tweenState(property, {
      easing: tweenState.easingTypes.easeInOut,
      duration: Constants.animations.notificationItem.show,
      endValue: 0
    });


  },

  componentDidMount: function() {
    var self = this;
    var notification = this.props.notification;

    if (notification.autoDismiss) {
      this._notificationInterval = setInterval(function(){
        self._hideNotification();
      }, notification.autoDismiss * 1000);
    }

    this._showNotification();

  },

  render: function() {
    var self = this;
    var notification = this.props.notification;
    var getStyles = this.props.getStyles;

    var style = getStyles.notification(notification.level);
    var property = this._getCssPropertyByPosition();

    style[property] = this.getTweeningValue(property);
    style.opacity = this.getTweeningValue('opacity');

    var dismiss = null;
    var actionButton = null;

    if (notification.dismissible) {
      dismiss = React.createElement("span", {className: "notification-close", style: getStyles.dismiss(notification.level)}, "×");
    }

    if (notification.action) {
      actionButton = (
        React.createElement("div", {className: "notification-action-wrapper", style: getStyles.actionWrapper(notification.level)}, 
          React.createElement("button", {className: "notification-action-button", onClick: this._defaultAction, style: getStyles.action(notification.level)}, notification.action.label)
        )
      );
    }

    return (
      React.createElement("div", {className: 'notifications notification-' + notification.level, onClick: this._dismiss, style: style}, 
        notification.message, 
        dismiss, 
        actionButton
      )
    );
  }

});


module.exports = NotificationItem;
