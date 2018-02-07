import React from 'react';
// import PropTypes from 'prop-types'
import ClassNames from 'classnames';

class Swappable extends React.Component {
  _ref;

  onFocusCB(e) {
    this.props.swapCB(this.props.index, true);
  }

  onBlurCB(e) {
    this.props.swapCB(this.props.index, false);
  }

  focusChild() {
    this._ref.selectInput();
  }
 
  render() {
    let className = ClassNames({
      'Swappable': true,
      'interactive' : this.props.interactive,
      'notInteractive' : !this.props.interactive});
    return (
      <div className={className}
        style={this.props.style}
        onBlur={this.onBlurCB.bind(this)}
        onFocus={this.onFocusCB.bind(this)}>
          {this.getInnerChild()}
      </div>
    );
  }

  // If there's only one element in the children array, use it.
  // else, clone the the appropriate child, and give it a ref prop for CB access
  getInnerChild() {
    return React.cloneElement(
      this.props.children[this.props.interactive ? 0 : 1], 
      { ref: ref => { this._ref = ref; }})
  }
}

// Swappable.propTypes = {
//   children:          PropTypes.array.isRequired,
//   interactive:       PropTypes.bool.isRequired,
//   index:             PropTypes.number.isRequired
// };

// Swappable.name = 'Swappable'

export { Swappable };