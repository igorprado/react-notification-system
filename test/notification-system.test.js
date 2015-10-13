/* eslint no-multi-comp:0 */

import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import NotificationSystem from 'notification-system';
import { positions, levels } from 'constants';

const defaultNotification = {
  title: 'This is a title',
  message: 'This is a message',
  level: 'success'
};

const style = {
  Containers: {
    DefaultStyle: {
      width: 600
    },

    tl: {
      width: 800
    }
  }
};

describe('Notification', () => {
  let node;
  let instance;
  let component;
  const ref = 'notificationSystem';

  beforeEach(() => {
    // We need to create this wrapper so we can use refs
    class ElementWrapper extends Component {
      render() {
        return <NotificationSystem ref={ ref } style={ style } allowHTML={ true } />;
      }
    }
    node = window.document.createElement('div');
    instance = TestUtils.renderIntoDocument(React.createElement(ElementWrapper), node);
    component = instance.refs[ref];
  });

  it('component should be rendered', done => {
    component = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-wrapper');
    expect(component).toExist();
    done();
  });

  it('should hold the component ref', done => {
    expect(component).toExist();
    done();
  });

  it('should render a single notification', done => {
    component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(1);
    done();
  });

  it('should render notifications in all positions with all levels', done => {
    let count = 0;
    for (let position of Object.keys(positions)) {
      for (let level of Object.keys(levels)) {
        let notificationObj = Object.assign({}, defaultNotification);
        notificationObj.position = positions[position];
        notificationObj.level = levels[level];
        component.addNotification(notificationObj);
        count++;
      }
    }

    let containers = [];

    for (let position of Object.keys(positions)) {
      containers.push(TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-' + positions[position]));
    }

    containers.forEach(function(container) {
      for (let level of Object.keys(levels)) {
        let notification = container.getElementsByClassName('notification-' + levels[level]);
        expect(notification).toExist();
      }
    });

    let notifications = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notifications.length).toEqual(count);
    done();
  });

  it('should render multiple notifications', done => {
    const randomNumber = Math.floor(Math.random(5, 10));

    for (let i = 1; i <= randomNumber; i++) {
      component.addNotification(defaultNotification);
    }

    let notifications = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notifications.length).toEqual(randomNumber);
    done();
  });

  it('should remove a notification using returned object', done => {
    let notificationObj = component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(1);

    component.removeNotification(notificationObj);
    setTimeout(function() {
      let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
      expect(notificationRemoved.length).toEqual(0);
    }, 200);

    done();
  });

  it('should remove a notification using uid', done => {
    let notificationObj = component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(1);

    component.removeNotification(notificationObj.uid);
    setTimeout(function() {
      let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
      expect(notificationRemoved.length).toEqual(0);
    }, 200);

    done();
  });

  it('should not render title if not provided', done => {
    delete defaultNotification.title;
    component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification-title');
    expect(notification.length).toEqual(0);
    done();
  });

  it('should not render message if not provided', done => {
    delete defaultNotification.message;
    component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification-message');
    expect(notification.length).toEqual(0);
    done();
  });

  it('should dismiss notification on click', done => {
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    setTimeout(function() {
      expect(notification).toNotExist();
    });
    done();
  });

  it('should not dismiss the notificaion on click if dismissible is false', done => {
    defaultNotification.dismissible = false;
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    expect(notification).toExist();
    done();
  });

  it('should render a button if action property is passed', done => {
    defaultNotification.action = {
      label: 'Click me',
      callback: function() {}
    };

    component.addNotification(defaultNotification);
    let button = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-action-button');
    expect(button).toExist();
    done();
  });

  it('should execute a callback function when notification button is clicked', done => {
    let testThis = false;
    defaultNotification.action = {
      label: 'Click me',
      callback: function() {
        testThis = true;
      }
    };

    component.addNotification(defaultNotification);
    let button = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-action-button');
    TestUtils.Simulate.click(button);
    expect(testThis).toEqual(true);
    done();
  });

  it('should pause the timer if a notification has a mouse over', done => {
    defaultNotification.autoDismiss = 5;
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.mouseOver(notification);
    setTimeout(function() {
      expect(notification).toExist();
    }, 10000);
    done();
  });

  it('should allow HTML inside messages', done => {
    defaultNotification.message = '<strong class="allow-html-strong">Strong</strong>';
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-message');
    let htmlElement = notification.getElementsByClassName('allow-html-strong');
    expect(htmlElement.length).toEqual(1);
    done();
  });

  it('should render containers with a overrided width', done => {
    let notificationObj = Object.assign({}, defaultNotification);
    notificationObj.position = 'tc';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-tc');
    let width = notification.style.width;
    expect(width).toEqual('600px');
    done();
  });

  it('should render a notification with specific style based on position', done => {
    let notificationObj = Object.assign({}, defaultNotification);
    notificationObj.position = 'bc';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    let bottomPosition = notification.style.bottom;
    expect(bottomPosition).toEqual('-100px');
    done();
  });

  it('should render containers with a overrided width for a specific position', done => {
    let notificationObj = Object.assign({}, defaultNotification);
    notificationObj.position = 'tl';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-tl');
    let width = notification.style.width;
    expect(width).toEqual('800px');
    done();
  });

  it('should throw an error if no level is defined', done => {
    let notificationObj = Object.assign({}, defaultNotification);
    delete notificationObj.level;
    expect(component.addNotification).withArgs(notificationObj).toThrow(/notification level is required./);
    done();
  });

  it('should throw an error if autoDismiss is not a number', done => {
    let notificationObj = Object.assign({}, defaultNotification);
    notificationObj.autoDismiss = 'string';
    expect(component.addNotification).withArgs(notificationObj).toThrow(/\'autoDismiss\' must be a number./);
    done();
  });
});
