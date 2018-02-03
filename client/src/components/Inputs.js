import React from 'react'
import PropTypes from 'prop-types'
import AutosizeInput from 'react-input-autosize'

import { Price } from '../Price'

import '../css/Inputs.css'

let inputStyleDefault = { 
  border: '1px solid #999',
  borderRadius: 3, 
  paddingTop: '.2em',
  paddingBottom: '.2em',
};

let divContainerStyle = {
  borderRadius: 5, 
  padding: '.1em'
};

// This is a controlled component that only ever shows current state, and updates
// that state with this.props.onChangeCB()
class StringInput extends React.Component {
  updateInputValue(event) {
    // must prevent passing null value, so pass empty string instead
    this.props.onChangeCB(event.target.value || '');
  }

  onFocus(event) {
    // don't show the placeholder when user is inputting numbers
    this.inputRef.input.placeholder = '';
  }

  onBlur(event) {
    this.inputRef.input.placeholder = this.props.placeholder;
  }

  selectInput() {
    this.inputRef.input.select();
  }

  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    let inputStyle = Object.assign({}, inputStyleDefault, this.props.style,
      {padding: '.2em', maxWidth: '6em'});
    return (
      <AutosizeInput
        value={this.props.value}
        placeholder={this.props.placeholder}
        placeholderIsMinWidth
        style={divStyle}
        inputStyle={inputStyle}
        onKeyDown={getKeydownCB(() => (this.inputRef))}
        onChange={this.updateInputValue.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        ref={(inputRef) => { this.inputRef = inputRef; }}/>
    );
  }
}

StringInput.propTypes = {
  style:        PropTypes.object,
  onChangeCB:   PropTypes.func.isRequired,
  value:        PropTypes.string.isRequired,
  placeholder:  PropTypes.string.isRequired
}


class PriceInput extends React.Component {
  defaultPlaceholder = '0.00';

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  onChange(event) {
    this.props.onChangeCB(event.target.value, false);
  }

  onFocus(event) {
    this.setState((prevState) => ({ focused: true }));

    // don't show the placeholder when user is inputting numbers
    this.inputRef.input.placeholder = '';
  }

  onBlur(event) {
    // only ever send back a string, even if it's an empty string
    let newValue = event.target.value || '';

    // only trigger a price change if the newValue is actually different
    // console.log(newValue, Number(newValue), this.props.priceObj);
    if (Number(newValue) !== this.props.priceObj.num) {
      this.props.onChangeCB(newValue, true);
    }

    this.setState((prevState) => ({
      focused: false
    }));

    this.inputRef.input.placeholder = this.defaultPlaceholder;
  }

  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    
    // if the price input is empty and the input isn't focused, show a pink background
    let inputStyle = Object.assign({}, inputStyleDefault, 
      {maxWidth: '4em', textAlign: 'right', paddingRight: '.2em',})
    if (Number(this.props.priceObj.num) === 0 && !this.state.focused) {
      inputStyle.backgroundColor = 'lightgrey';
    }

    let valueToShow = this.props.priceObj.stringRep;
    if (valueToShow === this.defaultPlaceholder) {
      valueToShow = '';
    }

    return (
      <AutosizeInput
        value={valueToShow}
        type="number"
        min = "0" step="0.01"
        placeholder={this.defaultPlaceholder}
        placeholderIsMinWidth
        style={divStyle}
        inputStyle={inputStyle}
        onChange={this.onChange.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onKeyDown={getKeydownCB(() => (this.inputRef))}
        ref={(inputRef) => { this.inputRef = inputRef; }}
      />
    );
  }
}

PriceInput.propTypes = {
  onChangeCB:   PropTypes.func.isRequired,
  priceObj:     Price.shape.isRequired
}




// fix for silly % not handling negative well
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Makes the enter key act like a tab (but strictly for inputs)!!
// proud of this workaround generally, and the RefGetter that allows
// easy sharing between components (no 'this' referencing)
function getKeydownCB(inputRefGetter) {
  return (ev) => {
    if (ev.keyCode === 13) {  // Enter key (works on mobile too!)
      const inputRef = inputRefGetter();  
      if (inputRef) {
        inputRef.blur();
        // get as array rather than NodeList
        let tabableElements = [...document.querySelectorAll('input, .DishRowHeaderContainer[tabIndex="0"]')];
        let curIndex = tabableElements.indexOf(inputRef.input)
        if (curIndex === -1) {
          console.warn(`Couldn't find current input. ${inputRef.input.innerHTML}`);
          return;
        }

        // shift/enter moves backwards in the list!!! wrap to the beginning
        let newIndex = mod(curIndex + (ev.shiftKey ? -1 : 1), tabableElements.length);
        let v = tabableElements[newIndex];
        
        // if it is an input, we select it, if it's a DishRowHeader, focus on it
        v.select ? v.select() : v.focus();
      }
    }
  };
}

export {StringInput, PriceInput};