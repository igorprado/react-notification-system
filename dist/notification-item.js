var React = require('react');
var objectAssign = require('object-assign');
var Constants = require('./constants');
var Styles = require('./styles');
var Helpers = require('./helpers');

var NotificationItem = React.createClass({displayName: "NotificationItem",

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
    return {
      visible: false,
      removed: false,
    }
  },

  componentWillMount: function() {
    var getStyles = this.props.getStyles;
    var level = this.props.notification.level;

    this._styles = {
      notification: getStyles.notification(level),
      title: getStyles.title(level),
      dismiss: getStyles.dismiss(level),
      messageWrapper: getStyles.messageWrapper(level),
      actionWrapper: getStyles.actionWrapper(level),
      action: getStyles.action(level)
    };

    if (!this.props.notification.dismissible) {
      this._styles.notification.cursor = 'default';
    }
  },

  _styles: {},

  _notificationTimeout: null,

  _element: null,

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
    if (this._notificationTimeout) {
      clearTimeout(this._notificationTimeout);
    }

    this.setState({
      visible: false,
      removed: true
    });

    if (this.props.noAnimation) {
      this._removeNotification();
    }
  },

  _removeNotification: function() {
    this.props.calculateHeight('remove', Helpers.totalHeight(this._element));
    this.props.onRemove(this.props.notification.uid);
  },

  _dismiss: function() {
    if (!this.props.notification.dismissible) {
      return;
    }

    this._hideNotification();
  },

  _showNotification: function() {
    var self = this;
    setTimeout(function(){
      self.setState({
        visible: true,
      });
    }, 100);
  },

  componentDidMount: function() {
    var self = this;
		var transitionEvent = whichTransitionEvent();
    var notification = this.props.notification;

    this._element = React.findDOMNode(this);

    // Add element height to container to handle animations
    this.props.calculateHeight('add', Helpers.totalHeight(this._element));

    // Watch for transition end
    this._element.addEventListener(transitionEvent, function() {
      if(self.state.removed) {
        self._removeNotification();
			}
		});

    if (notification.autoDismiss) {
      this._notificationTimeout = setTimeout(function(){
        self._hideNotification();
      }, notification.autoDismiss * 1000);
    }

    this._showNotification();

  },

  render: function() {
    var self = this;
    var notification = this.props.notification;

    var className = 'notification notification-' + notification.level;

    if (this.state.visible) {
      className = className + ' notification-visible';
    } else {
      className = className + ' notification-hidden';
    }

    if (!notification.dismissible) {
      className = className + ' notification-not-dismissible';
    }

    if (this.props.getStyles.overrideStyle) {
      var property = this._getCssPropertyByPosition();
      this._styles.notification[property] = this.state.visible ? 0 : '-50%';
      this._styles.notification.opacity = this.state.visible ? 1 : 0;
    }

    this._styles.notification.top = this.props.topPosition;

    var dismiss = null;
    var actionButton = null;
    var title = null;
    var message = null;

    if (notification.title) {
      title = React.createElement("h4", {className: "notification-title", style: this._styles.title}, notification.title)
    }

    if (notification.message) {
      message = (
        React.createElement("div", {className: "notification-message", style: this._styles.messageWrapper}, 
          notification.message
        )
      );
    }

    if (notification.dismissible) {
      dismiss = React.createElement("span", {className: "notification-dismiss", style: this._styles.dismiss}, "×");
    }

    if (notification.action) {
      actionButton = (
        React.createElement("div", {className: "notification-action-wrapper", style: this._styles.actionWrapper}, 
          React.createElement("button", {className: "notification-action-button", onClick: this._defaultAction, style: this._styles.action}, notification.action.label)
        )
      );
    }

    return (
      React.createElement("div", {className: className, onClick: this._dismiss, style: this._styles.notification}, 
        title, 
        message, 
        dismiss, 
        actionButton
      )
    );
  }

});

/* From Modernizr */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}


module.exports = NotificationItem;
