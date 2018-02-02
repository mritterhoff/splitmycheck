import React from 'react';

import { StringInput, PriceInput } from './Inputs'

import { Utils } from '../Utils'

import '../css/DishRowHeader.css'

// Focus massively improved by https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
class DishRowHeader extends React.Component {
  // holds blur timeout id
  _timeoutID;

  constructor(props) {
    super(props);
    this.state = {
      // if one of this element's children is focussed
      isManagingFocus: false
    };
  }

  // helpful debugging method
  log(str) {
    console.log(`DHR${this.props.dInd} ${str}`);
  }

  componentDidUpdate(prevProps, prevState) {
    this.log(`isManagingFocus is now: ${this.state.isManagingFocus}, was ${prevState.isManagingFocus}`);
    
    // only select the first input if we're NEWLY focussed
    if (this.state.isManagingFocus && !prevState.isManagingFocus && this.stringInputRef) {
      this.stringInputRef.selectInput();
      this.log('would like to focused to stringInput here');
    }
  }

  _onBlur() {
    this.log('is going to blur');
    this._timeoutID = setTimeout(() => {
      if (this.state.isManagingFocus) {
        this.setState(prevState => ({
          isManagingFocus: false
        }));
      }
    }, 0);
  }
  
  _onFocus() {
    this.log('is going to focus');
    clearTimeout(this._timeoutID);
    if (!this.state.isManagingFocus) {
      this.setState(prevState => ({
        isManagingFocus: true
      }));
    }
    else {
      console.log(document.activeElement);
    }
  }

  render() {
    // vertically align child span element when appropriate
    let className='DishRowHeader';
    if (this.props.useMobileUI && !this.state.isManagingFocus) {
      className += ' flexVertCenter'
    }

    // SO PROUD OF THIS
    // makes it so that if this element is managing focus, it can't be selected!!
    let tabIndex = this.state.isManagingFocus ? '-1' : '0';

    return (
      <div className={className}
        tabIndex={tabIndex}
        onBlur={this._onBlur.bind(this)}
        onFocus={this._onFocus.bind(this)}
        ref={(drhRef) => { this.drhRef = drhRef; }}>
          {this.getInnerDisplay()}
      </div>
    );
  }

  // https://css-tricks.com/centering-css-complete-guide/

  // TODO This would be nicer and more consistent if we used a monospace font (ugly)
  // or figured out the actual rendered length of the partial strings (tedius)
  limitToXChars(input, limit) {
    return input.length <= limit + 3
      ? input
      : input.substring(0, limit) + '...';
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

    // if we're using mobile and we're not focused
    
    let dish = this.limitToXChars(this.props.dish.name || placeholder, 12);
    let price = Utils.priceAsString(this.props.dish.price.num, false);
    return (
      <span>{dish} {price}</span>
    );
  }
}

export { DishRowHeader };