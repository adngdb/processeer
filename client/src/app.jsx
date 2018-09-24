import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';

import { applyMiddleware, compose, createStore } from 'redux';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import hello from 'hellojs';

import history from './history.jsx';
import Routes from './routes.jsx';
import rootReducer from './reducers/root.jsx';

import Layout from './pages/layout.jsx';


document.addEventListener('DOMContentLoaded', () => {
    // Init sign-in library.
    hello.init({
        github: process.env.GITHUB_CLIENT_PUBLIC_ID,
    }, {
        redirect_uri: '/redirect.html',
    });

    const loggerMiddleware = createLogger();

    const store = createStore(
        connectRouter(history)(rootReducer),
        {},
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunkMiddleware,
                loggerMiddleware,
            ),
        ),
    );

    render((
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Layout>
                    <Routes />
                </Layout>
            </ConnectedRouter>
        </Provider>
    ), document.getElementById('main'));
}, false);
