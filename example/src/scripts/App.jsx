var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('NotificationSystem');
var constants = require('constants');
var NotificationGenerator = require('./NotificationGenerator');
const showcase = require('./showcase');

var _getRandomPosition = function() {
  var positions = Object.keys(constants.positions);
  return positions[Math.floor(Math.random() * ((positions.length - 1) + 1)) + 0];
};

// Styles
require('styles/base');

class NotificationSystemExample extends React.Component {
  constructor() {
    super();
    this._notificationSystem = React.createRef();
    this._magicCount = 0;

    this.state = {
      allowHTML: false,
      newOnTop: false,
      viewHeight: null
    };
  }

  _notificationSystemInstance() {
    return this._notificationSystem.current;
  }

  _allowHTML(allow) {
    this.setState({ allowHTML: allow });
  }

  _newOnTop(newOnTop) {
    this.setState({ newOnTop });
  }

  _showTheMagic() {
    showcase.forEach((notification) => {
      var _notification = notification;
      if (this._magicCount > 0) {
        _notification.position = _getRandomPosition();
      }

      this._notificationSystemInstance().addNotification(_notification);
    });
    this._magicCount += 1;
  }

  componentDidMount() {
    this.setState({ viewHeight: window.innerHeight });
  }

  render() {
    return (
      <div className="app-container">
        <header style={ { minHeight: this.state.viewHeight } } className="header gradient">
          <div className="overlay" />
          <div className="content">
            <h1 className="title">React Notification System</h1>
            <h2 className="subtitle">A complete and totally customizable component for notifications in React.</h2>
            <h3 className="versions">(For React 15, 0.14 and 0.13)</h3>

            <div className="btn-show-magic-holder">
              <button className="btn btn-outline btn-show-magic" onClick={ this._showTheMagic.bind(this) }>
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
          <NotificationGenerator notifications={ () => this._notificationSystemInstance() } allowHTML={ this._allowHTML.bind(this) } newOnTop={ this._newOnTop.bind(this) } />
        </div>
        <footer className="footer gradient">
          <div className="overlay" />
          <div className="wrapper">
            <p>Made in Brasília, Brazil by <a href="http://igorprado.com" target="_blank">Igor Prado</a>.</p>
          </div>
        </footer>
        <NotificationSystem ref={ this._notificationSystem } allowHTML={ this.state.allowHTML } newOnTop={ this.state.newOnTop } />
      </div>
    );
  }
}

ReactDOM.render(React.createElement(NotificationSystemExample), document.getElementById('app'));
