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
      requesting: true
    }));

    let dataString = JSON.stringify(this.props.dataToSend);
    console.log(dataString);

    Client.save(dataString, (response, error) => {
      this.setState({
        link: response || error,
        lastSentDataString: dataString,
        requesting: false
      });
    });
  }

  getLinkOrStatus() {
    if (this.state.requesting) {
      return <span> ... requesting </span>;
    }
    if (!this.state.link) {
      return <span></span>
    }

    // keep us on https if we're not running locally
    let hrefPrefix = this.state.link.match(/localhost/) ? 'http://' : 'https://';
    return (
      <a target='_blank' 
        style={{'marginLeft': '.5em'}} 
        href={hrefPrefix + this.state.link}>
          {this.state.link}
      </a>
      );
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
        {this.getLinkOrStatus()}
      </div>
    );
  }
}

export { Linker };