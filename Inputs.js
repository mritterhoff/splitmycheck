import React from 'react'

import AutosizeInput from 'react-input-autosize';

class NameForm_old extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.initalValue};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let newValue = event.target.value;
    this.setState({value: newValue});
  }

  render() {
    return (
      <input type="text" value={this.state.value} onChange={this.handleChange} />
    );
  }
}

class StringInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  updateInputValue(event) {
    let newValue = event.target.value;
    this.setState({value: newValue});
    console.log(`newvalue is ${newValue}`);
  }

  render() {
    return (
      <AutosizeInput
        placeholder={this.props.initalValue}
        placeholderIsMinWidth
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        style={{ background: '#eee', borderRadius: 1, padding: 1 }}
        inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}
        />
    );
  }
}

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript

class PriceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  updateInputValue(event) {
    this.setNumber(event.target.value);
  }

  onBlur(event) {
    let newValue = Number(this.state.value || 0);
    newValue = newValue.toFixed(2);
    this.setNumber(newValue);
    console.log('blurring!');
  }

  setNumber(newValue) {
    this.setState({value: newValue});
    console.log(`newvalue is ${newValue}`);
  }

  render() {
    return (
      <AutosizeInput
        placeholder={'0.00'}
        type="number"
        min="0.01" step="0.01" max="2500"
        value={this.state.value}
        onChange={this.updateInputValue.bind(this)}
        onBlur={this.onBlur.bind(this)}
        style={{ background: '#eee', borderRadius: 5, padding: 5 }}
        inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14, textAlign: 'center' }}
      />
    );
  }
}


export {StringInput, PriceInput};