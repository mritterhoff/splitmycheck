import React from 'react'
import PropTypes from 'prop-types';

import '../css/CellToggle.css'

class CellToggle extends React.Component {
  render() {
    return (
      <div 
        className={this.getClassNames()} 
        onClick={() => {this.props.onClickCB(!this.props.on)}}>
        <span>
            {this.props.price}
        </span>
      </div>
    );
  }

  getClassNames() {
    let names = 'CellToggle';
    names += this.props.on ? ' on' : ' off';
    if (this.props.hasError) { names += ' error'; }
    return names;
  }
}

CellToggle.propTypes = {
  on:         PropTypes.bool.isRequired,
  hasError:   PropTypes.bool.isRequired,
  onClickCB:  PropTypes.func.isRequired,
  price:      PropTypes.string.isRequired
}

export {CellToggle};