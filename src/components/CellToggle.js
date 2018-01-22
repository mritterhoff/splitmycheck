import React from 'react'

import '../css/CellToggle.css'

class CellToggle extends React.Component {
  clicked() {
    this.props.callback(!this.props.enabled);
  }

 
  render() {
    let newColor = this.props.enabled 
      ? 'lightgreen' 
      : this.props.enabled === undefined ? 'grey' : 'lightpink';
    let style = {
      background: newColor
    };

    return (
      <span className='CellToggle' style={style} onClick={this.clicked.bind(this)}>
        {this.props.price}
      </span>
    );
  }
}

export {CellToggle};