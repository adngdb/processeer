import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/home.jsx';
import ReportPage from './pages/report.jsx';

import EditHomePage from './pages/edit/home.jsx';
import EditReportPage from './pages/edit/report.jsx';
import EditBlockPage from './pages/edit/block.jsx';
import EditModelPage from './pages/edit/model.jsx';


export default function Routes() {
    return <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/report/:reportId" component={ReportPage} />
        <Route path="/edit/report/:reportId" component={EditReportPage} />
        <Route exact path="/edit/report/" component={EditReportPage} />
        <Route path="/edit/block/:blockId/model/:modelIndex" component={EditModelPage} />
        <Route path="/edit/block/:blockId" component={EditBlockPage} />
        <Route exact path="/edit/block/" component={EditBlockPage} />
        <Route exact path="/edit/" component={EditHomePage} />
        <Route component={HomePage} />
    </Switch>;
}
