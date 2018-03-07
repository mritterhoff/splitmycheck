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
    const gitURL = 'https://github.com/mritterhoff/splitmycheck#table-of-contents';

    return (
      <div className={ClassNames({ App: true, Debug: false })}>
        <header className='App-header'>
          <h1 className='App-title'>
            <a href='https://www.splitmycheck.com'>Split My Check</a>
          </h1>
        </header>
        <AppIntro useMobileUI={useMobileUI} />
        <Splitter useMobileUI={useMobileUI} />
        <div className='footer'> | <a href={gitURL}>source</a> | </div>
      </div>
    );
  }
}

class AppIntro extends React.Component {
  render() {
    const tapOrClick = this.props.useMobileUI ? 'Tap' : 'Click';
    const howToUseText = `Add people/dishes as appropriate. 
      ${tapOrClick} to rename them, and to set prices, tax and tip 
      percent (mandatory). ${tapOrClick} the grey/green cells to add/remove 
      the dish from someone's order.`;

    return (
      <div>
        <p className='App-intro'> <b>How to use</b>: {howToUseText} </p>
        <p className='App-intro'> <b>Coming soon</b>: History/Undo. </p>
      </div>
    );
  }
}

export default App;
