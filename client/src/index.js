import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';

// keep these up here so they have lowest priorty
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './css/index.css';
import App from './components/App.js';


// disable service works for now
//import registerServiceWorker from './registerServiceWorker';
unregister();


ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

// if we're developing locally, change page title to reflect that
if (window.location.hostname === 'localhost') {
  document.querySelector('title').innerHTML = 'DEV SplitMyCheck';
}
