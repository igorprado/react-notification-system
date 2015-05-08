# React Notification System

A complete and totally customizable notification system for React applications.

## Demo

* http://igorprado.github.io/react-notification-system

## Installing

For now this component is only available as CommonJS module. Install via NPM running:

```
npm install react-notification-system
```

## Using

For optimal appearance, this component **must be rendered on a top level HTML element** in your application to avoid position conflicts.

Here is a basic example. For a more advanced usage, please see the [example code](https://github.com/igorprado/react-notification-system/blob/master/example/src/app.js).

```js
var React = require('react');
var NotificationSystem = require('react-notification-system');

var MyComponent = React.createClass({
  _notificationSystem = null,

  _addNotification: function(event) {
    event.preventDefault();
    this._notificationSystem.addNotification({
      message: 'Notification message',
      level: 'success'
    });
  },

  componentDidMount: function() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  render: function() {
    return (
      <button onClick={this._addNotification}>Add notification</button>
      <NotificationSystem ref="notificationSystem" />
      );
  }
});

React.render(
  React.createElement(NotificationSystemExample),
  document.getElementById('app')
);
```

## Creating a notification

The notification object has the following properties:

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| title        | string          | null      | Title of the notification                                                                                                                                                 |
| message      | string          | null      | Message for the notification                                                                                                                                              |
| level        | string          | null      | Level of the notification. Available: **success**, **error**, **warning** and **info**                                                                                    |
| position     | string          | tr        | Position of the notification. Available: **tr (top right)**, **tl (top left)**, **tc (top center)**, **br (bottom right)**, **bl (bottom left)**, **bc (bottom center)**  |
| autoDismiss  | integer         | 5         | Delay in seconds for the notification go away. Set this to **0** to not auto-dismiss the notificaion                                                                      |
| dismissible  | bool            | true      | Set if notification is dismissible by the user. [See more](#dismissible)                                                                                                  |
| action       | object          | null      | Add a button with label and callback function. [See more](#action)                                                                                                        |

### Dismissible

If set to false, the user will not be able to dismiss the notification. For this reason, if set to false, the `action` becomes required as the only way to dismiss the notification.

### Action

Add a button and a callback function to the notification. If this button is clicked, the callback function is called and the notification is dismissed.

```js
notification = {
  [...],
  action: {
    label: 'Button name',
    callback: function() {
      console.log('Notification button clicked!')
    }
  }
}

```

## Styles

This component was made to work as plug and play. For that, a handcrafted style was added to it. But you are able to override/add more styles to the component.

For this, use the `style` prop to pass an object with your styles. Your object must be something like this:

```js
var style = {
  NotificationItem: { // Override the notification item
    DefaultStyle: { // Applied to every notification, regardless of the notification level
      margin: '10px 5px 2px 1px'
    },

    success: { // Applied only to the success notification
      color: 'red'
    }
  }
}

<NotificationSystem ref="notificationSystem" style={style} />

```

Refer to [this file](https://github.com/igorprado/react-notification-system/blob/develop/dist/styles.js) to see what can you override.

## Roadmap

* Add tests
* Improve styles

## Contributions

This component is under construction. I will add more guidelines to who wants to contribute.
