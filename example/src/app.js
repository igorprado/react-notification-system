var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('../../dist/notification-system.js');

var NotificationSystemExample = React.createClass({

  _notificationSystem: null,

  _lastNotificationAdded: null,

  _notify: function(event) {
    event.preventDefault();
    var notification = this.state.notification;

    notification.onRemove = this._onRemove;

    console.log('Notification object', notification);

    this._lastNotificationAdded = this._notificationSystem.addNotification(notification);
    this.setState({});
  },

  _removeLastNotification: function(event) {
    event.preventDefault();
    if (this._lastNotificationAdded) {
      this._notificationSystem.removeNotification(this._lastNotificationAdded);
    }
  },

  _changed: function(event) {
    var notification = this.state.notification;
    var prop = event.target.name;
    var value = event.target.value;

    if (prop === 'autoDismiss') {
      if (value === '') value = 0;
      value = parseInt(value);
    }

    notification[prop] = value;

    this.setState({
      notification: notification
    });
  },

  _onRemove: function(notification) {
    if (this._lastNotificationAdded && notification.uid === this._lastNotificationAdded.uid) {
      this._lastNotificationAdded = null;
    }
    this.setState({});
    console.log('%cNotification ' + notification.uid + ' was removed.', 'font-weight: bold; color: #eb4d00');
  },

  _changedDismissible: function(event) {
    var notification = this.state.notification;
    notification.dismissible = !notification.dismissible;

    this.setState({
      notification: notification
    });
  },

  _changedAllowHTML: function(event) {
    var allowHTML = !this.state.allowHTML;
    this.setState({
      allowHTML: allowHTML
    });
  },

  _callbackForAction: function() {
    console.log('%cYou clicked an action button inside a notification!', 'font-weight: bold; color: #008feb');
  },

  _changedAction: function(event) {
    var notification = this.state.notification;
    notification.actionState = !notification.actionState;

    if (notification.actionState) {
      notification.action = {
        label: 'Action',
        callback: this._callbackForAction
      };
    } else {
      notification.action = null;
    }

    this.setState({
      notification: notification
    });
  },

  _changedActionLabel: function(event) {
    var notification = this.state.notification;
    var value = event.target.value;

    notification.action.label = value;

    this.setState({
      notification: notification
    });


  },

  getInitialState: function() {
    return {
      notification: {
        title: "Default title",
        message: 'Default message',
        level: 'error',
        position: 'tr',
        autoDismiss: 5,
        dismissible: true,
        action: null,
        actionState: false
      },
      allowHTML: false
    };
  },
  componentDidMount: function() {
    this._notificationSystem = this.refs.notificationSystem;

  },
  render: function() {
    var notification = this.state.notification;

    var action = null;

    if (notification.actionState) {
      action = (
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon">label</div>
            <input className="form-control" name="label" onChange={this._changedActionLabel} type="text" value={notification.action.label} />
          </div>
        </div>
      );
    }

    var removeButton = null;

    if (this._lastNotificationAdded) {
      removeButton = (
        <div className="form-group">
          <button className="btn btn-sm btn-block btn-danger" onClick={this._removeLastNotification}>Remove last notification!</button>
        </div>
      );
    }

    var style = false;

    var error = {
      position: 'hide',
      dismissible: 'hide',
      level: 'hide',
      action: 'hide'
    };

    if (notification.position === "in") {
      error.position = 'text-danger';
    }

    if (notification.level === "in") {
      error.level = 'text-danger';
    }

    if (!notification.dismissible && !notification.actionState) {
      error.dismissible = 'text-danger';
      error.action = 'text-danger';
    }

    return  <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-8 col-sm-offset-2">
                  <div className="page-header">
                    <h1>React Notification System</h1>
                  </div>
                  <p>Open your console to see some logs from the component.</p>

                  <div className="row">
                    <div className="col-xs-12">
                      <form>
                        <div className="form-group">
                          <label>Title:</label>
                          <input className="form-control" name="title" onChange={this._changed} type="text" value={notification.title} />
                          <small>Leave empty to hide.</small>
                        </div>
                        <div className="form-group">
                          <label>Message:</label>
                          <input className="form-control" name="message" onChange={this._changed} type="text" value={notification.message} />
                        </div>
                        <div className="form-group">
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" checked={this.state.allowHTML} onChange={this._changedAllowHTML} />
                              Allow HTML in message?
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Position:</label>
                          <select className="form-control" name="position" onChange={this._changed} value={notification.position}>
                            <option value="tl">Top left (tl)</option>
                            <option value="tr">Top right (tr)</option>
                            <option value="tc">Top center (tc)</option>
                            <option value="bl">Bottom left (bl)</option>
                            <option value="br">Bottom right (br)</option>
                            <option value="bc">Bottom center (bc)</option>
                            <option value="in">Invalid position</option>
                          </select>
                          <small className={error.position}>Open console to see the error after creating a notification.</small>
                        </div>
                        <div className="form-group">
                          <label>Level:</label>
                          <select className="form-control" name="level" onChange={this._changed} value={notification.level}>
                            <option value="success">Success</option>
                            <option value="error">Error</option>
                            <option value="warning">Warning</option>
                            <option value="info">Info</option>
                            <option value="in">Invalid level</option>
                          </select>
                          <small className={error.level}>Open console to see the error after creating a notification.</small>
                        </div>

                        <div className="form-group">
                          <label>Auto Dismiss delay:</label>
                          <div className="input-group">
                            <input className="form-control" name="autoDismiss" onChange={this._changed} type="text" value={notification.autoDismiss} />
                            <div className="input-group-addon">secs (0 means infinite)</div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" checked={notification.dismissible} onChange={this._changedDismissible} />
                              Can user dismiss
                            </label>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-xs-12 col-sm-5">
                            <div className="checkbox">
                              <label>
                                <input type="checkbox" checked={notification.actionState} onChange={this._changedAction} />
                                Action
                              </label>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-7">
                            {action}
                          </div>
                          <small className={error.dismissible}>This notification will be only dismissible programmatically or after 'autoDismiss' timeout.</small>
                        </div>


                        {removeButton}

                        <div className="form-group">
                          <button className="btn btn-lg btn-block btn-success" onClick={this._notify}>Notify!</button>
                        </div>

                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <NotificationSystem ref="notificationSystem" allowHTML={this.state.allowHTML} />
            </div>;
  }
});

ReactDOM.render(
  React.createElement(NotificationSystemExample),
  document.getElementById('app')
);
