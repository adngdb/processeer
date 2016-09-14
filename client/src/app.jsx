import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from './reducers.jsx';

import Layout from './pages/layout.jsx';
import HomePage from './pages/home.jsx';
import ViewPage from './pages/view.jsx';

import EditHomePage from './pages/edit/home.jsx';
import EditViewPage from './pages/edit/view.jsx';
import EditReportPage from './pages/edit/report.jsx';
import EditControllerPage from './pages/edit/controller.jsx';
import EditModelPage from './pages/edit/model.jsx';


document.addEventListener('DOMContentLoaded', function() {
    const loggerMiddleware = createLogger();

    const createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )(createStore);

    let store = createStoreWithMiddleware(rootReducer);

    render((
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={HomePage} />
                    <Route path="view/:viewId" component={ViewPage} />
                </Route>
                <Route path="/edit" component={Layout}>
                    <IndexRoute component={EditHomePage} />
                    <Route path="view/" component={EditViewPage} />
                    <Route path="view/:viewId" component={EditViewPage} />
                    <Route path="report/" component={EditReportPage} />
                    <Route path="report/:reportId" component={EditReportPage} />
                    <Route path="report/:reportId/controller" component={EditControllerPage} />
                    <Route path="report/:reportId/model/:modelIndex" component={EditModelPage} />
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('main'));
}, false);
