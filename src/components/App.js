import React, { Component } from 'react';
import '../css/App.css';
import Splitter from './Splitter.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showExample: window.location.search.slice(1) === 'example'
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Split My Check</h1>
        </header>
        <p className="App-intro">
          <b>How to use</b>: Add people/dishes as needed with the + and - buttons. Click to rename them (optional) and to set prices, tax and tip (mandatory). Touch the red/green cells to add/remove the dish from the person's order. What everyone owes is at the bottom.
          <br/><b>Coming soon</b>: Tip calculator. Link saving/sharing. History/Undo. Better rounding.<br/>
        </p>
        <Splitter/>
      </div>
    );
  }
}

export default App;
