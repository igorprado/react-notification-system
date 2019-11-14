const React = require('react');
const CustomElement = require('./CustomElement');

const showcase = [
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
];

module.exports = showcase;

