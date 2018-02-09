import React from 'react';
import PropTypes from 'prop-types';

import '../css/ButtonBar.css';

class ButtonBar extends React.Component {
  render() {
    return (
      <div className='buttonBar'>
        <div className='buttonGroup multi'>
          <button onClick={() => this.props.removeDishFunc()}>-</button>
          <span>Dish</span>
          <button onClick={() => this.props.addDishFunc()}>+</button>
        </div>
        <div className='buttonGroup multi'>
          <button onClick={() => this.props.removePersonFunc()}>-</button>
          <span>Person</span>
          <button onClick={() => this.props.addPersonFunc()}>+</button>
        </div>
        <div className='buttonGroup single'>
          <button onClick={() => this.props.resetFunc()}>
            <span>Reset</span>
          </button>
        </div>
        <div className='buttonGroup single'>
          <button onClick={() => this.props.showExampleFunc()}>
            <span>Example</span>
          </button>
        </div>
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
};

export default ButtonBar;
