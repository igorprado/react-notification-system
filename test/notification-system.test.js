import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import NotificationSystem from 'notification-system';

const MOCK = {
  title: 'This is a title',
  message: 'This is a message',
  level: 'success'
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
        return <NotificationSystem ref={ ref } />;
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
    component.addNotification(MOCK);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(1);
    done();
  });

  it('should render three (03) notifications', done => {
    component.addNotification(MOCK);
    component.addNotification(MOCK);
    component.addNotification(MOCK);

    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(3);
    done();
  });

  it('should remove a notification using returned object', done => {
    let notificationObj = component.addNotification(MOCK);
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
    let notificationObj = component.addNotification(MOCK);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
    expect(notification.length).toEqual(1);

    component.removeNotification(notificationObj.uid);
    setTimeout(function() {
      let notificationRemoved = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification');
      expect(notificationRemoved.length).toEqual(0);
    }, 200);

    done();
  });

  it('should render no title if not provided', done => {
    delete MOCK.title;
    component.addNotification(MOCK);
    let notification = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'notification-title');
    expect(notification.length).toEqual(0);
    done();
  });
});
