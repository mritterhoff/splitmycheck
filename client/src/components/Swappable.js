import React from 'react';
// import PropTypes from 'prop-types'
import ClassNames from 'classnames';

import '../css/Swappable.css';

class Swappable extends React.Component {
  _ref;

  onFocusCB = () => {
    this.props.swapCB(this.props.index, true);
  };

  onBlurCB = () => {
    this.props.swapCB(this.props.index, false);
  };

  focusChild = () => {
    this._ref.selectInput();
  };

  render() {
    const className = ClassNames(this.props.className, {
      Swappable: true,
      interactive: this.props.interactive,
      notInteractive: !this.props.interactive
    });
    return (
      <div
        className={className}
        style={this.props.style}
        onBlur={this.onBlurCB}
        onFocus={this.onFocusCB}
      >
        {this.getInnerChild()}
      </div>
    );
  }

  // If there's only one element in the children array, use it.
  // else, clone the the appropriate child, and give it a ref prop for CB access
  getInnerChild() {
    return React.cloneElement(
      this.props.children[this.props.interactive ? 0 : 1],
      { ref: (ref) => { this._ref = ref; } }
    );
  }
}

// Swappable.propTypes = {
//   children:          PropTypes.array.isRequired,
//   interactive:       PropTypes.bool.isRequired,
//   index:             PropTypes.number.isRequired
// };

export default Swappable;
