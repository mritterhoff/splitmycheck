import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import '../css/CellToggle.css';

/*
  This component displays a price and switches state between on and off
  when clicked. It can also be given an error. Its color is dependent on
  on/off/error status.
*/
class CellToggle extends React.Component {
  render() {
    const classNames = ClassNames({
      CellToggle: true,
      on: this.props.on,
      off: !this.props.on,
      error: this.props.hasError
    });

    return (
      <div
        className={classNames}
        onClick={() => { this.props.onClickCB(!this.props.on); }}
      >
        <span>{this.props.price}</span>
      </div>
    );
  }
}

CellToggle.propTypes = {
  on: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  onClickCB: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired
};

export default CellToggle;
