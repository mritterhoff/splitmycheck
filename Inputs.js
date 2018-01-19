import React from 'react'

import AutosizeInput from 'react-input-autosize';

class StringInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.initalValue};
  }

  updateInputValue(event) {
    let newValue = event.target.value;
    this.setState({value: newValue});
    console.log(`newvalue is ${newValue}`);
  }

  render() {
    let style = Object.assign({ borderRadius: 1, padding: '.1em' }, this.props.style);
    return (
      <AutosizeInput
        placeholder={this.props.placeholder}
        placeholderIsMinWidth
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        style={style}
        inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}
        />
    );
  }
}

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript

class PriceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.getDefaultValue(this.props.initalValue)};
  }

  getDefaultValue(initalValue) {
    if (initalValue) {
      return initalValue.toFixed(2);
    }
    return '';  
  }

  updateInputValue(event) {
    this.setNumber(event.target.value);
  }

  onBlur(event) {
    let newValue = Number(this.state.value || 0);
    newValue = newValue.toFixed(2);
    this.setNumber(newValue);
    console.log('blurring!');

    this.props.onBlurCB(newValue);
  }

  setNumber(newValue) {
    this.setState({value: newValue});
    console.log(`newvalue is ${newValue}`);
  }

  keydown(ev) {
    // if(ev.keyCode===13) {
    //   console.log(this.asInput);
    //   if (this.asInput) {
    //     this.asInput.blur();
    //   }
    // }
    console.info(ev.keyCode);
    document.getElementById('debug').innerText = ev.keyCode;
  }

  render() {
    let style = Object.assign({ borderRadius: 5, padding: '.1em', marginLeft: '.4em' }, this.props.style);
    return (
      <AutosizeInput
        placeholder={'0.00'}
        type="number"
        min="0.01" step="0.01" max="2500"
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        onBlur={this.onBlur.bind(this)}
        style={style}
        inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14, textAlign: 'center' }}
        onKeyDown={this.keydown.bind(this)}
        // ref={(asInput) => { this.asInput = asInput; }}
      />
    );
  }
}

export {StringInput, PriceInput};