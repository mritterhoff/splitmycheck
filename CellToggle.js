import React from 'react'

class CellToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  clicked() {
    this.props.callback(!this.props.enabled);
  }

 
  render() {
    let newColor = this.props.enabled 
      ? 'lightgreen' 
      : this.props.enabled == undefined ? 'grey' : 'lightpink';
    let style = {
      width: '100%',
      height: '100%',
      display: 'block',
      padding: '1em',
      background: newColor
    };

    return (
      <span style={style} onClick={this.clicked.bind(this)}>
        {this.props.price}
      </span>
    );
  }
}

export {CellToggle};