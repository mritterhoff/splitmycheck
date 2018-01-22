import React, { Component } from 'react';
import '../css/App.css';
import Splitter from './Splitter.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to SplitMyCheck.com v2!</h1>
        </header>
        <p className="App-intro">
          <b>How to use</b>: Add people/dishes as needed, click to rename them (optional) and to set prices, tax and tip (mandatory). Touch the red/green cells to add/remove the dish from the  person's order. What everyone owes is at the bottom.
          <br/><b>Coming soon</b>: Tip calculator. Link saving/sharing. Prettier UI. History/Undo. Row/col contraint checking. Removing ~FOUC. Better rounding. Share source code. Example optional.
        </p>
        <Splitter/>
      </div>
    );
  }
}

export default App;
