var React = require('react');
var objectAssign = require('object-assign');
var Constants = require('./constants');
var Styles = require('./styles');
var Helpers = require('./helpers');

var NotificationItem = React.createClass({

  propTypes: {
    notification: React.PropTypes.object,
    onRemove: React.PropTypes.func,
    allowHTML: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      noAnimation: false,
      onRemove: function(uid) {},
      allowHTML: false
    };
  },

  getInitialState: function() {
    return {
      visible: false,
      removed: false,
    };
  },

  componentWillMount: function() {
    var getStyles = this.props.getStyles;
    var level = this.props.notification.level;

    this._noAnimation = this.props.noAnimation;

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

  _notificationTimer: null,

  _height: 0,

  _noAnimation: null,

  _getCssPropertyByPosition: function() {
    var position = this.props.notification.position;
    var css = {};

    switch (position) {
      case Constants.positions.tl:
      case Constants.positions.bl:
        css = {
          property: 'left',
          value: -200
        };
        break;

      case Constants.positions.tr:
      case Constants.positions.br:
        css = {
          property: 'right',
          value: -200
        };
        break;

      case Constants.positions.tc:
        css = {
          property: 'top',
          value: -100
        };
        break;

      case Constants.positions.bc:
        css = {
          property: 'bottom',
          value: -100
        };
        break;
    }

    return css;
  },

  _defaultAction: function(event) {
    event.preventDefault();
    var notification = this.props.notification;
    this._hideNotification();
    notification.action.callback();
  },

  _hideNotification: function() {
    if (this._notificationTimer) {
      this._notificationTimer.clear();
    }

    if (this.isMounted()) {
      this.setState({
        visible: false,
        removed: true
      });
    }

    if (this._noAnimation) {
      this._removeNotification();
    }
  },

  _removeNotification: function() {
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
    }, 50);
  },

  componentDidMount: function() {
    var self = this;
		var transitionEvent = whichTransitionEvent();
    var notification = this.props.notification;

    var element = React.findDOMNode(this);

    this._height = element.offsetHeight;

    // Watch for transition end
    var count = 0;

    if (!this._noAnimation) {
      if (transitionEvent) {
        element.addEventListener(transitionEvent, function() {
          if (count > 0) return;
          if(self.state.removed) {
            count++;
            self._removeNotification();
          }
        });
      } else {
        this._noAnimation = true;
      }
    }


    if (notification.autoDismiss) {
      this._notificationTimer = new Helpers.timer(function(){
        self._hideNotification();
      }, notification.autoDismiss * 1000);

      element.addEventListener('mouseenter', function() {
        self._notificationTimer.pause();
      });

      element.addEventListener('mouseleave', function() {
        self._notificationTimer.resume();
      });
    }

    this._showNotification();

  },

  _allowHTML: function(string) {
    if (true) {
      return {__html: string};
    }

    return string;
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
      var cssByPos = this._getCssPropertyByPosition();
      if (!this.state.visible && !this.state.removed) {
        this._styles.notification[cssByPos.property] = cssByPos.value;
      }

      if (this.state.visible && !this.state.removed) {
        this._styles.notification.height = this._height;
        this._styles.notification[cssByPos.property] = 0;
      }

      if (this.state.removed) {
        this._styles.notification.overlay = 'hidden';
        this._styles.notification.height = 0;
        this._styles.notification.marginTop = 0;
        this._styles.notification.paddingTop = 0;
        this._styles.notification.paddingBottom = 0;
      }
      this._styles.notification.opacity = this.state.visible ? this._styles.notification.isVisible.opacity : this._styles.notification.isHidden.opacity;
    }

    var dismiss = null;
    var actionButton = null;
    var title = null;
    var message = null;

    if (notification.title) {
      title = <h4 className="notification-title" style={this._styles.title}>{notification.title}</h4>;
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          <div className="notification-message" style={this._styles.messageWrapper} dangerouslySetInnerHTML={this._allowHTML(notification.message)}></div>
        );
      } else {
        message = (
          <div className="notification-message" style={this._styles.messageWrapper}>{notification.message}</div>
        );
      }
    }

    if (notification.dismissible) {
      dismiss = <span className="notification-dismiss" style={this._styles.dismiss}>&times;</span>;
    }

    if (notification.action) {
      actionButton = (
        <div className="notification-action-wrapper" style={this._styles.actionWrapper}>
          <button className="notification-action-button" onClick={this._defaultAction} style={this._styles.action}>{notification.action.label}</button>
        </div>
      );
    }

    return (
      <div className={className} onClick={this._dismiss} style={this._styles.notification}>
        {title}
        {message}
        {dismiss}
        {actionButton}
      </div>
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
    };

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}


module.exports = NotificationItem;
