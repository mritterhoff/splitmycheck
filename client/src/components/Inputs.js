/* eslint-disable no-unused-expressions */

import React from 'react';
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';

import { Price } from '../NumTypes';

import '../css/Inputs.css';

// TODO the style resolution for these inputs should be improved.
const inputStyleDefault = {
  border: '1px solid #999',
  borderRadius: 3,
  paddingTop: '.2em',
  paddingBottom: '.2em'
};

/*
  This is a controlled input component that only ever shows current state, and updates
  that state with this.props.onChangeCB()
*/
class StringInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  autoSizeInputRef;

  updateInputValue = (event) => {
    // must prevent passing null value, so pass empty string instead
    this.props.onChangeCB(event.target.value || '');
  };

  onFocus = () => {
    // don't show the placeholder when user is inputting numbers
    this.autoSizeInputRef.input.placeholder = '';
    this.setState(() => ({ focused: true }));
  };

  onBlur = () => {
    this.autoSizeInputRef.input.placeholder = this.props.placeholder;
    this.setState(() => ({ focused: false }));
  };

  selectInput() {
    this.autoSizeInputRef.input.select();
  }

  render() {
    const inputStyle = Object.assign(
      { textAlign: (this.props.center ? 'center' : 'auto') },
      inputStyleDefault,
      { padding: '.2em', maxWidth: '6em' }
    );

    return (
      <AutosizeInput
        className='InputContainer StringInput'
        value={this.props.value}
        placeholder={this.props.placeholder}
        placeholderIsMinWidth
        inputStyle={inputStyle}
        onKeyDown={getKeydownCB(() => (this.autoSizeInputRef))}
        onChange={this.updateInputValue}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        ref={(ref) => { this.autoSizeInputRef = ref; }}
      />
    );
  }
}

StringInput.propTypes = {
  center: PropTypes.bool,
  onChangeCB: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
};

StringInput.defaultProps = {
  center: false
};


class PriceInput extends React.Component {
  defaultPlaceholder = '0.00';
  autoSizeInputRef;

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  onChange = (event) => {
    this.props.onChangeCB(event.target.value, false);
  }

  onFocus = () => {
    this.setState(() => ({ focused: true }));

    // don't show the placeholder when user is inputting numbers
    this.autoSizeInputRef.input.placeholder = '';
  }

  selectInput() {
    this.autoSizeInputRef.input.select();
  }

  onBlur = (event) => {
    // only ever send back a string, even if it's an empty string
    const newValue = event.target.value || '';

    // only trigger a price change if the newValue is actually different
    // console.log(newValue, Number(newValue), this.props.priceObj);
    if (Number(newValue) !== this.props.priceObj.num) {
      this.props.onChangeCB(newValue, true);
    }

    this.setState(() => ({ focused: false }));

    this.autoSizeInputRef.input.placeholder = this.defaultPlaceholder;
  }

  render() {
    // if the price input is empty and the input isn't focused, show a pink background
    const inputStyle = Object.assign(
      {}, inputStyleDefault,
      { maxWidth: '4em', textAlign: 'right', paddingRight: '.2em' }
    );
    if (Number(this.props.priceObj.num) === 0 && !this.state.focused) {
      inputStyle.backgroundColor = 'lightgrey';
    }

    let valueToShow = this.props.priceObj.stringRep;
    if (valueToShow === this.defaultPlaceholder) {
      valueToShow = '';
    }

    return (
      <AutosizeInput
        className='InputContainer'
        value={valueToShow}
        type='number'
        min='0'
        step='.01'
        placeholder={this.defaultPlaceholder}
        placeholderIsMinWidth
        inputStyle={inputStyle}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyDown={getKeydownCB(() => (this.autoSizeInputRef))}
        extraWidth={1}
        ref={(inputRef) => { this.autoSizeInputRef = inputRef; }}
      />
    );
  }
}

PriceInput.propTypes = {
  onChangeCB: PropTypes.func.isRequired,
  priceObj: Price.shape.isRequired
};


class PercentInput extends React.Component {
  autoSizeInputRef;

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  onChange = (event) => {
    this.props.onChangeCB(event.target.value, false);
  }

  onFocus = () => {
    this.setState(() => ({ focused: true }));
  }

  selectInput() {
    this.autoSizeInputRef.input.select();
  }

  onBlur = (event) => {
    // only ever send back a string, even if it's an empty string
    const newValue = event.target.value || '';

    // only trigger a price change if the newValue is actually different
    if (Number(newValue) !== this.props.numObj.num) {
      this.props.onChangeCB(newValue, true);
    }

    this.setState(() => ({ focused: false }));
  }

  render() {
    // if the price input is empty and the input isn't focused, show a pink background
    const inputStyle = Object.assign(
      {}, inputStyleDefault,
      { maxWidth: '4em', textAlign: 'right', paddingRight: '.2em' }
    );
    if (Number(this.props.numObj.num) === 0 && !this.state.focused) {
      inputStyle.backgroundColor = 'lightgrey';
    }

    let valueToShow = this.props.numObj.stringRep;
    if (valueToShow === this.defaultPlaceholder) {
      valueToShow = '';
    }

    return (
      <AutosizeInput
        className='InputContainer'
        value={valueToShow}
        type='number'
        min='0'
        step='1'
        placeholder='10'
        placeholderIsMinWidth
        inputStyle={inputStyle}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyDown={getKeydownCB(() => (this.autoSizeInputRef))}
        extraWidth={1}
        ref={(inputRef) => { this.autoSizeInputRef = inputRef; }}
      />
    );
  }
}

// PriceInput.propTypes = {
//   onChangeCB:   PropTypes.func.isRequired,
//   priceObj:     Price.shape.isRequired
// }


// fix for silly % not handling negative well
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Makes the enter key act like a tab (but strictly for inputs)!!
// proud of this workaround generally, and the RefGetter that allows
// easy sharing between components (no 'this' referencing)
function getKeydownCB(inputRefGetter) {
  return (ev) => {
    if (ev.keyCode === 13) { // Enter key (works on mobile too!)
      const inputRef = inputRefGetter();

      if (inputRef) {
        inputRef.blur();

        // get as array rather than NodeList
        const tabableEls =
          [ ...document.querySelectorAll('input, [tabIndex="0"]') ];
        const curIndex = tabableEls.indexOf(inputRef.input);
        if (curIndex === -1) {
          console.warn(`Couldn't find current input. ${inputRef.input.innerHTML}`);
          return;
        }

        // shift/enter moves backwards in the list!!! wrap to the beginning
        const newIndex = mod(curIndex + (ev.shiftKey ? -1 : 1), tabableEls.length);
        const tabbedEl = tabableEls[newIndex];

        // if it has a select function, call it, otherwise call focus
        // because it could be an input, or a div that's going to become an input
        tabbedEl.select ? tabbedEl.select() : tabbedEl.focus();
      }
    }
  };
}

export { StringInput, PriceInput, PercentInput };
