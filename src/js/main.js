import React from 'react';
import ReactDOM from 'react-dom';
import loadPolyfills from './load-polyfills';
import styles from './main.scss'
import Loadable from 'react-loadable';


const StreamingCalculator = Loadable({
  loader: () => import(
    './components/StreamingCalculator'
    ),
  loading: () => <p>Loading...</p>
});


loadPolyfills().then(() => {
  ReactDOM.render(
    <StreamingCalculator />,
    document.getElementById('iea'));
});
