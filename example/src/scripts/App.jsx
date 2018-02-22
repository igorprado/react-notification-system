var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var NotificationSystem = require('NotificationSystem');
var constants = require('constants');
var NotificationGenerator = require('./NotificationGenerator');
var CustomElement = require('./CustomElement');
var NotificationSystemExample;

var _getRandomPosition = function() {
  var positions = Object.keys(constants.positions);
  return positions[Math.floor(Math.random() * ((positions.length - 1) + 1)) + 0];
};

// Styles
require('styles/base');

NotificationSystemExample = createReactClass({

  displayName: 'App',

  _notificationSystem: null,

  _magicCount: 0,

  _notificationsShowCase: [
    {
      title: 'Hey, it\'s good to see you!',
      message: 'Now you can see how easy it is to use notifications in React!',
      level: 'success',
      position: 'tr',
      action: {
        label: 'Awesome!',
        callback: function() {
          console.log('Clicked');
        }
      }
    },
    {
      title: 'Hey, it\'s good to see you!',
      message: 'I come with custom content!',
      level: 'success',
      position: 'tr',
      children: (
        <div>
          <CustomElement name="I'm a prop"/>
        </div>
      )
    },
    {
      title: 'I\'ll be here forever!',
      message: 'Just kidding, you can click me.',
      level: 'success',
      position: 'tr',
      autoDismiss: 0
    },
    {
      title: 'I don\'t have a dismiss button...',
      message: 'But you can still click to get rid of me.',
      autoDismiss: 0,
      level: 'success',
      position: 'tr',
      dismissible: 'click'
    },
    {
      title: 'Bad things can happen too!',
      message: 'Four notification types: `success`, `error`, `warning` and `info`',
      level: 'error',
      position: 'tl'
    },
    {
      title: 'Advise!',
      message: 'Showing all possible notifications works better on a larger screen',
      level: 'info',
      position: 'tc'
    },
    {
      title: 'Warning!',
      message: 'It\'s not a good idea show all these notifications at the same time!',
      level: 'warning',
      position: 'bc',
      action: {
        label: 'Got it!'
      }
    },
    {
      title: 'Success!',
      message: 'I\'m out of ideas',
      level: 'success',
      position: 'bl'
    },
    {
      title: 'I\'m here forever...',
      message: 'Until you click me.',
      autoDismiss: 0,
      level: 'error',
      position: 'br'
    },
    {
      title: 'I\'m here forever...',
      message: 'Until you click the dismiss button.',
      autoDismiss: 0,
      level: 'error',
      position: 'br',
      dismissible: 'button'
    }
  ],

  _notificationSystemInstance: function() {
    return this._notificationSystem;
  },

  _allowHTML: function(allow) {
    this.setState({ allowHTML: allow });
  },

  _showTheMagic: function() {
    var self = this;
    this._notificationsShowCase.forEach(function(notification) {
      var _notification = notification;
      if (self._magicCount > 0) {
        _notification.position = _getRandomPosition();
      }
      self._notificationSystem.addNotification(_notification);
    });
    this._magicCount++;
  },

  getInitialState: function() {
    return {
      allowHTML: false,
      viewHeight: null
    };
  },

  componentWillMount: function() {
    this.setState({ viewHeight: window.innerHeight });
  },

  componentDidMount: function() {
    this._notificationSystem = this.refs.notificationSystem;
  },

  render: function() {
    return (
      <div className="app-container">
        <header style={ { minHeight: this.state.viewHeight } } className="header gradient">
          <div className="overlay" />
          <div className="content">
            <h1 className="title">React Notification System</h1>
            <h2 className="subtitle">A complete and totally customizable component for notifications in React.</h2>
            <h3 className="versions">(For React 15, 0.14 and 0.13)</h3>

            <div className="btn-show-magic-holder">
              <button className="btn btn-outline btn-show-magic" onClick={ this._showTheMagic }>
                Show me what it can do!
              </button>
              <span className="width-warning">Better experience in larger screens</span>
              <small className="more-magic">Click twice for more awesomeness!</small>
            </div>
            <div className="github-buttons">
              <a className="github-button" href="https://github.com/igorprado/react-notification-system" data-size="large" data-icon="octicon-star" data-count-href="/igorprado/react-notification-system/stargazers" data-show-count="true" data-count-aria-label="# stargazers on GitHub" aria-label="Star igorprado/react-notification-system on GitHub">Star</a>
              <a className="github-button" href="https://github.com/igorprado/react-notification-system/fork" data-size="large" data-icon="octicon-repo-forked" data-count-href="/igorprado/react-notification-system/network" data-show-count="true" data-count-aria-label="# forks on GitHub" aria-label="Fork igorprado/react-notification-system on GitHub">Fork</a>
            </div>
          </div>
        </header>
        <div className="wrapper">
          <NotificationGenerator notifications={ this._notificationSystemInstance } allowHTML={ this._allowHTML } />
        </div>
        <footer className="footer gradient">
          <div className="overlay" />
          <div className="wrapper">
            <p>Made in Brasília, Brazil by <a href="http://igorprado.com" target="_blank">Igor Prado</a>.</p>
          </div>
        </footer>
        <NotificationSystem ref="notificationSystem" allowHTML={ this.state.allowHTML } />
      </div>
    );
  }
});

ReactDOM.render(React.createElement(NotificationSystemExample), document.getElementById('app'));
