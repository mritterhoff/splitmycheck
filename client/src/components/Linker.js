import React from 'react';
// import PropTypes from 'prop-types';

import Client from '../Client.js';

import '../css/Linker.css'

class Linker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      lastSentDataString: ''
    };
  }

  onClick() {
    // update the ui to show a request is in progress
    this.setState((prevState) => ({
      result: 'requesting...',
      requesting: true
    }));

    let dataString = JSON.stringify(this.props.dataToSend);
    console.log(dataString);

    Client.save(dataString, (response, error) => {
      this.setState({
        result: response || error,
        lastSentDataString: dataString,
        requesting: false
      });
    });
  }

  render() {
    let disableButton = this.state.requesting || (this.state.lastSentDataString === JSON.stringify(this.props.dataToSend));

    return (
      <div className="Linker" style={{ margin: '.2em'}}>
        <button onClick={this.onClick.bind(this)} disabled={disableButton}>
          Get split link
        </button>
        <span> {this.state.result}</span>
      </div>
    );
  }
}

// Linker.propTypes = {
//   getDataToSend:  PropTypes.func.isRequired
// }

export { Linker };