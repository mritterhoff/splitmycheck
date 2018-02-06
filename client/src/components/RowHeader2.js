import React from 'react';
// import PropTypes from 'prop-types'

import { Swappable } from './Swappable'

import '../css/RowHeader.css'

class RowHeader2 extends React.Component {
  // holds blur timeout id
  _timeoutID;

  // array of refs to all of the children components so we can trigger focus/selection
  // on the first one when this component receives focus
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

  onClickCB() {
    // if we're not already focussed, and we click somewhere other than 
    // the two spans (ie the background container div), focus on the first input
    if (!this.state.isManagingFocus) {
      this.swapCB(0, true);
    }
  }

  // status is a bool, should probably be an enum
  swapCB(index, status) {
    console.log(index,` is now ${status ? 'focused' : 'blurred'}`);

    if (status === true) {
      clearTimeout(this._timeoutID);
      this._focused[index] = true;

      this.setState(
        prevState => ({ isManagingFocus: true }),
        () => { this._refs[index].focusChild(); });
    }
    else {
      this._focused[index] = false;

      // wait a tick, then see if everything is unfocussed:
      this._timeoutID = setTimeout(() => {
        let hasAFocussedSubEl = this._focused.reduce((a,b)=>(a && b), true);
        if (this.state.isManagingFocus && !hasAFocussedSubEl) {
          this.setState(prevState => ({
            isManagingFocus: false
          }));
        }
      }, 0);
    }
  }

  render() {
    // wrap in an additional div to increase touchable/clickable surface
    let className = 'RowHeaderContainer ' + (this.state.isManagingFocus ? 'focused' : 'notFocused');
    return (
                              //// TODO explore making this something other than onClick
      <div className={className} onClick={this.onClickCB.bind(this)}>
        {this.props.children.map((childPair, i) => 
          <Swappable 
            ref={ref => { this._refs[i] = ref; }}
            swapCB={this.swapCB.bind(this)}
            interactive={this.state.isManagingFocus}
            index={i}
            key={i}>
              {childPair}
          </Swappable>)}
      </div>  
    );  
  }
}

// RowHeader2.propTypes = {
//   children:          PropTypes.array.isRequired,
//   useMobileUI:       PropTypes.bool.isRequired,
//   staticReplacement: PropTypes.func.isRequired
// }

export { RowHeader2 };