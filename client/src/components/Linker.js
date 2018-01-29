import React from 'react';
import PropTypes from 'prop-types';

import Client from '../Client.js';

class Linker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ""
    };
  }

  onClick() {
    // update the ui to show a request is in progress
    this.setState((prevState) => ({result: 'requesting...'}));

    // Client.search('lindseyiscute', (response, error) => {
    //   console.log(JSON.stringify(response));
    //   this.setState({
    //     result: response.yourQParamWas || error
    //   });
    // });

    Client.save(this.props.getJSON(), (response, error) => {
      this.setState({
        result: response || error
      });
    });

  }
    

  render() {
    return (
      <div className="Linker" style={{ margin: '.2em'}}>
        <a onClick={this.onClick.bind(this)}>Save this split as a link!</a>
        <span> {this.state.result}</span>
      </div>
    );
  }
}

Linker.propTypes = {
  getJSON:  PropTypes.func.isRequired
}

export { Linker };