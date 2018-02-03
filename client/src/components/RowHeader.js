import React from 'react';

import '../css/RowHeader.css'

// 
// Focus massively improved by https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
class RowHeader extends React.Component {
  // holds blur timeout id
  _timeoutID;

  // array of refs to all of the children components so we can trigger focus/selection
  // on the first one when this component receives focus
  _refs = [];

  constructor(props) {
    super(props);
    this.state = {
      // if one of this element's children is focussed
      isManagingFocus: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // only select the first input if we're NEWLY focussed
    if (this.state.isManagingFocus && !prevState.isManagingFocus) {
      this._refs[0].selectInput();
      console.log('would like to focused to on the first input here');
    }
  }

  _onBlur() {
    // return;  // uncomment this to help with style analysis in chrome
    this._timeoutID = setTimeout(() => {
      if (this.state.isManagingFocus) {
        this.setState(prevState => ({
          isManagingFocus: false
        }));
      }
    }, 0);
  }
  
  _onFocus() {
    clearTimeout(this._timeoutID);
    if (!this.state.isManagingFocus) {
      this.setState(prevState => ({
        isManagingFocus: true
      }));
    }
  }

  render() {
    // TOOD neaten this up
    // vertically align child span element when appropriate
    // https://css-tricks.com/centering-css-complete-guide/
    let className='RowHeader';
    if (this.props.useMobileUI && !this.state.isManagingFocus) {
      className += ' flexVertCenter'
    }
    else {
      className += ' block';
    }

    // SO PROUD OF THIS
    // makes it so that if this element is managing focus, it can't be selected!!
    let tabIndex = this.state.isManagingFocus ? '-1' : '0';

    // wrap in an additional div to increase touchable/clickable surface
    return (
      <div className='RowHeaderContainer' 
          tabIndex={tabIndex}
          onBlur={this._onBlur.bind(this)}
          onFocus={this._onFocus.bind(this)}>
        <div className={className}>
          {this.getInnerDisplay()}
        </div>
      </div>
    );
  }

  // get refs to each child component
  // hat tip to https://stackoverflow.com/a/32371612/1188090
  // must set _ref by index (push() will lead to an array of old duplicates)
  getInnerDisplay() {
    if (this.state.isManagingFocus || !this.props.useMobileUI) {
      return React.Children.map(
        this.props.children, 
        (child, i) => React.cloneElement(child, { ref: (ref) => { this._refs[i] = ref; } }));
    }

    // if we're using mobile and we're not focused
    return this.props.staticReplacement();
  }
}

export { RowHeader };