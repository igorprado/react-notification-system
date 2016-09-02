var React = require('react');

function buttonClicked() {
  alert('I\'m a custom button inside a custom element that was clicked');
}

function CustomElement(props) {
  return (
    <div>
      <div>I'm a custom react element with prop: {props.name}</div>
      <button onClick={ buttonClicked }>I'm a custom button</button>
    </div>
  );
}

CustomElement.propTypes = {
  name: React.PropTypes.string
};

module.exports = CustomElement;
