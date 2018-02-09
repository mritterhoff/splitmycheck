// keep this css up here so it has the lowest priorty
import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import App from './components/App';

import './css/index.css';

// disable service works for now
// import registerServiceWorker from './registerServiceWorker';
unregister();

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

// if we're developing locally, change page title to reflect that
if (window.location.hostname === 'localhost') {
  document.querySelector('title').innerHTML = 'DEV SplitMyCheck';
}
