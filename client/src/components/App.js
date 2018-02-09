import React from 'react';
import ClassNames from 'classnames';

import '../css/App.css';

import Splitter from './Splitter';

class App extends React.Component {
  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  constructor() {
    super();
    this.state = {
      width: window.innerWidth
    };
  }

  // hat tip to: https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  render() {
    const useMobileUI = this.state.width < 500;
    const tapOrClick = useMobileUI ? 'Tap' : 'Click';
    const howToUseText = `Add people/dishes as appropriate. 
      ${tapOrClick} to rename them, and to set prices, tax and tip 
      percent (mandatory). ${tapOrClick} the grey/green cells to add/remove 
      the dish from someone's order.`;
    const gitURL = 'https://github.com/mritterhoff/splitmycheck#table-of-contents';


    return (
      <div className={ClassNames({ App: true, Debug: false })}>
        <header className='App-header'>
          <h1 className='App-title'>
            <a href='https://www.splitmycheck.com'>Split My Check</a>
          </h1>
        </header>
        <p className='App-intro'>
          <b>How to use</b>: {howToUseText}
          <br /><b>Coming soon</b>: Overflow ellipses, History/Undo.<br />
        </p>
        <Splitter useMobileUI={useMobileUI} />
        <div className='footer'> | <a href={gitURL}>source</a> | </div>
      </div>
    );
  }
}

export default App;
