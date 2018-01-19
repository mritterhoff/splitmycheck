import React from 'react'

import AutosizeInput from 'react-input-autosize';

let inputStyleDefault = { 
  border: '1px solid #999',
  borderRadius: 3, 
  padding: '.2em 0em',
  fontSize: 14,
  textAlign: 'center'
};

let divContainerStyle = {
  borderRadius: 5, 
  padding: '.1em'
};

class StringInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.initalValue};
  }

  updateInputValue(event) {
    let newValue = event.target.value;
    this.setState({value: newValue});
  }

  render() {
    let divStyle = Object.assign({}, divContainerStyle, this.props.style);
    let inputStyle = Object.assign({}, inputStyleDefault, this.props.style, {padding: '.2em'});
    return (
      <AutosizeInput
        placeholder={this.props.placeholder}
        placeholderIsMinWidth
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        style={divStyle}
        inputStyle={inputStyle}
        onKeyDown={getKeydownCB(() => (this.asInput))}
        ref={(asInput) => { this.asInput = asInput; }}
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
    if (ev.keyCode === 13) {
      const inputRef = inputRefGetter();  
      if (inputRef) {
        inputRef.blur();
        // get as array rather than NodeList
        let inputs = [...document.querySelectorAll('input')];
        let curIndex = inputs.indexOf(inputRef.input)
        if (curIndex == -1) {
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


// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
class PriceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.getDefaultValue(this.props.initalValue),
      focused: false
    };
  }

  getDefaultValue(initalValue) {
    if (initalValue) {
      return initalValue.toFixed(2);
    }
    return '';  
  }

  updateInputValue(event) {
    this.updateState(event.target.value);
  }

  onFocus(event) {
    this.setState((prevState) => ({
      focused: true
    }));
  }

  onBlur(event) {
    let newValue = Number(this.state.value || 0);
    this.updateState(newValue.toFixed(2));
    this.props.onBlurCB(newValue);
    this.setState((prevState) => ({
      focused: false
    }));
  }

  updateState(newValue) {
    this.setState({value: newValue});
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
        placeholder={'0.00'}
        type="number"
        min="0.01" step="0.01" max="2500"
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onFocus={this.onFocus.bind(this)}
        style={divStyle}
        inputStyle={inputStyle}
        onKeyDown={getKeydownCB(() => (this.asInput))}
        ref={(asInput) => { this.asInput = asInput; }}
      />
    );
  }
}

export {StringInput, PriceInput};