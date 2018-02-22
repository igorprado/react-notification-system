/* global sinon */

import React, { Component } from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import NotificationSystem from 'NotificationSystem';
import { positions, levels } from 'constants';
import merge from 'object-assign';

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

describe('Notification Component', function() {
  let node;
  let instance;
  let component;
  let clock;
  let notificationObj;
  const ref = 'notificationSystem';

  this.timeout(10000);

  beforeEach(() => {
    // We need to create this wrapper so we can use refs
    class ElementWrapper extends Component {
      render() {
        return <NotificationSystem ref={ ref } style={ style } allowHTML={ true } noAnimation={ true } />;
      }
    }
    node = window.document.createElement('div');
    instance = TestUtils.renderIntoDocument(React.createElement(ElementWrapper), node);
    component = instance.refs[ref];
    notificationObj = merge({}, defaultNotification);

    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should be rendered', done => {
    component = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-wrapper');
    expect(component).to.not.be.null;
    done();
  });

  it('should hold the component ref', done => {
    expect(component).to.not.be.null;
    done();
  });

  it('should render a single notification', done => {
    component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);
    done();
  });

  it('should not set a notification visibility class when the notification is initially added', done => {
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notification.className).to.not.match(/notification-hidden/);
    expect(notification.className).to.not.match(/notification-visible/);
    done();
  });

  it('should set the notification class to visible after added', done => {
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notification.className).to.match(/notification/);
    clock.tick(400);
    expect(notification.className).to.match(/notification-visible/);
    done();
  });

  it('should render notifications in all positions with all levels', done => {
    let count = 0;
    for (let position of Object.keys(positions)) {
      for (let level of Object.keys(levels)) {
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
        expect(notification).to.not.be.null;
      }
    });

    let notifications = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notifications.length).to.equal(count);
    done();
  });

  it('should render multiple notifications', done => {
    const randomNumber = Math.floor(Math.random(5, 10));

    for (let i = 1; i <= randomNumber; i++) {
      component.addNotification(defaultNotification);
    }

    let notifications = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notifications.length).to.equal(randomNumber);
    done();
  });

  it('should not render notifications with the same uid', done => {
    notificationObj.uid = 500;
    component.addNotification(notificationObj);
    component.addNotification(notificationObj);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);
    done();
  });

  it('should remove a notification after autoDismiss', function(done) {
    notificationObj.autoDismiss = 2;
    component.addNotification(notificationObj);
    clock.tick(3000);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(0);
    done();
  });

  it('should remove a notification using returned object', done => {
    let notificationCreated = component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);

    component.removeNotification(notificationCreated);
    clock.tick(1000);
    let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notificationRemoved.length).to.equal(0);
    done();
  });

  it('should remove a notification using uid', done => {
    let notificationCreated = component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);

    component.removeNotification(notificationCreated.uid);
    clock.tick(200);
    let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notificationRemoved.length).to.equal(0);
    done();
  });

  it('should edit an existing notification using returned object', (done) => {
    const notificationCreated = component.addNotification(defaultNotification);
    const notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);

    const newTitle = 'foo';
    const newContent = 'foobar';

    component.editNotification(notificationCreated, { title: newTitle, message: newContent });
    clock.tick(1000);
    const notificationEdited = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notificationEdited.getElementsByClassName('notification-title')[0].textContent).to.equal(newTitle);
    expect(notificationEdited.getElementsByClassName('notification-message')[0].textContent).to.equal(newContent);
    done();
  });

  it('should edit an existing notification using uid', (done) => {
    const notificationCreated = component.addNotification(defaultNotification);
    const notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(1);

    const newTitle = 'foo';
    const newContent = 'foobar';

    component.editNotification(notificationCreated.uid, { title: newTitle, message: newContent });
    clock.tick(1000);
    const notificationEdited = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notificationEdited.getElementsByClassName('notification-title')[0].textContent).to.equal(newTitle);
    expect(notificationEdited.getElementsByClassName('notification-message')[0].textContent).to.equal(newContent);
    done();
  });

  it('should remove all notifications', done => {
    component.addNotification(defaultNotification);
    component.addNotification(defaultNotification);
    component.addNotification(defaultNotification);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(3);
    component.clearNotifications();
    clock.tick(200);
    let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notificationRemoved.length).to.equal(0);
    done();
  });

  it('should dismiss notification on click', done => {
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    clock.tick(1000);
    let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notificationRemoved.length).to.equal(0);
    done();
  });

  it('should dismiss notification on click of dismiss button', done => {
    component.addNotification(notificationObj);
    let dismissButton = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-dismiss');
    TestUtils.Simulate.click(dismissButton);
    clock.tick(1000);
    let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notificationRemoved.length).to.equal(0);
    done();
  });

  it('should not render title if not provided', done => {
    delete notificationObj.title;
    component.addNotification(notificationObj);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification-title');
    expect(notification.length).to.equal(0);
    done();
  });

  it('should not render message if not provided', done => {
    delete notificationObj.message;
    component.addNotification(notificationObj);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification-message');
    expect(notification.length).to.equal(0);
    done();
  });

  it('should not dismiss the notificaion on click if dismissible is false', done => {
    notificationObj.dismissible = false;
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    let notificationAfterClicked = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notificationAfterClicked).to.not.be.null;
    done();
  });

  it('should not dismiss the notification on click if dismissible is none', done => {
    notificationObj.dismissible = 'none';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    let notificationAfterClicked = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notificationAfterClicked).to.exist;
    done();
  });

  it('should not dismiss the notification on click if dismissible is button', done => {
    notificationObj.dismissible = 'button';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    let notificationAfterClicked = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(notificationAfterClicked).to.exist;
    done();
  });

  it('should render a button if action property is passed', done => {
    defaultNotification.action = {
      label: 'Click me',
      callback: function() {}
    };

    component.addNotification(defaultNotification);
    let button = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-action-button');
    expect(button).to.not.be.null;
    done();
  });

  it('should execute a callback function when notification button is clicked', done => {
    let testThis = false;
    notificationObj.action = {
      label: 'Click me',
      callback: function() {
        testThis = true;
      }
    };

    component.addNotification(notificationObj);
    let button = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-action-button');
    TestUtils.Simulate.click(button);
    expect(testThis).to.equal(true);
    done();
  });

  it('should accept an action without callback function defined', done => {
    notificationObj.action = {
      label: 'Click me'
    };

    component.addNotification(notificationObj);
    let button = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-action-button');
    TestUtils.Simulate.click(button);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).to.equal(0);
    done();
  });

  it('should execute a callback function on add a notification', done => {
    let testThis = false;
    notificationObj.onAdd = function() {
      testThis = true;
    };

    component.addNotification(notificationObj);
    expect(testThis).to.equal(true);
    done();
  });

  it('should execute a callback function on remove a notification', done => {
    let testThis = false;
    notificationObj.onRemove = function() {
      testThis = true;
    };

    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.click(notification);
    expect(testThis).to.equal(true);
    done();
  });

  it('should render a children if passed', done => {
    defaultNotification.children = (
      <div className="custom-container"></div>
    );

    component.addNotification(defaultNotification);
    let customContainer = TestUtils.findRenderedDOMComponentWithClass(instance, 'custom-container');
    expect(customContainer).to.not.be.null;
    done();
  });

  it('should pause the timer if a notification has a mouse enter', done => {
    notificationObj.autoDismiss = 2;
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.mouseEnter(notification);
    clock.tick(4000);
    let _notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    expect(_notification).to.not.be.null;
    done();
  });

  it('should resume the timer if a notification has a mouse leave', done => {
    notificationObj.autoDismiss = 2;
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    TestUtils.Simulate.mouseEnter(notification);
    clock.tick(800);
    TestUtils.Simulate.mouseLeave(notification);
    clock.tick(2000);
    let _notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(_notification.length).to.equal(0);
    done();
  });

  it('should allow HTML inside messages', done => {
    defaultNotification.message = '<strong class="allow-html-strong">Strong</strong>';
    component.addNotification(defaultNotification);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification-message');
    let htmlElement = notification.getElementsByClassName('allow-html-strong');
    expect(htmlElement.length).to.equal(1);
    done();
  });

  it('should render containers with a overrided width', done => {
    notificationObj.position = 'tc';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-tc');
    let width = notification.style.width;
    expect(width).to.equal('600px');
    done();
  });

  it('should render a notification with specific style based on position', done => {
    notificationObj.position = 'bc';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notification');
    let bottomPosition = notification.style.bottom;
    expect(bottomPosition).to.equal('-100px');
    done();
  });

  it('should render containers with a overrided width for a specific position', done => {
    notificationObj.position = 'tl';
    component.addNotification(notificationObj);
    let notification = TestUtils.findRenderedDOMComponentWithClass(instance, 'notifications-tl');
    let width = notification.style.width;
    expect(width).to.equal('800px');
    done();
  });

  it('should throw an error if no level is defined', done => {
    delete notificationObj.level;
    expect(() => component.addNotification(notificationObj)).to.throw(/notification level is required/);
    done();
  });

  it('should throw an error if a invalid level is defined', done => {
    notificationObj.level = 'invalid';
    expect(() => component.addNotification(notificationObj)).to.throw(/is not a valid level/);
    done();
  });

  it('should throw an error if a invalid position is defined', done => {
    notificationObj.position = 'invalid';
    expect(() => component.addNotification(notificationObj)).to.throw(/is not a valid position/);
    done();
  });

  it('should throw an error if autoDismiss is not a number', done => {
    notificationObj.autoDismiss = 'string';
    expect(() => component.addNotification(notificationObj)).to.throw(/\'autoDismiss\' must be a number./);
    done();
  });
});
