import React from 'react'
import PropTypes from 'prop-types';

import '../css/CellToggle.css'

class CellToggle extends React.Component {
  render() {
    return (
      <div 
        className={'CellToggle ' + (this.props.on ? 'on' : 'off')} 
        onClick={() => {this.props.onClickCB(!this.props.on)}}>
        <span>
            {this.props.price}
        </span>
      </div>
    );
  }
}

CellToggle.propTypes = {
  on:         PropTypes.bool.isRequired,
  onClickCB:  PropTypes.func.isRequired,
  price:      PropTypes.string.isRequired
}

export {CellToggle};