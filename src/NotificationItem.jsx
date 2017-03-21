var React = require('react');
var ReactDOM = require('react-dom');
var Constants = require('./constants');
var Helpers = require('./helpers');
var merge = require('object-assign');
var classnames = require('classnames');

/* From Modernizr */
var whichTransitionEvent = function whichTransitionEvent() {
  var el = document.createElement('fakeelement');
  var transition;
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  Object.keys(transitions).forEach(function transitionsForEach(transitionKey) {
    if (el.style[transitionKey] !== undefined) {
      transition = transitions[transitionKey];
    }
  });

  return transition;
};

var NotificationItem = React.createClass({

  propTypes: {
    notification: React.PropTypes.object,
    getStyles: React.PropTypes.object,
    onRemove: React.PropTypes.func,
    allowHTML: React.PropTypes.bool,
    noAnimation: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      noAnimation: false,
      onRemove: function onRemove() {},
      allowHTML: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      visible: undefined,
      removed: false
    };
  },

  componentWillMount: function componentWillMount() {
    var getStyles = this.props.getStyles;
    var level = this.props.notification.level;

    this.noAnimation = this.props.noAnimation;

    this.styles = {
      notification: getStyles.byElement('notification')(level),
      title: getStyles.byElement('title')(level),
      dismiss: getStyles.byElement('dismiss')(level),
      messageWrapper: getStyles.byElement('messageWrapper')(level),
      actionWrapper: getStyles.byElement('actionWrapper')(level),
      action: getStyles.byElement('action')(level)
    };

    if (!this.props.notification.dismissible) {
      this.styles.notification.cursor = 'default';
    }
  },

  styles: {},

  notificationTimer: null,

  height: 0,

  noAnimation: null,

  _isMounted: false,

  removeCount: 0,

  getCssPropertyByPosition: function getCssPropertyByPosition() {
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

      default:
    }

    return css;
  },

  defaultAction: function defaultAction(event) {
    var notification = this.props.notification;

    event.preventDefault();
    this.hideNotification();
    if (typeof notification.action.callback === 'function') {
      notification.action.callback();
    }
  },

  hideNotification: function hideNotification() {
    if (this.notificationTimer) {
      this.notificationTimer.clear();
    }

    if (this._isMounted) {
      this.setState({
        visible: false,
        removed: true
      });
    }

    if (this.noAnimation) {
      this.removeNotification();
    }
  },

  removeNotification: function removeNotification() {
    this.props.onRemove(this.props.notification.uid);
  },

  dismiss: function dismiss() {
    if (!this.props.notification.dismissible) {
      return;
    }

    this.hideNotification();
  },

  showNotification: function showNotification() {
    var self = this;
    setTimeout(function showNotificationTimeout() {
      if (self._isMounted) {
        self.setState({
          visible: true
        });
      }
    }, 50);
  },

  onTransitionEnd: function onTransitionEnd() {
    if (this.removeCount > 0) return;
    if (this.state.removed) {
      this.removeCount += 1;
      this.removeNotification();
    }
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    var transitionEvent = whichTransitionEvent();
    var notification = this.props.notification;
    var element = ReactDOM.findDOMNode(this);

    this.height = element.offsetHeight;

    this._isMounted = true;

    // Watch for transition end
    if (!this.noAnimation) {
      if (transitionEvent) {
        element.addEventListener(transitionEvent, this.onTransitionEnd);
      } else {
        this.noAnimation = true;
      }
    }


    if (notification.autoDismiss) {
      this.notificationTimer = new Helpers.Timer(function HelpersTimer() {
        self.hideNotification();
      }, notification.autoDismiss * 1000);
    }

    this.showNotification();
  },

  handleMouseEnter: function handleMouseEnter() {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this.notificationTimer.pause();
    }
  },

  handleMouseLeave: function handleMouseLeave() {
    var notification = this.props.notification;
    if (notification.autoDismiss) {
      this.notificationTimer.resume();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var element = ReactDOM.findDOMNode(this);
    var transitionEvent = whichTransitionEvent();
    element.removeEventListener(transitionEvent, this.onTransitionEnd);
    this._isMounted = false;
  },

  allowHTML: function allowHTML(string) {
    return { __html: string };
  },

  render: function render() {
    var notification = this.props.notification;
    var notificationStyle = merge({}, this.styles.notification);
    var cssByPos = this.getCssPropertyByPosition();
    var dismiss = null;
    var actionButton = null;
    var title = null;
    var message = null;

    var className = classnames(
      'notification',
      'notification-' + notification.level,
      {
        'notification-visible': this.state.visible,
        'notification-hidden': !this.state.visible === false,
        'notification-not-dismissible': !notification.dismissible
      }
    );

    if (this.props.getStyles.overrideStyle) {
      if (!this.state.visible && !this.state.removed) {
        notificationStyle[cssByPos.property] = cssByPos.value;
      }

      if (this.state.visible && !this.state.removed) {
        notificationStyle.height = this.height;
        notificationStyle[cssByPos.property] = 0;
      }

      if (this.state.removed) {
        notificationStyle.overlay = 'hidden';
        notificationStyle.height = 0;
        notificationStyle.marginTop = 0;
        notificationStyle.paddingTop = 0;
        notificationStyle.paddingBottom = 0;
      }
      notificationStyle.opacity = this.state.visible ?
        this.styles.notification.isVisible.opacity :
        this.styles.notification.isHidden.opacity;
    }

    if (notification.title) {
      title = <h4 className="notification-title" style={ this.styles.title }>{ notification.title }</h4>;
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          <div className="notification-message" style={ this.styles.messageWrapper }
            dangerouslySetInnerHTML={ this.allowHTML(notification.message) } />
        );
      } else {
        message = (
          <div className="notification-message" style={ this.styles.messageWrapper }>{ notification.message }</div>
        );
      }
    }

    if (notification.dismissible) {
      dismiss = <span className="notification-dismiss" style={ this.styles.dismiss }>&times;</span>;
    }

    if (notification.action) {
      actionButton = (
        <div className="notification-action-wrapper" style={ this.styles.actionWrapper }>
          <button className="notification-action-button"
            onClick={ this.defaultAction }
            style={ this.styles.action }>
              { notification.action.label }
          </button>
        </div>
      );
    }

    if (notification.children) {
      actionButton = notification.children;
    }

    return (
      <div className={ className } onClick={ this.dismiss }
        onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } style={ notificationStyle }>
        { title }
        { message }
        { dismiss }
        { actionButton }
      </div>
    );
  }

});

module.exports = NotificationItem;
