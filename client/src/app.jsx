import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from './reducers/root.jsx';

import Layout from './pages/layout.jsx';
import HomePage from './pages/home.jsx';
import ReportPage from './pages/report.jsx';

import EditHomePage from './pages/edit/home.jsx';
import EditReportPage from './pages/edit/report.jsx';
import EditBlockPage from './pages/edit/block.jsx';
import EditControllerPage from './pages/edit/controller.jsx';
import EditModelPage from './pages/edit/model.jsx';


document.addEventListener('DOMContentLoaded', () => {
    const loggerMiddleware = createLogger();

    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )(createStore);

    const store = createStoreWithMiddleware(rootReducer);

    render((
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={HomePage} />
                    <Route path="report/:reportId" component={ReportPage} />
                </Route>
                <Route path="/edit" component={Layout}>
                    <IndexRoute component={EditHomePage} />
                    <Route path="report/" component={EditReportPage} />
                    <Route path="report/:reportId" component={EditReportPage} />
                    <Route path="block/" component={EditBlockPage} />
                    <Route path="block/:blockId" component={EditBlockPage} />
                    <Route path="block/:blockId/controller" component={EditControllerPage} />
                    <Route path="block/:blockId/model/:modelIndex" component={EditModelPage} />
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('main'));
}, false);
