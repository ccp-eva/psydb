import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datetime/css/react-datetime.css';
import './custom.css';

import withAppIsolation from './with-app-isolation';

const withDOMIsolation = (Component) => {
    var App = withAppIsolation(Component);

    ReactDOM.render((
        <App />
    ), document.getElementById('app'));
}

export default withDOMIsolation;
