var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('NotificationSystem');
var NotificationGenerator = require('./NotificationGenerator');
var NotificationSystemExample;

// Styles
console.log(require('styles/base'));

NotificationSystemExample = React.createClass({

  displayName: 'App',

  _notificationSystem: null,

  _notificationsShowCase: [
    {
      title: 'Hey, it\'s good to see you!',
      message: 'Now you can how ease is to use notifications in React!',
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
      title: 'I\'ll be here for ever!',
      message: 'You can\'t dismiss me at all!',
      level: 'success',
      position: 'tr',
      dismissible: false,
      autoDismiss: 0
    },
    {
      title: 'Bad things can happer too!',
      message: 'It\'s four type of levels: `success`, `error`, `warning` and `info`',
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
      message: 'It\'s not a good idea show all this notifications at the same time!',
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
      position: 'br'
    },
    {
      title: 'I\'m here forever...',
      message: 'Until you click me.',
      autoDismiss: 0,
      level: 'error',
      position: 'bl'
    }
  ],

  _notificationSystemInstance: function() {
    return this._notificationSystem;
  },

  _allowHTML: function(allow) {
    this.setState({ allowHTML: allow });
    console.log(this.state);
  },

  _showTheMagic: function() {
    var self = this;
    this._notificationsShowCase.forEach(function(notification) {
      self._notificationSystem.addNotification(notification);
    });
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
          <h1 className="title">React Notification System</h1>
          <h2 className="subtitle">A complete and totally customizable notifications component for React</h2>
          <h3 className="versions">(For React 0.14x and 0.13.x)</h3>

          <div className="btn-show-magic-holder">
            <button className="btn btn-outline btn-show-magic" onClick={ this._showTheMagic }>Show me what it can do!</button>
            <small className="more-magic">Click twice for more awesomeness!</small>
          </div>
          <div className="github-buttons">
            <a className="github-button" href="https://github.com/igorprado/react-notification-system" data-style="mega" data-icon="octicon-star" data-count-href="/igorprado/react-notification-system/stargazers" data-count-api="/repos/igorprado/react-notification-system#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star igorprado/react-notification-system on GitHub">Star</a>
            <a className="github-button" href="https://github.com/igorprado/react-notification-system/fork" data-style="mega" data-icon="octicon-repo-forked" data-count-href="/igorprado/react-notification-system/network" data-count-api="/repos/igorprado/react-notification-system#forks_count" data-count-aria-label="# forks on GitHub" aria-label="Fork igorprado/react-notification-system on GitHub">Fork</a>
          </div>
        </header>
        <div className="wrapper">
          <NotificationGenerator notifications={ this._notificationSystemInstance } allowHTML={ this._allowHTML } />
        </div>
        <footer className="footer fractal">
          <div className="wrapper">
            <p>Made in Brasília/Brazil by <a href="http://igorprado.com">Igor Prado</a>. <a href="https://github.com/igorprado/react-notification-system">See at Github</a>.</p>
          </div>
        </footer>
        <NotificationSystem ref="notificationSystem" allowHTML={ this.state.allowHTML } />
      </div>
    );
  }
});

ReactDOM.render(React.createElement(NotificationSystemExample), document.getElementById('app'));