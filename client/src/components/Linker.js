import React from 'react';

import Client from '../Client';

import '../css/Linker.css';

const STATUS = {
  NONE: 'none',
  REQUESTING: 'requesting',
  ERROR: 'error',
  COMPLETE: 'complete'
};

class Linker extends React.Component {
  // holds request timeout id
  _timeoutID;

  constructor(props) {
    super(props);
    this.state = {
      link: '',
      lastSentData: '',
      requestStatus: STATUS.NONE
    };
  }

  onClick = () => {
    // update the ui to show a request is in progress
    this.setState(() => ({
      requestStatus: STATUS.REQUESTING
    }));

    // set a timeout to display "error" if we don't hear back soon
    this._timeoutID = setTimeout(() => {
      this.setState(() => ({
        requestStatus: STATUS.ERROR
      }));
    }, 2000);

    const dataString = JSON.stringify(this.props.dataToSend);
    Client.save(dataString, (response, error) => {
      // we heard back, so cancel the timeout
      clearTimeout(this._timeoutID);
      this.setState(() => ({
        link: response || error,
        lastSentData: dataString,
        requestStatus: STATUS.COMPLETE
      }));
    });
  };

  getLinkOrStatus() {
    const userTextMap = {
      [STATUS.REQUESTING]: ' ...requesting',
      [STATUS.ERROR]: ' error getting link',
      [STATUS.NONE]: ''
    };

    if (this.state.requestStatus !== STATUS.COMPLETE) {
      return <span>{userTextMap[this.state.requestStatus]}</span>;
    }

    return (
      <a
        target='_blank'
        style={{ marginLeft: '.5em' }}
        href={this.hrefPrefix() + this.state.link}
      >
        {this.state.link}
      </a>
    );
  }

  // keep us on https if we're not running locally
  hrefPrefix = () => (
    this.state.link.match(/localhost/) ? 'http://' : 'https://'
  )

  render() {
    // disable the button if we're requesting the url, or we haven't got new data to send
    const disableButton = (this.state.requestStatus === STATUS.REQUESTING)
      || (this.state.lastSentData === JSON.stringify(this.props.dataToSend));

    return (
      <div className='Linker' style={{ margin: '.2em' }}>
        <button onClick={this.onClick} disabled={disableButton}>
          Get split link
        </button>
        {this.getLinkOrStatus()}
      </div>
    );
  }
}

export default Linker;
