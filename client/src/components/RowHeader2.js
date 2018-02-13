import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import Swappable from './Swappable';

import '../css/RowHeader.css';

class RowHeader2 extends React.Component {
  // holds blur timeout id, so we can clear if re-focused
  _timeoutID;

  // array of refs to all of the children components so we can trigger
  // focus/selection on the first one when this component receives focus
  _refs = [];

  // keep track of the swappable children, and whether they're focused or not
  _focused = [];

  constructor(props) {
    super(props);
    this.state = {
      // if one of this element's children is focused
      isManagingFocus: false
    };
  }

  onClickCB = () => {
    // if we're not already focused, and we click somewhere other than
    // the two spans (ie the background container div), focus on the first input
    if (!this.state.isManagingFocus) {
      this.swapCB(this._refs[0] ? 0 : 1, true);
    }
  }

  // TODO status is a bool, should probably be an enum
  swapCB(index, status) {
    // console.log(index,`is now ${status ? 'focused' : 'blurred'}`);
    if (status === true) {
      clearTimeout(this._timeoutID);
      this._focused[index] = true;

      // Update this state now that we're managing focus, and once that has trickled
      // down to the children, focus on the now-interactive component.
      this.setState(
        () => ({ isManagingFocus: true }),
        () => { this._refs[index].focusChild(); }
      );
    }
    else {
      this._focused[index] = false;

      // wait a tick, then see if everything is unfocussed:
      this._timeoutID = setTimeout(() => {
        const childHasFocus = this._focused.reduce((a, b) => (a && b), true);
        if (this.state.isManagingFocus && !childHasFocus) {
          this.setState(() => ({
            isManagingFocus: false
          }));
        }
      }, 0);
    }
  }

  render() {
    // wrap in an additional div to increase touchable/clickable surface
    const className = ClassNames({
      RowHeaderContainer: true,
      focused: this.state.isManagingFocus,
      notFocused: !this.state.isManagingFocus
    });

    // TODO explore making this use something other than onClick
    return (
      <div className={className} onClick={this.onClickCB}>
        {this.getChildren()}
      </div>
    );
  }

  getChildren() {
    // If it's a Swappable, add some props to it
    // TODO why React.Children.map?
    return React.Children.map(
      this.props.children,
      (child, i) => {
        if (child.type.name === Swappable.name) {
          return React.cloneElement(
            child,
            {
              ref: (ref) => { this._refs[i] = ref; },
              swapCB: this.swapCB.bind(this),
              interactive: !this.props.useMobileUI || this.state.isManagingFocus,
              index: i,
              key: i
            }
          );
        }
        return child;
      }
    );
  }
}

RowHeader2.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  useMobileUI: PropTypes.bool.isRequired
};

export default RowHeader2;
