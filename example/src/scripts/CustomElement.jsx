var React = require('react');

function CustomElement(props) {
  return <div>I'm a custom react element with prop: {props.name}</div>;
}

CustomElement.propTypes = {
  name: React.PropTypes.string
};

module.exports = CustomElement;
