import React from 'react'

import AutosizeInput from 'react-input-autosize';

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

class StringInput extends React.Component {
  constructor(props) {
    super(props);

    // if we don't have an initialValue, we must assign one, to avoid the input
    // switching from uncontrolled to controlled and causing an error
    this.state = {value: this.props.initalValue || ''};
  }

  updateInputValue(event) {
    this.setState({value: event.target.value});
  }

  onFocus(event) {
    // don't show the placeholder when user is inputting numbers
    this.inputRef.input.placeholder = '';
  }

  onBlur(event) {
    if (this.props.onBlurCB) {
      this.props.onBlurCB(this.state.value);
    }
    else {
      console.log('todo make onBlur() required');
    }
    this.inputRef.input.placeholder = this.props.placeholder;
  }

  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    let inputStyle = Object.assign({}, inputStyleDefault, this.props.style, {padding: '.2em'});
    return (
      <AutosizeInput
        value={this.state.value}
        placeholder={this.props.placeholder}
        placeholderIsMinWidth
        style={divStyle}
        inputStyle={inputStyle}
        onKeyDown={getKeydownCB(() => (this.inputRef))}
        onChange={this.updateInputValue.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        ref={(inputRef) => { this.inputRef = inputRef; }}
        />
    );
  }
}

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
class PriceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initalValue ? this.props.initalValue.toFixed(2) : '',
      focused: false
    };
  }


  onChange(event) {
    this.updateState(event.target.value);
  }

  onFocus(event) {
    this.setState((prevState) => ({ focused: true }));

    // don't show the placeholder when user is inputting numbers
    this.inputRef.input.placeholder = '';
  }

  onBlur(event) {
    let newValue = Number(this.state.value || 0);
    this.props.onBlurCB(newValue);

    // if the value is going to be 0, set it to '' instead, which will show the placeholder
    this.updateState(newValue ? newValue.toFixed(2) : '');

    this.setState((prevState) => ({
      focused: false
    }));

    this.inputRef.input.placeholder = '0.00';
  }

  updateState(newValue) {
    this.setState((prevState) => ({
      value: newValue
    }));
  }  

  render() {
    let divStyle = Object.assign({ marginLeft: '.4em' }, divContainerStyle, this.props.style);
    
    // if the price input is empty and the input isn't focused, show a pink background
    let inputStyle = Object.assign({}, inputStyleDefault)
    if (Number(this.state.value) === 0 && !this.state.focused) {
      inputStyle.backgroundColor = 'pink';
    }
    return (
      <AutosizeInput
        value={this.state.value}
        type="number"
        min="0.01" step="0.01" max="2500"
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