var React = require('react');

var NotificationSystem = require('react-notification-system');

var NotificationSystemExample = React.createClass({

  _notificationSystem: null,

  _notify: function(event) {
    event.preventDefault();
    var notification = this.state.notification;

    this._notificationSystem.addNotification(notification);
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

  _changedDismissible: function(event) {
    var notification = this.state.notification;
    notification.dismissible = !notification.dismissible;

    if (!notification.dismissible && !notification.actionState) {
      this._changedAction();
    }

    this.setState({
      notification: notification
    });
  },

  _callbackForAction: function() {
    var count = this.state.actionCounter;
    count++;
    this.setState({
      actionCounter: count
    });
  },

  _changedAction: function(event) {
    var notification = this.state.notification;
    notification.actionState = !notification.actionState;

    if (notification.actionState) {
      notification.action = {
        label: 'Action',
        callback: this._callbackForAction
      }
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
      actionCounter: 0
    }
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

    var error = {
      position: 'hide',
      level: 'hide'
    };

    if (notification.position === "in") {
      error.position = 'text-danger';
    }

    if (notification.level === "in") {
      error.level = 'text-danger';
    }

    var printNotification = notification;

    printNotification = JSON.stringify(printNotification, null, 4);

    return  <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                  <div className="page-header">
                    <h1>React Notification System</h1>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-6">
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

                        </div>

                        <div className="form-group">
                          <button className="btn btn-lg btn-block btn-success" onClick={this._notify}>Notify!</button>
                        </div>

                      </form>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                      <h3>Notification object</h3>
                      <pre>
                        {printNotification}
                      </pre>

                      <h3>Action click counter <span className="label label-info">{this.state.actionCounter}</span></h3>
                      <p>A simple counter for every action click.</p>
                    </div>
                  </div>


                </div>
              </div>
              <NotificationSystem ref="notificationSystem" />
            </div>;
  }
});

React.render(
  React.createElement(NotificationSystemExample),
  document.getElementById('app')
);
