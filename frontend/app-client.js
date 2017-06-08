/**
 * Created by Fredrik on 2017-04-03.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes';

window.onload = () => {
    ReactDOM.render(<AppRoutes />, document.getElementById('app'));
};