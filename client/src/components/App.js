import React, { Component } from 'react';
import '../css/App.css';
import Splitter from './Splitter.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };
  }

  // hat tip to: https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listenerwhen the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            <a href='https://www.splitmycheck.com'>Split My Check</a>
          </h1>
        </header>
        <p className="App-intro">
          <b>How to use</b>: Add people/dishes as needed with the + and - buttons. Click to rename them (optional) and to set prices, tax and tip (mandatory). Touch the grey/green cells to add/remove the dish from the person's order. What everyone owes is at the bottom.
          <br/><b>Coming soon</b>: Tip calculator. History/Undo. Better rounding.<br/>
        </p>
        <Splitter useMobileUI={this.state.width < 500}/>
        <div className='footer'> | <a href="https://github.com/mritterhoff/splitmycheck#table-of-contents">source</a> | </div>
      </div>
    );
  }
}

export default App;
