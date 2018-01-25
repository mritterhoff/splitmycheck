import React from 'react'
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';

import { Price } from '../Price.js';

import '../css/Input.css';

let inputStyleDefault = { 
  border: '1px solid #999',
  borderRadius: 3, 
  padding: '.2em 0em',
  textAlign: 'center'
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

  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    let inputStyle = Object.assign({}, inputStyleDefault, this.props.style, {padding: '.2em'});
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


// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
class PriceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  onChange(event) {
    let value = event.target.value;
    console.log('new value from priceInput: ' + value);

    if (typeof value !== 'string') {
      console.log(`was expecting a string, got '${value}'`);
    }

    this.props.onChangeCB(value, false);
  }

  onFocus(event) {
    this.setState((prevState) => ({ focused: true }));

    // don't show the placeholder when user is inputting numbers
    this.inputRef.input.placeholder = '';
  }

  onBlur(event) {
    let newValue = event.target.value || 0;
    this.props.onChangeCB(newValue, true);

    this.setState((prevState) => ({
      focused: false
    }));

    this.inputRef.input.placeholder = '0.00';
  } 



  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    
    // if the price input is empty and the input isn't focused, show a pink background
    let inputStyle = Object.assign({}, inputStyleDefault)
    if (Number(this.props.priceObj.num) === 0 && !this.state.focused) {
      inputStyle.backgroundColor = 'pink';
    }

    return (
      <AutosizeInput
        value={this.props.priceObj.stringRep}
        type="number"
        min="0.01" step="0.01"
        placeholder={'0.00'}
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
// proud of this worrk around generally, and the RefGetter that allows
// easy sharing between components (no 'this' referencing)
function getKeydownCB(inputRefGetter) {
  return (ev) => {
    if (ev.keyCode === 13) {  // Enter key (works on mobile too!)
      const inputRef = inputRefGetter();  
      if (inputRef) {
        inputRef.blur();
        // get as array rather than NodeList
        let inputs = [...document.querySelectorAll('input')];
        let curIndex = inputs.indexOf(inputRef.input)
        if (curIndex === -1) {
          console.warn(`Couldn't find current input. ${inputRef.input.innerHTML}`);
          return;
        }

        // shift enter will move backwards in the input list!!!
        let offSet = ev.shiftKey ? -1 : 1;
        // wrap around to the beginning
        let newIndex = mod(curIndex + offSet, inputs.length);
        inputs[newIndex].select();
      }
    }
  };
}

export {StringInput, PriceInput};