import React from 'react';

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
    // disable the button if we're requesting the url, or we haven't got new data to send
    let disableButton = this.state.requesting 
      || (this.state.lastSentDataString === JSON.stringify(this.props.dataToSend));

    return (
      <div className='Linker' style={{ margin: '.2em'}}>
        <button onClick={this.onClick.bind(this)} disabled={disableButton}>
          Get split link
        </button>
        <a target='_blank' 
          style={{'marginLeft': '.5em'}} 
          href={'http://' + this.state.result}>
            {this.state.result}
          </a>
      </div>
    );
  }
}

export { Linker };