import React from 'react'
import PropTypes from 'prop-types';

import '../css/CellToggle.css'

class CellToggle extends React.Component {
  render() {
    return (
      <span 
        className={'CellToggle ' + (this.props.on ? 'on' : 'off')} 
        onClick={() => {this.props.onClickCB(!this.props.on)}}>
          {this.props.price}
      </span>
    );
  }
}

CellToggle.propTypes = {
  on:         PropTypes.bool.isRequired,
  onClickCB:  PropTypes.func.isRequired,
  price:      PropTypes.string.isRequired
}

export {CellToggle};