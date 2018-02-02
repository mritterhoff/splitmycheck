import React from 'react';

import { StringInput, PriceInput } from './Inputs'

import { Utils } from '../Utils'

class DishRowHeader extends React.Component {
  
  _timeoutID;

  constructor(props) {
    super(props);
    this.state = {
      // focused: false
      isManagingFocus: false
    };
  }

  // onFocus(event) {
  //   this.setState(prevState => {
  //     return {focused: true}
  //   });

  //   console.log('Headercell is FOCUSSED');
  // }

  // onBlur(event) {
  //   // this should check if either of the children inputs have focus
  //   // with refs? or some other way
  //   // or 
  //   // this.setState(prevState => {
  //   //   return {focused: false}
  //   // });

  //   console.log('Headercell is blured');
  // }

  log(str) {
    console.log(`DHR${this.props.dInd} ${str}`);
  }

  componentDidUpdate() {
    this.log(`isManagingFocus is now: ${this.state.isManagingFocus}`);
    if (this.state.isManagingFocus && this.stringInputRef) {
      //this.stringInputRef.selectInput();
      this.log('would like to focused to stringInput here');
    }
  }

  _onBlur() {
    // this.log('is going to blur');
    this._timeoutID = setTimeout(() => {
      if (this.state.isManagingFocus) {
        this.setState({
          isManagingFocus: false
        });
      }
    }, 0);
  }
  
  _onFocus() {
    // this.log('is going to focus');
    clearTimeout(this._timeoutID);
    if (!this.state.isManagingFocus) {
      this.setState({
        isManagingFocus: true
      });

    }
  }

  render() {
    let style = {
      width: 'max-content',
      padding: '.5em', // make it easier to select them
      backgroundColor: (this.state.isManagingFocus ? 'lightblue' : 'lavender')
    };

    return (
      <div className='DishRowHeader'
        tabIndex='0' 
        style={style}
        onBlur={this._onBlur.bind(this)}
        onFocus={this._onFocus.bind(this)}>
          {this.getInnerDisplay()}
      </div>
    );
  }

  getInnerDisplay() {
    let dInd = this.props.dInd;
    let placeholder = `Dish ${dInd + 1}`;

    if (this.state.isManagingFocus || !this.props.useMobileUI) {
      return (
        [<StringInput 
          placeholder= {placeholder}
          value = {this.props.dish.name}
          onChangeCB = {this.props.setDishNameCBGetter(dInd)}
          ref={(stringInputRef) => { this.stringInputRef = stringInputRef; }}
          key='1'/>,
        <PriceInput 
          priceObj = {this.props.dish.price}
          onChangeCB = {this.props.setDishPriceCBGetter(dInd)} 
          key='2'/>]
      );
    }
    
    let dish = this.props.dish.name || placeholder;
    let price = Utils.priceAsString(this.props.dish.price.num);
    return (
      <span>{dish} - {price}</span>
    );
  }
}

export { DishRowHeader };