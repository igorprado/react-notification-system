var React = require('react');
var tweenState = require('react-tween-state');
var objectAssign = require('object-assign');

var NotificationItem = React.createClass({

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

    state[prop] = -280;
    state.opacity = 0;

    return state;
  },

  _getCssPropertyByPosition: function() {
    var side = this.props.notification.position.slice(1, 2);
    var cssProperty;

    switch (side) {
      case 'l':
        cssProperty = 'left';
        break;

      case 'r':
        cssProperty = 'right';
        break;
    }

    return cssProperty;
  },

  _defaultAction: function(event) {
    var notification = this.props.notification;
    // event.preventDefault();
    alert('Default action');
    if (notification.action) {
      notification.action.callback();
    }

  },

  _hideNotification: function() {
    var self = this;
    var notification = this.props.notification;
    var property = this._getCssPropertyByPosition();

    this.tweenState(property, {
      easing: tweenState.easingTypes.easeInOut,
      duration: 100,
      endValue: -280,
      onEnd: function() {
        self.props.onRemove(notification.uid)
      }
    });


  },

  _showNotification: function() {
    var property = this._getCssPropertyByPosition();

    this.tweenState('opacity', {
      easing: tweenState.easingTypes.easeInOut,
      duration: 600,
      endValue: 1
    });

    this.tweenState(property, {
      easing: tweenState.easingTypes.easeInOut,
      duration: 200,
      endValue: 0
    });


  },

  componentDidMount: function() {
    var self = this;
    var notification = this.props.notification;

    if (notification.autoDismiss) {
      setTimeout(function(){
        self._hideNotification();
      }, notification.autoDismissDelay);
    }

    this._showNotification();

  },

  render: function() {
    var self = this;
    var notification = this.props.notification;

    var style = this.props.style;
    var property = this._getCssPropertyByPosition();

    style[property] = this.getTweeningValue(property);
    style.opacity = this.getTweeningValue('opacity');

    var dismiss = null;
    var actionButton = null;

    if (notification.dismissible) {
      dismiss = <span className="notification-close" style={this.props.dismissStyle(notification.level)}>&times;</span>;
    }

    if (notification.action) {
      actionButton = (
        <div>
          <button className="notification-action" onClick={this._defaultAction} style={this.props.actionStyle(notification.level)}>{notification.action.label}</button>
        </div>
      );
    }

    return (
      <div className={'notifications notification-' + notification.level} onClick={this._defaultAction} style={style}>
        {notification.message}
        {dismiss}
        {actionButton}
      </div>
    );
  }

});


module.exports = NotificationItem;
