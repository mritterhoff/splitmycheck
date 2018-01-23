import React from 'react';
import PropTypes from 'prop-types';

let divStyle = {
  backgroundColor: 'lightgray',
  display: 'inline-block',
  padding: '.1em'
};

let spanStyle = {
  padding: '.5em'
};

let barStyle = {
  margin: 'auto',
  width: 'auto',
  padding: '.5em'
};

class ButtonBar extends React.Component { 
  render() {
    return (
      <div style = {barStyle}>
        <div style = {divStyle}>
          <button onClick={() => this.props.removeDishFunc()}>-</button>
          <span style = {spanStyle}>Dish</span>
          <button onClick={() => this.props.addDishFunc()}>+</button>
        </div>       
        <div style={{width: '1em', display: 'inline-block'}}></div>
        <div style = {divStyle}>
          <button onClick={() => this.props.removePersonFunc()}>-</button>
          <span style = {spanStyle}>Person</span>
          <button onClick={() => this.props.addPersonFunc()}>+</button>
        </div>
        <div style={{width: '1em', display: 'inline-block'}}></div>
        <button onClick={() => this.props.resetFunc()}>Reset</button>
        <div style={{width: '1em', display: 'inline-block'}}></div>
        <button onClick={() => this.props.showExampleFunc()}>Show Example</button>
      </div>  
    );
  }
}

ButtonBar.propTypes = {
  addPersonFunc: PropTypes.func.isRequired,
  removePersonFunc: PropTypes.func.isRequired,
  addDishFunc: PropTypes.func.isRequired,
  removeDishFunc: PropTypes.func.isRequired,
  resetFunc: PropTypes.func.isRequired,
  showExampleFunc: PropTypes.func.isRequired
}

export {ButtonBar};